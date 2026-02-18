import { useTranslation } from "react-i18next";
import Dots from "./Dots";

type Props = {
  isTyping: boolean;
};

export default function ChatTypingIndicator({ isTyping }: Props) {
  const { t } = useTranslation();

  if (!isTyping) return null;

  return (
    <div className="flex">
      <div className="flex items-center gap-1 rounded-xl bg-secondary-10 px-4 py-2 text-caption text-secondary">
        <span>{t("chat.typing")}</span>
        <Dots />
      </div>
    </div>
  );
}
