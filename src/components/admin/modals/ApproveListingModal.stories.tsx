import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ApproveListingModal } from "./ApproveListingModal";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof ApproveListingModal> = {
  title: "Components/Admin/Modals/ApproveListingModal",
  component: ApproveListingModal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ApproveListingModal>;

const Example = () => {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Button intent="outline" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <ApproveListingModal
        open={open}
        onOpenChange={setOpen}
        listingName="iPhone 14 Pro"
        onConfirm={() => console.log("Listing approved")}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Example />,
};