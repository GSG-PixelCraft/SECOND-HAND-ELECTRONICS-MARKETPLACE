import { useTranslation } from "react-i18next";
import { ChatsParts } from "./components";

export default function ChatPage() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full justify-center">
      <ChatsParts
        className="min-h-[805px]"
        aria-label={t("chats.sectionLabel", {
          defaultValue: "Chats panel",
        })}
      />
    </div>
  );
}
