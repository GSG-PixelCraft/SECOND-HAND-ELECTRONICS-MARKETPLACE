import ChatHeader from "./ChatHeader";
import ChatProductPreview from "./ChatProductPreview";
import ChatSafetyTips from "./ChatSafetyTips";
import ChatMessages from "./ChatMessages";
import ChatQuickReplies from "./ChatQuickReplies";
import ChatInput from "./ChatInput";
import ChatActions from "./ChatActions";
import { useState } from "react";
import BlockedUserNotice from "./BlockedUserNotice";

export default function ChatRightPanel() {
  const [isBlocked, setIsBlocked] = useState(false);
  return (
    <div className="border-border flex w-full flex-col rounded-xl border bg-white">
      <ChatHeader setIsBlocked={setIsBlocked} />

      <ChatProductPreview title="Redmi Note 12" image={null} />

      <ChatSafetyTips />
      <ChatActions text="Average response time: 5 minutes" />

      <ChatMessages />
      {isBlocked ? (
        <BlockedUserNotice onUnblock={() => setIsBlocked(false)} />
      ) : (
        <>
          <ChatQuickReplies />
          <ChatInput />
        </>
      )}
    </div>
  );
}
