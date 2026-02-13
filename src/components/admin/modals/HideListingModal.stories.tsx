import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { HideListingModal } from "./HideListingModal";
import { Button } from "@/components/ui/button";
import type { HideReason } from "@/types/admin";

const meta: Meta<typeof HideListingModal> = {
  title: "Components/Admin/Modals/HideListingModal",
  component: HideListingModal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HideListingModal>;

const Example = () => {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Button intent="outline" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <HideListingModal
        open={open}
        onOpenChange={setOpen}
        listingName="MacBook Pro 14"
        onConfirm={(reason: HideReason, comment?: string) =>
          console.log("Hide reason:", reason, comment)
        }
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Example />,
};
