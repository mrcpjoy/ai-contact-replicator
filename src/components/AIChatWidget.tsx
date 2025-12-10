import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const MAX_MESSAGE_LENGTH = 1000;

interface AIChatWidgetProps {
  defaultOpen?: boolean;
  embedded?: boolean;
}

const AIChatWidget = ({ defaultOpen = false, embedded = false }: AIChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sanitizeInput = (text: string): string => {
    // Trim whitespace
    let sanitized = text.trim();
    // Remove control characters (except newlines and tabs)
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    return sanitized;
  };

  const sendMessage = async () => {
    const sanitizedInput = sanitizeInput(input);
    
    if (!sanitizedInput || isLoading) return;

    // Client-side validation
    if (sanitizedInput.length > MAX_MESSAGE_LENGTH) {
      toast({
        title: "Message too long",
        description: `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`,
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: sanitizedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-proxy', {
        body: { question: userMessage.content }
      });

      if (error) {
        throw new Error(error.message || 'Failed to get response');
      }

      // Handle array response from n8n
      const responseData = Array.isArray(data) ? data[0] : data;
      
      // Check for error response from edge function
      if (responseData?.error) {
        throw new Error(responseData.error);
      }
      
      // Gracefully handle missing or empty answers
      let answer = "Sorry, I couldn't find a clear answer to that just now. Please try again or call us on 01827 317071.";
      if (responseData && typeof responseData === "object" && "answer" in responseData && responseData.answer) {
        answer = String(responseData.answer);
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again or call us on 01827 317071.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Limit input length on the client side as well
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setInput(value);
    }
  };

  return (
    <>
      {/* Floating Chat Button - Only visible when closed and NOT embedded */}
      {!embedded && !isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Pulse animation ring */}
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          
          <Button
            onClick={() => setIsOpen(true)}
            className="relative h-16 px-6 rounded-full shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105 flex items-center gap-3 text-base font-semibold"
          >
            <MessageCircle className="h-6 w-6" />
            <span>AI Concierge</span>
          </Button>
        </div>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className={cn(
          "flex flex-col z-50 overflow-hidden",
          embedded 
            ? "w-[420px] h-[650px] max-w-full" 
            : "fixed bottom-6 right-6 w-[90vw] h-[80vh] max-w-[420px] max-h-[650px] md:w-96 md:h-[600px] md:max-w-none md:max-h-none shadow-2xl rounded-lg"
        )}>
          <div className="bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between py-4 px-6 shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="text-lg font-semibold">AI Concierge</span>
            </div>
            {!embedded && (
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden bg-card rounded-b-lg">
            {/* Messages Area */}
            <ScrollArea className="flex-1 pr-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="space-y-2">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Hi! I'm your AI Concierge.
                      <br />
                      How can I help you today?
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-4 py-2",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
                maxLength={MAX_MESSAGE_LENGTH}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 -mx-1">
              <Button
                variant="outline"
                className="flex-1 text-sm border-primary text-primary hover:bg-primary/10 hover:text-primary"
                onClick={() => window.open('https://api.theadmarket.com/widget/booking/hNerAKSDNHiBruFn4ieF', '_blank')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-sm border-primary text-primary hover:bg-primary/10 hover:text-primary"
                onClick={() => window.open('https://api.theadmarket.com/widget/form/fv2PaXSUdZqj6cmlfTmo', '_blank')}
              >
                <FileText className="h-4 w-4 mr-2" />
              Submit Enquiry
            </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWidget;
