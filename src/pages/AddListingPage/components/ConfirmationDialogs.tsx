// src/pages/AddListingPage/components/ConfirmationDialogs.tsx
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/Loader";
import { ROUTES } from "@/constants/routes";

interface ConfirmationDialogsProps {
  leaveOpen: boolean;
  setLeaveOpen: (open: boolean) => void;
  reviewSuccessOpen: boolean;
  setReviewSuccessOpen: (open: boolean) => void;
  isSending: boolean;
}

export const ConfirmationDialogs: React.FC<ConfirmationDialogsProps> = ({
  leaveOpen,
  setLeaveOpen,
  reviewSuccessOpen,
  setReviewSuccessOpen,
  isSending,
}): React.ReactElement => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      {/* Leave Confirmation Dialog */}
      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen} size="sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-10 text-warning">
            !
          </div>
          <div className="space-y-2">
            <p className="text-h5 text-neutral-foreground">
              {t("addListing.leaveModal.title")}
            </p>
            <p className="text-body text-muted-foreground">
              {t("addListing.leaveModal.body")}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3">
            <Button onClick={() => setLeaveOpen(false)}>
              {t("addListing.buttons.continueEditing")}
            </Button>
            <Button
              intent="outline"
              onClick={() => {
                setLeaveOpen(false);
                navigate(ROUTES.HOME);
              }}
            >
              {t("addListing.buttons.leave")}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={reviewSuccessOpen}
        onOpenChange={setReviewSuccessOpen}
        size="sm"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-20 text-success">
            ✓
          </div>
          <div className="space-y-2">
            <p className="text-h5 text-neutral-foreground">
              {t("addListing.successModal.title")}
            </p>
            <p className="text-body text-muted-foreground">
              {t("addListing.successModal.body")}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3">
            <Button
              onClick={() => {
                setReviewSuccessOpen(false);
                navigate(ROUTES.HOME);
              }}
            >
              {t("addListing.buttons.goToHome")}
            </Button>
            <Button
              intent="outline"
              onClick={() => {
                setReviewSuccessOpen(false);
                window.location.reload();
              }}
            >
              {t("addListing.buttons.addAnother")}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Sending Overlay */}
      {isSending && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-8 py-6 text-center">
            <Loader size="lg" />
            <p className="text-body font-medium text-neutral-foreground">
              {t("addListing.sending.title")}
            </p>
            <p className="text-caption text-muted-foreground">
              {t("addListing.sending.body")}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
