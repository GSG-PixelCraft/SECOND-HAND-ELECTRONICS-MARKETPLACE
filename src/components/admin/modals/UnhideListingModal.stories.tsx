import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { UnhideListingModal } from "./UnhideListingModal";
import { Button } from "@/components/ui/Button/button";

const meta: Meta<typeof UnhideListingModal> = {
  title: "Components/Admin/Modals/UnhideListingModal",
  component: UnhideListingModal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UnhideListingModal>;

const Example = () => {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Button intent="outline" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <UnhideListingModal
        open={open}
        onOpenChange={setOpen}
        listingName="Google Pixel 8"
        onConfirm={() => console.log("Listing unhidden")}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Example />,
};
