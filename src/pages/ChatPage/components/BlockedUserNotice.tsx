import { useTranslation } from "react-i18next";

interface BlockedUserNoticeProps {
  onUnblock: () => void;
}

export default function BlockedUserNotice({
  onUnblock,
}: BlockedUserNoticeProps) {
  const { t } = useTranslation("chat");

  return (
    <div className="border-border flex min-h-[300px] flex-col items-center justify-center space-y-6 rounded-2xl border p-8 text-center">
      <div className="space-y-3">
        <h3 className="text-foreground text-xl font-semibold">
          {t("blocked.title", "You have blocked this user")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t(
            "blocked.description",
            "You cannot send messages or see their listings.",
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={onUnblock}
        className="focus:ring-offset-background rounded-xl bg-primary px-10 py-3.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {t("blocked.unblock", "Unblock")}
      </button>
    </div>
  );
}
