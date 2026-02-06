import type { Meta, StoryObj } from "@storybook/react";
import { KpiCard } from "./KpiCard";
import { TrendingUp, Users, Package, DollarSign, ShoppingCart } from "lucide-react";

const meta = {
    title: "Admin/UI/KpiCard",
    component: KpiCard,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "success", "warning", "error", "neutral"],
            description: "Color variant of the card",
        },
        trend: {
            control: "select",
            options: ["up", "down", "neutral"],
            description: "Trend direction indicator",
        },
        loading: {
            control: "boolean",
            description: "Show loading skeleton",
        },
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

export const WithTrendUp: Story = {
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

export const WithTrendDown: Story = {
    args: {
        title: "Active Listings",
        value: "8,234",
        icon: <Package className="h-6 w-6" />,
        variant: "warning",
        trend: "down",
        trendValue: "-3.2%",
        subtitle: "vs last week",
    },
};

export const ErrorVariant: Story = {
    args: {
        title: "Failed Transactions",
        value: "23",
        icon: <ShoppingCart className="h-6 w-6" />,
        variant: "error",
        trend: "up",
        trendValue: "+5",
        subtitle: "today",
    },
};

export const NeutralVariant: Story = {
    args: {
        title: "Pending Reviews",
        value: "156",
        variant: "neutral",
        subtitle: "awaiting approval",
    },
};

export const WithoutIcon: Story = {
    args: {
        title: "Total Sales",
        value: "1,234",
        variant: "primary",
        trend: "up",
        trendValue: "+8.3%",
    },
};

export const WithoutTrend: Story = {
    args: {
        title: "Categories",
        value: "42",
        icon: <TrendingUp className="h-6 w-6" />,
        variant: "primary",
        subtitle: "active categories",
    },
};

export const Loading: Story = {
    args: {
        title: "Loading",
        value: "0",
        icon: <Users className="h-6 w-6" />,
        variant: "primary",
        loading: true,
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <KpiCard
                title="Primary"
                value="12,345"
                icon={<Users className="h-6 w-6" />}
                variant="primary"
                trend="up"
                trendValue="+12%"
            />
            <KpiCard
                title="Success"
                value="$45,231"
                icon={<DollarSign className="h-6 w-6" />}
                variant="success"
                trend="up"
                trendValue="+8.5%"
            />
            <KpiCard
                title="Warning"
                value="8,234"
                icon={<Package className="h-6 w-6" />}
                variant="warning"
                trend="down"
                trendValue="-3.2%"
            />
            <KpiCard
                title="Error"
                value="23"
                icon={<ShoppingCart className="h-6 w-6" />}
                variant="error"
                trend="up"
                trendValue="+5"
            />
            <KpiCard
                title="Neutral"
                value="156"
                variant="neutral"
                subtitle="pending"
            />
            <KpiCard
                title="Loading"
                value="0"
                icon={<Users className="h-6 w-6" />}
                variant="primary"
                loading={true}
            />
        </div>
    ),
};
