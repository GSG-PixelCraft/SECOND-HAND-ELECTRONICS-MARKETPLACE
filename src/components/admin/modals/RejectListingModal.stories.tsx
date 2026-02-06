import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RejectListingModal } from "./RejectListingModal";
import { Button } from "@/components/ui/button";
import type { RejectionReason } from "@/types/admin";

const meta: Meta<typeof RejectListingModal> = {
  title: "Components/Admin/Modals/RejectListingModal",
  component: RejectListingModal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RejectListingModal>;

const Example = () => {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Button intent="outline" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <RejectListingModal
        open={open}
        onOpenChange={setOpen}
        listingName="Samsung Galaxy S21"
        onConfirm={(reason: RejectionReason, comment: string) =>
          console.log("Reject confirm:", reason, comment)
        }
        onReviewAndSubmit={(data) => console.log("Review and submit:", data)}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Example />,
};