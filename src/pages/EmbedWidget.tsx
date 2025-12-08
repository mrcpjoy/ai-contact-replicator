import AIChatWidget from "@/components/AIChatWidget";

const EmbedWidget = () => {
  return (
    <div className="fixed inset-0 bg-transparent">
      <AIChatWidget defaultOpen={true} />
    </div>
  );
};

export default EmbedWidget;
