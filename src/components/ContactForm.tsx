import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle } from "lucide-react";

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    location: "",
    enquiry: "",
    website: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Form Submitted",
      description: "Thank you for your enquiry. We'll be in touch soon!",
    });
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      location: "",
      enquiry: "",
      website: "",
    });
  };

  const services = [
    "Family Law",
    "Conveyancing",
    "Employment Law",
    "Wills, LPA & Probate",
    "Commercial Property Solicitors",
    "Litigation & Debt Recovery",
    "Business Employment Law",
    "Litigation"
  ];

  const locations = [
    "Tamworth",
    "Lichfield",
    "Great Barr",
    "Kings Heath",
    "Quinton",
    "Stourbridge",
    "Wellingborough",
    "Market Harborough"
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12 p-6 bg-primary/5 rounded-lg border-2 border-primary/20">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold text-primary">AI Concierge Available</h3>
          </div>
          <p className="text-lg text-muted-foreground">
            Need quick answers? Our AI Concierge is ready to help! Click the button in the bottom right corner for instant assistance.
          </p>
        </div>
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Get in Touch</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Your contact number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-input border-border"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="service">Services</Label>
              <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                <SelectTrigger id="service" className="bg-input border-border">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                <SelectTrigger id="location" className="bg-input border-border">
                  <SelectValue placeholder="Select an office" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="enquiry">Enquiry</Label>
            <Textarea
              id="enquiry"
              placeholder="How can we help you?"
              value={formData.enquiry}
              onChange={(e) => setFormData({ ...formData, enquiry: e.target.value })}
              required
              className="bg-input border-border min-h-32"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="Your website (optional)"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="bg-input border-border"
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Submit
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
