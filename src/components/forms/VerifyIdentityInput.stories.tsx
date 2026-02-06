import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ComponentProps } from "react";
import { VerifyIdentityInput } from "./VerifyIdentityInput";

const meta: Meta<typeof VerifyIdentityInput> = {
  title: "Components/Forms/VerifyIdentityInput",
  component: VerifyIdentityInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof VerifyIdentityInput>;

const Example = (args: ComponentProps<typeof VerifyIdentityInput>) => {
  const [file, setFile] = useState<File | undefined>(undefined);

  return <VerifyIdentityInput {...args} value={file} onChange={setFile} />;
};

export const Default: Story = {
  args: {
    label: "Front side",
  },
  render: (args) => <Example {...args} />,
};

export const WithError: Story = {
  args: {
    label: "Back side",
    error: "Document is required",
  },
  render: (args) => <Example {...args} />,
};
