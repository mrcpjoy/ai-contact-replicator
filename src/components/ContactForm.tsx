import { useEffect } from "react";
import { MessageCircle } from "lucide-react";

const ContactForm = () => {
  useEffect(() => {
    // Load the form embed script
    const script = document.createElement('script');
    script.src = 'https://api.theadmarket.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 p-6 bg-primary/5 rounded-lg border-2 border-primary/20">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold text-primary">AI Concierge Available</h3>
          </div>
          <p className="text-lg text-muted-foreground">
            Need quick answers? Our AI Concierge is ready to help! Click the button in the bottom right corner for instant assistance.
          </p>
          <p className="text-sm text-muted-foreground/80 mt-2">
            Our AI Concierge provides general information only, not legal advice.
          </p>
        </div>
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Get in Touch</h2>
        
        <div className="w-full rounded-lg overflow-hidden shadow-lg" style={{ minHeight: '984px' }}>
          <iframe
            src="https://api.theadmarket.com/widget/form/fv2PaXSUdZqj6cmlfTmo"
            style={{ width: '100%', height: '984px', border: 'none', borderRadius: '3px' }}
            id="inline-fv2PaXSUdZqj6cmlfTmo" 
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="Website Form"
            data-height="984"
            data-layout-iframe-id="inline-fv2PaXSUdZqj6cmlfTmo"
            data-form-id="fv2PaXSUdZqj6cmlfTmo"
            title="Website Form"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
