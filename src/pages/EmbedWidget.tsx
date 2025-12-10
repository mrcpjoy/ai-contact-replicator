import { useEffect } from "react";
import AIChatWidget from "@/components/AIChatWidget";

const EmbedWidget = () => {
  useEffect(() => {
    // Make everything transparent for iframe embedding
    document.documentElement.style.cssText = "background: transparent !important; background-color: transparent !important;";
    document.body.style.cssText = "background: transparent !important; background-color: transparent !important; margin: 0; padding: 0;";
    
    const root = document.getElementById("root");
    if (root) {
      root.style.cssText = "background: transparent !important; background-color: transparent !important;";
    }
    
    return () => {
      document.documentElement.style.cssText = "";
      document.body.style.cssText = "";
      if (root) {
        root.style.cssText = "";
      }
    };
  }, []);

  // Render ONLY the widget component - no wrapper containers
  return <AIChatWidget defaultOpen={true} embedded={true} />;
};

export default EmbedWidget;
