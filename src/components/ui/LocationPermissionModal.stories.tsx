import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { LocationPermissionModal } from "./LocationPermissionModal";
import { Button } from "./button";

const meta: Meta<typeof LocationPermissionModal> = {
  title: "Components/UI/LocationPermissionModal",
  component: LocationPermissionModal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LocationPermissionModal>;

const Example = () => {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Button intent="outline" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <LocationPermissionModal
        isOpen={open}
        onAllow={() => {
          console.log("Location allowed");
          setOpen(false);
        }}
        onDeny={() => {
          console.log("Location denied");
          setOpen(false);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Example />,
};
