const ContactHero = () => {
  return (
    <section className="relative bg-hero text-hero-foreground py-24 pb-32 overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Need to know more?</h1>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
          Would you like to know more? Get in touch using the form below, we are here and waiting to hear from you and help you today!
        </p>
      </div>
      
      {/* Curved bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
        <svg 
          className="relative block w-full h-16 md:h-24" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z" 
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default ContactHero;
