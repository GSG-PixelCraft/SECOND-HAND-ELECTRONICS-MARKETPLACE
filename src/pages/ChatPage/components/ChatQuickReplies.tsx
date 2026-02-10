import { useTranslation } from "react-i18next";

export default function ChatQuickReplies() {
  const { t } = useTranslation();

  const replies = [
    t("chat.quick.isAvailable"),
    t("chat.quick.sendPhoto"),
    t("chat.quick.isAvailable"),
  ];

  return (
    <div className="flex flex-col gap-2 overflow-x-auto px-6 pb-3 lg:flex-row">
      {replies.map((text, index) => (
        <button
          key={index}
          type="button"
          className="whitespace-nowrap rounded-full bg-secondary-10 px-4 py-1.5 text-caption text-neutral hover:bg-secondary-20"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
