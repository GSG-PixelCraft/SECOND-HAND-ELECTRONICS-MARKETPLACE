import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { ComponentProps } from "react";
import { Dialog } from "../Dialog/dialog";
import { Button } from "../Button/button";

const meta: Meta<typeof Dialog> = {
  title: "Components/UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

const DialogWithState = (args: ComponentProps<typeof Dialog>) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>

      <Dialog open={open} onOpenChange={setOpen} {...args}>
        <h2 className="mb-2 text-lg font-semibold">Dialog Title</h2>
        <p className="mb-4 text-body text-neutral-foreground">
          This is a simple modal dialog. Click outside or close to dismiss.
        </p>

        <div className="flex justify-end gap-2">
          <Button intent="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </div>
      </Dialog>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <DialogWithState {...args} />,
};

export const Small: Story = {
  render: () => <DialogWithState size="sm" />,
};

export const Large: Story = {
  render: () => <DialogWithState size="lg" />,
};
