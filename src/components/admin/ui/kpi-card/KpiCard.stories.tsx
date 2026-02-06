import type { Meta, StoryObj } from "@storybook/react";
import { KpiCard } from "./KpiCard";
import { Users, DollarSign } from "lucide-react";

const meta = {
  title: "Components/Admin/UI/KpiCard",
  component: KpiCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof KpiCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Total Users",
    value: "12,345",
    icon: <Users className="h-6 w-6" />,
    variant: "primary",
  },
};

export const WithTrend: Story = {
  args: {
    title: "Revenue",
    value: "$45,231",
    icon: <DollarSign className="h-6 w-6" />,
    variant: "success",
    trend: "up",
    trendValue: "+12.5%",
    subtitle: "vs last month",
  },
};