import { useTranslation } from "react-i18next";
import { ChatsParts } from "@/components/chats/ChatsParts";
import ChatRightPanel from "./components/ChatRightPanel";

export default function ChatPage() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm md:flex-row">
      <div className="w-full border-r border-gray-200 px-4 md:w-5/12 lg:w-4/12 xl:w-1/3">
        <ChatsParts
          aria-label={t("chats.sectionLabel", {
            defaultValue: "Chats panel",
          })}
        />
      </div>

      <ChatRightPanel />
    </div>
  );
}
