import type { Meta, StoryObj } from "@storybook/react";
import { VerificationCheck } from "./VerificationCheck";

const meta = {
  title: "Components/Admin/UI/Verification/VerificationCheck",
  component: VerificationCheck,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof VerificationCheck>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = { args: { size: "sm" } };
export const Medium: Story = { args: { size: "md" } };
export const Large: Story = { args: { size: "lg" } };