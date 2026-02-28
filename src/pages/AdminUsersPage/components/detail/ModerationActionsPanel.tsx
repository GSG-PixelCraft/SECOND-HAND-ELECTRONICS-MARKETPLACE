import { forwardRef, useState } from "react";
import { Button } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/Text/text";
import { FullScreenLoading } from "@/components/feedback/loading/full-screen-loading";
import {
  useWarnUser,
  useSuspendUser,
  useBanUser,
} from "@/services/admin-users.service";
import { WarnUserModal } from "./modals/WarnUserModal";
import { SuspendUserModal } from "./modals/SuspendUserModal";
import { BanUserModal } from "./modals/BanUserModal";
import type { UserStatus } from "@/types/user";

export interface ModerationActionsPanelProps {
  userId: string;
  currentStatus: UserStatus;
  onActionComplete?: () => void;
}

export const ModerationActionsPanel = forwardRef<
  HTMLDivElement,
  ModerationActionsPanelProps
>(({ userId, currentStatus, onActionComplete }, ref) => {
  const [warnModalOpen, setWarnModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);

  const warnMutation = useWarnUser();
  const suspendMutation = useSuspendUser();
  const banMutation = useBanUser();

  const handleWarn = async (reason: string) => {
    if (warnMutation.isPending) return;
    try {
      await warnMutation.mutateAsync({ id: userId, payload: { reason } });
      setWarnModalOpen(false);
      onActionComplete?.();
    } catch (error) {
      console.error("Failed to warn user:", error);
    }
  };

  const handleSuspend = async (reason: string, duration?: number) => {
    if (suspendMutation.isPending) return;
    try {
      await suspendMutation.mutateAsync({
        id: userId,
        payload: { reason, duration },
      });
      setSuspendModalOpen(false);
      onActionComplete?.();
    } catch (error) {
      console.error("Failed to suspend user:", error);
    }
  };

  const handleBan = async (reason: string) => {
    if (banMutation.isPending) return;
    try {
      await banMutation.mutateAsync({ id: userId, payload: { reason } });
      setBanModalOpen(false);
      onActionComplete?.();
    } catch (error) {
      console.error("Failed to ban user:", error);
    }
  };

  const isAnyModerationLoading =
    warnMutation.isPending ||
    suspendMutation.isPending ||
    banMutation.isPending;

  const moderationLoadingMessage = warnMutation.isPending
    ? "Sending warning..."
    : suspendMutation.isPending
      ? "Suspending account..."
      : banMutation.isPending
        ? "Banning user..."
        : "Processing action...";

  return (
    <>
      <div
        ref={ref}
        className="rounded-xl bg-white p-6 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.1)]"
      >
        <Text variant="bodyLg" className="text-neutral-90 mb-4 font-semibold">
          Moderation Actions
        </Text>

        {/* Show status message for banned or suspended users */}
        {currentStatus === "banned" ? (
          <div className="flex h-11 items-center justify-center rounded-xl bg-neutral-10">
            <Text variant="body" className="text-neutral-60 font-medium">
              Banned
            </Text>
          </div>
        ) : currentStatus === "suspended" ? (
          <div className="flex h-11 items-center justify-center rounded-xl bg-neutral-10">
            <Text variant="body" className="text-neutral-60 font-medium">
              Suspended
            </Text>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              intent="outline"
              className="h-11 w-full justify-center rounded-xl border-2 border-[#FDB022] bg-white text-sm font-semibold text-[#FDB022] hover:bg-[#FDB022]/5"
              onClick={() => setWarnModalOpen(true)}
            >
              Warn User
            </Button>

            <Button
              intent="outline"
              className="h-11 w-full justify-center rounded-xl border-2 border-error bg-white text-sm font-semibold text-error hover:bg-error/5"
              onClick={() => setSuspendModalOpen(true)}
            >
              Suspend Account
            </Button>

            <Button
              intent="danger"
              className="h-11 w-full justify-center rounded-xl border-none bg-error text-sm font-semibold text-white hover:bg-error/90"
              onClick={() => setBanModalOpen(true)}
            >
              Permanent Ban
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <WarnUserModal
        isOpen={warnModalOpen && !warnMutation.isPending}
        onClose={() => setWarnModalOpen(false)}
        onConfirm={handleWarn}
      />
      <SuspendUserModal
        isOpen={suspendModalOpen && !suspendMutation.isPending}
        onClose={() => setSuspendModalOpen(false)}
        onConfirm={handleSuspend}
      />
      <BanUserModal
        isOpen={banModalOpen && !banMutation.isPending}
        onClose={() => setBanModalOpen(false)}
        onConfirm={handleBan}
      />
      <FullScreenLoading
        open={isAnyModerationLoading}
        message={moderationLoadingMessage}
      />
    </>
  );
});

ModerationActionsPanel.displayName = "ModerationActionsPanel";
