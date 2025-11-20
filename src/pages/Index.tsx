import ContactHero from "@/components/ContactHero";
import ContactForm from "@/components/ContactForm";
import OfficeLocations from "@/components/OfficeLocations";
import AIChatWidget from "@/components/AIChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ContactHero />
      <ContactForm />
      <OfficeLocations />
      <AIChatWidget />
    </div>
  );
};

export default Index;
