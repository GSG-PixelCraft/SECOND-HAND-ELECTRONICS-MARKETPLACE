import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Components/UI/Input",
  component: Input,
  args: {
    placeholder: "Type something...",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Labeled: Story = {
  args: {
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter your phone number",
  },
};

export const SearchField: Story = {
  args: {
    type: "text",
    placeholder: "Search listings by title or seller",
    className:
      "h-12 w-full rounded-xl border-[#e4e4e4] bg-white pl-12 pr-4 text-[#3d3d3d] placeholder:text-[#c7c7c7]",
  },
  render: (args) => (
    <div className="relative w-[358px]">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-50"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <Input {...args} />
    </div>
  ),
};
