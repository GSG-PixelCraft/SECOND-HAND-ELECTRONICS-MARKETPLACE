// src/pages/AddListingPage/components/ConfirmationDialogs.tsx
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
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
  const warningIcon =
    "http://localhost:3845/assets/0c03194102e72180b212b744376b7091d5470b13.svg";
  const successIcon =
    "http://localhost:3845/assets/5fd8f670978b5c2939b59169cceb6c064c37ff92.svg";
  const sendingSpinner =
    "http://localhost:3845/assets/dd157f40fe9393168564b7a6308c8327f31371a3.svg";

  return (
    <>
      {/* Leave Confirmation Dialog */}
      <Dialog
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        size="sm"
        className="max-w-[400px] border-0 p-0 shadow-xl backdrop:bg-black/85"
      >
        <div className="flex flex-col items-center gap-6 rounded-[20px] bg-white px-8 py-8 text-center">
          <Image src={warningIcon} alt="" className="h-20 w-20" />
          <div className="space-y-3">
            <Text className="text-[18px] font-medium text-[#212121]">
              {t("addListing.leaveModal.title")}
            </Text>
            <Text className="text-[16px] text-[#828282]">
              {t("addListing.leaveModal.body")}
            </Text>
          </div>
          <div className="flex w-full flex-col gap-4">
            <Button
              className="h-[58px] w-full rounded-[12px] text-[16px] font-medium"
              onClick={() => setLeaveOpen(false)}
            >
              {t("addListing.buttons.continueEditing")}
            </Button>
            <Button
              intent="outline"
              className="h-[58px] w-full rounded-[12px] border-[#6b7280] text-[16px] font-medium text-[#6b7280] hover:bg-transparent"
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
        className="max-w-[455px] border-0 p-0 shadow-xl backdrop:bg-black/85"
      >
        <div className="flex flex-col items-center gap-6 rounded-[20px] bg-white px-8 py-8 text-center">
          <Image src={successIcon} alt="" className="h-20 w-20" />
          <div className="space-y-3">
            <Text className="text-[18px] font-medium text-[#212121]">
              {t("addListing.successModal.title")}
            </Text>
            <Text className="text-[16px] text-[#828282]">
              {t("addListing.successModal.body")}
            </Text>
          </div>
          <div className="flex w-full flex-col gap-4">
            <Button
              className="h-[58px] w-full rounded-[12px] text-[16px] font-medium"
              onClick={() => {
                setReviewSuccessOpen(false);
                navigate(ROUTES.HOME);
              }}
            >
              {t("addListing.buttons.goToHome")}
            </Button>
            <Button
              intent="outline"
              className="h-[58px] w-full rounded-[12px] border-[#6b7280] text-[16px] font-medium text-[#6b7280] hover:bg-transparent"
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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-black/85 text-center">
          <Image
            src={sendingSpinner}
            alt=""
            className="h-14 w-14 animate-spin"
          />
          <Text className="max-w-[447px] whitespace-pre-wrap text-[20px] font-normal leading-normal text-white">
            {t("addListing.sending.title")}
            <br />
            {t("addListing.sending.body")}
          </Text>
        </div>
      )}
    </>
  );
};
