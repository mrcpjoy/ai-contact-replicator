import { useEffect } from "react";
import AIChatWidget from "@/components/AIChatWidget";

const EmbedWidget = () => {
  useEffect(() => {
    // Make body transparent for iframe embedding
    document.body.style.background = "transparent";
    document.documentElement.style.background = "transparent";
    
    return () => {
      // Restore on unmount
      document.body.style.background = "";
      document.documentElement.style.background = "";
    };
  }, []);

  return <AIChatWidget defaultOpen={true} embedded={true} />;
};

export default EmbedWidget;
