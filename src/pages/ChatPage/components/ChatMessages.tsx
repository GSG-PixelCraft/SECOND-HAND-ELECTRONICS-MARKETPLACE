// import ChatTypingIndicator from "./ChatTypingIndicator";

import ChatActions from "./ChatActions";

export default function ChatMessages() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <div className="mb-3 flex">
        <div className="max-w-xs rounded-lg bg-muted px-4 py-2 text-body text-neutral-foreground">
          Where can we meet?
        </div>
      </div>
      <div className="mb-3 flex justify-end">
        <div className="max-w-xs rounded-lg bg-primary px-4 py-2 text-body text-primary-foreground">
          Is it still available?
        </div>
      </div>
      <ChatActions text="Requested a call" />
      {/* <ChatTypingIndicator isTyping={true} /> */}
    </div>
  );
}
