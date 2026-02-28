import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "../Select/select";

const meta: Meta<typeof Select> = {
  title: "Components/UI/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const RejectionReason: Story = {
  args: {
    value: "policy",
    onChange: () => {},
    children: (
      <>
        <option value="">Select reason</option>
        <option value="policy">Policy violation</option>
        <option value="spam">Spam</option>
        <option value="duplicate">Duplicate listing</option>
      </>
    ),
  },
};

export const ItemsPerPage: Story = {
  args: {
    value: "10",
    onChange: () => {},
    children: (
      <>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </>
    ),
  },
};
