import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ChatSafetyTips() {
  const { t } = useTranslation();

  return (
    <div className="mx-6 my-4 rounded-lg bg-primary-5 p-4">
      <div className="mb-2 flex items-center gap-2 text-primary">
        <ShieldAlert size={18} />
        <p className="font-medium">{t("chat.safety.title")}</p>
      </div>

      <ul className="list-disc space-y-1 pl-5 text-caption text-muted-foreground">
        <li>{t("chat.safety.tip1")}</li>
        <li>{t("chat.safety.tip2")}</li>
        <li>{t("chat.safety.tip3")}</li>
        <li>{t("chat.safety.tip4")}</li>
      </ul>
    </div>
  );
}
