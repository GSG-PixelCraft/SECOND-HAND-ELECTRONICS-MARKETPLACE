import type { Meta, StoryObj } from "@storybook/react";
import { DateFilter } from "./DateFilter";

const meta = {
    title: "Admin/UI/DateFilter/DateFilter",
    component: DateFilter,
    tags: ["autodocs"],
} satisfies Meta<typeof DateFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
    args: {
        startDate: null,
        endDate: null,
    },
};

export const SingleDate: Story = {
    args: {
        startDate: new Date("2024-01-01"),
        endDate: null,
    },
};

export const Range: Story = {
    args: {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-07"),
    },
};
