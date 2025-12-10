import { useEffect } from "react";
import AIChatWidget from "@/components/AIChatWidget";

const EmbedWidget = () => {
  useEffect(() => {
    // Add transparent class to html element for CSS targeting
    document.documentElement.classList.add("embed-transparent");
    
    // Make body and html transparent for iframe embedding
    document.body.style.background = "transparent";
    document.body.style.backgroundColor = "transparent";
    document.documentElement.style.background = "transparent";
    document.documentElement.style.backgroundColor = "transparent";
    
    // Also set the root element transparent
    const root = document.getElementById("root");
    if (root) {
      root.style.background = "transparent";
      root.style.backgroundColor = "transparent";
    }
    
    return () => {
      // Restore on unmount
      document.documentElement.classList.remove("embed-transparent");
      document.body.style.background = "";
      document.body.style.backgroundColor = "";
      document.documentElement.style.background = "";
      document.documentElement.style.backgroundColor = "";
      if (root) {
        root.style.background = "";
        root.style.backgroundColor = "";
      }
    };
  }, []);

  return <AIChatWidget defaultOpen={true} embedded={true} />;
};

export default EmbedWidget;
