import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { OTPInput } from "./OTPInput";

const meta: Meta<typeof OTPInput> = {
  title: "Components/Forms/OTPInput",
  component: OTPInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OTPInput>;

const Example = () => {
  const [value, setValue] = useState("");

  return (
    <OTPInput
      value={value}
      onChange={setValue}
      onComplete={(otp) => console.log("Completed OTP:", otp)}
    />
  );
};

export const Default: Story = {
  render: () => <Example />,
};

export const ErrorState: Story = {
  args: {
    error: true,
  },
};
