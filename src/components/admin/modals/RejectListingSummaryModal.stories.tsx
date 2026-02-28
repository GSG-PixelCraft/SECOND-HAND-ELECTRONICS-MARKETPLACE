import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RejectListingSummaryModal } from "./RejectListingSummaryModal";
import { Button } from "@/components/ui/Button/button";

const meta: Meta<typeof RejectListingSummaryModal> = {
  title: "Components/Admin/Modals/RejectListingSummaryModal",
  component: RejectListingSummaryModal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RejectListingSummaryModal>;

const Example = () => {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Button intent="outline" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <RejectListingSummaryModal
        open={open}
        onOpenChange={setOpen}
        listingName="iPhone 13 Pro"
        primaryReason="poor_quality_images"
        selectedIssues={[
          {
            group: "Photos & Visual Accuracy.",
            issue: "Images are blurry or low quality.",
          },
          {
            group: "Listing Information Accuracy",
            issue: "Missing required listing details.",
          },
        ]}
        comments={[
          {
            group: "Photos & Visual Accuracy.",
            comment: "Please upload clear photos in good lighting.",
          },
        ]}
        onConfirm={() => console.log("Rejection confirmed")}
        onBack={() => setOpen(false)}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Example />,
};
