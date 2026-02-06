import type { Meta, StoryObj } from "@storybook/react";
import { Tip } from "./Tip";

const meta = {
    title: "Admin/UI/Tips/Tip",
    component: Tip,
    tags: ["autodocs"],
} satisfies Meta<typeof Tip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
    args: {
        title: "Pro Tip",
        children: "You can use bulk actions to manage multiple listings at once.",
        variant: "info",
    },
};

export const Warning: Story = {
    args: {
        children: "Removing this category will affect all associated listings.",
        variant: "warning",
    },
};

export const Success: Story = {
    args: {
        title: "Verified",
        children: "This user has completed identity verification.",
        variant: "success",
    },
};

export const Error: Story = {
    args: {
        title: "Action Required",
        children: "Please review the reports for this listing immediately.",
        variant: "error",
    },
};
