import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_MESSAGE_LENGTH = 1000;

// Simple rate limiting using in-memory store (resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

function sanitizeInput(input: string): string {
  // Trim whitespace
  let sanitized = input.trim();
  
  // Remove control characters (except newlines and tabs which may be intentional)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  return sanitized;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting (from headers or connection)
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a moment before trying again.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { question } = await req.json();
    
    // Validate input exists
    if (!question || typeof question !== 'string') {
      console.log('Invalid input: question is missing or not a string');
      return new Response(
        JSON.stringify({ error: 'Invalid input: question is required and must be a string' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Sanitize input
    const sanitizedQuestion = sanitizeInput(question);
    
    // Validate length
    if (sanitizedQuestion.length === 0) {
      console.log('Invalid input: empty question after sanitization');
      return new Response(
        JSON.stringify({ error: 'Question cannot be empty' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    if (sanitizedQuestion.length > MAX_MESSAGE_LENGTH) {
      console.log(`Invalid input: question exceeds max length (${sanitizedQuestion.length} > ${MAX_MESSAGE_LENGTH})`);
      return new Response(
        JSON.stringify({ error: `Question must be ${MAX_MESSAGE_LENGTH} characters or less` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get webhook URL from secrets
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL secret is not configured');
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Forwarding request to n8n webhook (question length: ${sanitizedQuestion.length})`);
    
    // Forward request to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: sanitizedQuestion }),
    });

    if (!response.ok) {
      console.error(`n8n webhook error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: 'Failed to get response from AI service' }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const text = await response.text();
    if (!text) {
      console.error('Empty response from n8n webhook');
      return new Response(
        JSON.stringify({ error: 'Empty response from AI service' }),
        { 
          status: 502, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = JSON.parse(text);
    console.log('Successfully received response from n8n webhook');
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in chat-proxy function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
