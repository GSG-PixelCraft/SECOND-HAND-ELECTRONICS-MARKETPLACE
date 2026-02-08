import { useEffect, useRef, useState } from "react";
import { Phone, Search, MoreVertical, User, ArrowLeft, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import MenuItem from "./MenuItem";
import CallRequestDialog from "./CallRequestDialog";
import VoiceCallModal from "./VoiceCallModal";
import BlockUserDialog from "./BlockUserDialog";
import ReportChatModal from "./ReportChatModal";

export default function ChatHeader({
  setIsBlocked,
}: {
  setIsBlocked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRinging, setIsRinging] = useState(true);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const handleRequestCall = () => {
    setIsRinging(true);
    setIsOpen(true);
    setShowCallDialog(false);
  };
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReport, setShowReport] = useState(false);
  const handleCloseSearch = () => {
    setSearchActive(false);
    setSearchQuery("");
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="border-border relative flex justify-between border-b px-6 py-4 md:items-center">
        {!searchActive ? (
          <>
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 rounded-full text-neutral" />

              <div>
                <p className="text-body font-medium text-neutral-foreground">
                  Ahmad Sami
                </p>
                <p className="text-caption text-success">{t("chat.online")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-neutral" ref={menuRef}>
              <button
                className="hover:text-primary"
                onClick={() => setShowCallDialog(true)}
              >
                <Phone size={18} />
              </button>

              <button
                className="hover:text-primary"
                onClick={() => setSearchActive(true)}
              >
                <Search size={18} />
              </button>

              <button
                className="hover:text-primary"
                onClick={() => setOpen((v) => !v)}
              >
                <MoreVertical size={18} />
              </button>

              {open && (
                <div className="border-border absolute right-6 top-16 z-50 w-56 rounded-lg border bg-white shadow-md">
                  <MenuItem label={t("chat.menu.search")} />
                  <MenuItem label={t("chat.menu.viewListing")} />
                  <MenuItem label={t("chat.menu.mute")} />
                  <MenuItem label={t("chat.menu.archive")} />
                  <MenuItem
                    label={t("chat.menu.report")}
                    onClick={() => setShowReport(true)}
                  />
                  <MenuItem
                    label={t("chat.menu.block")}
                    danger
                    onClick={() => setBlockDialogOpen(true)}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          /* Search mode header */
          <div className="bg-background flex w-full items-center gap-3 px-4 py-3">
            <button
              onClick={handleCloseSearch}
              className="rounded-full p-2 transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(
                  "chat.searchMessages",
                  "Search in conversation...",
                )}
                className="border-border w-full rounded-full border bg-muted/50 py-2.5 pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                autoFocus
              />
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-muted/80"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            <button
              onClick={handleCloseSearch}
              className="px-2 text-sm font-medium text-primary hover:opacity-80"
            >
              {t("common.cancel", "Cancel")}
            </button>
          </div>
        )}
      </div>
      {showCallDialog && (
        <CallRequestDialog
          isOpen={showCallDialog}
          sellerName="Ahmad Sami"
          onConfirm={handleRequestCall}
          onCancel={() => setShowCallDialog(false)}
        />
      )}
      <VoiceCallModal
        isOpen={isOpen}
        sellerName="Ahmad Sami"
        avatarUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
        isIncoming={isRinging}
        onAccept={() => {
          setIsRinging(false);
          console.log("UI test: Accept clicked");
        }}
        onDecline={() => {
          setIsOpen(false);
          console.log("UI test: Decline clicked");
        }}
        onEndCall={() => {
          setIsOpen(false);
          console.log("UI test: End call clicked");
        }}
        onToggleMic={() => console.log("Mic toggled")}
        onToggleSpeaker={() => console.log("Speaker toggled")}
      />
      <BlockUserDialog
        isOpen={blockDialogOpen}
        userName={"Ahmad Sami"}
        onConfirm={() => {
          console.log(`Blocking user: Ahmad Sami`);
          setIsBlocked(true);
          setBlockDialogOpen(false);
        }}
        onCancel={() => setBlockDialogOpen(false)}
      />
      <ReportChatModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={async (reason, details) => {
          // your API call here
          console.log(reason, details);
        }}
      />
    </>
  );
}
