import type { Meta, StoryObj } from "@storybook/react";
import { DashboardTableHeader } from "./DashboardTableHeader";
import { DashboardTableRow, TableCellImage, TableCellText } from "./DashboardTableRow";

const meta = {
    title: "Admin/UI/DashboardTable",
    component: DashboardTableHeader,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
    },
} satisfies Meta<typeof DashboardTableHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleColumns = [
    { key: "product", label: "Product", width: "40%" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price", align: "right" as const },
    { key: "status", label: "Status", align: "center" as const },
    { key: "actions", label: "Actions", align: "right" as const },
];

export const HeaderOnly: Story = {
    render: () => (
        <table className="w-full">
            <thead>
                <DashboardTableHeader columns={sampleColumns} />
            </thead>
        </table>
    ),
};

export const CompleteTable: Story = {
    render: () => (
        <div className="rounded-lg border border-neutral-20 overflow-hidden">
            <table className="w-full">
                <thead>
                    <DashboardTableHeader columns={sampleColumns} />
                </thead>
                <tbody>
                    <DashboardTableRow
                        cells={[
                            {
                                key: "product",
                                content: (
                                    <TableCellImage
                                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
                                        alt="Headphones"
                                        fallback="Wireless Headphones"
                                    />
                                ),
                            },
                            { key: "category", content: <TableCellText primary="Electronics" /> },
                            { key: "price", content: <TableCellText primary="$299.99" />, align: "right" },
                            {
                                key: "status",
                                content: (
                                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                                        Active
                                    </span>
                                ),
                                align: "center",
                            },
                            {
                                key: "actions",
                                content: (
                                    <button className="text-primary hover:text-primary/80 font-medium text-sm">
                                        View
                                    </button>
                                ),
                                align: "right",
                            },
                        ]}
                        isClickable
                    />
                    <DashboardTableRow
                        cells={[
                            {
                                key: "product",
                                content: (
                                    <TableCellImage
                                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop"
                                        alt="Watch"
                                        fallback="Smart Watch"
                                    />
                                ),
                            },
                            { key: "category", content: <TableCellText primary="Accessories" /> },
                            { key: "price", content: <TableCellText primary="$199.99" />, align: "right" },
                            {
                                key: "status",
                                content: (
                                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-warning/10 text-warning">
                                        Pending
                                    </span>
                                ),
                                align: "center",
                            },
                            {
                                key: "actions",
                                content: (
                                    <button className="text-primary hover:text-primary/80 font-medium text-sm">
                                        View
                                    </button>
                                ),
                                align: "right",
                            },
                        ]}
                        isClickable
                    />
                    <DashboardTableRow
                        cells={[
                            {
                                key: "product",
                                content: (
                                    <TableCellImage
                                        src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop"
                                        alt="Sunglasses"
                                        fallback="Designer Sunglasses"
                                    />
                                ),
                            },
                            { key: "category", content: <TableCellText primary="Fashion" /> },
                            { key: "price", content: <TableCellText primary="$149.99" />, align: "right" },
                            {
                                key: "status",
                                content: (
                                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-error/10 text-error">
                                        Inactive
                                    </span>
                                ),
                                align: "center",
                            },
                            {
                                key: "actions",
                                content: (
                                    <button className="text-primary hover:text-primary/80 font-medium text-sm">
                                        View
                                    </button>
                                ),
                                align: "right",
                            },
                        ]}
                        isSelected
                    />
                </tbody>
            </table>
        </div>
    ),
};

export const WithSecondaryText: Story = {
    render: () => (
        <div className="rounded-lg border border-neutral-20 overflow-hidden">
            <table className="w-full">
                <thead>
                    <DashboardTableHeader
                        columns={[
                            { key: "user", label: "User", width: "40%" },
                            { key: "email", label: "Email" },
                            { key: "role", label: "Role" },
                            { key: "status", label: "Status" },
                        ]}
                    />
                </thead>
                <tbody>
                    <DashboardTableRow
                        cells={[
                            {
                                key: "user",
                                content: <TableCellText primary="John Doe" secondary="ID: #12345" />,
                            },
                            { key: "email", content: <TableCellText primary="john@example.com" /> },
                            { key: "role", content: <TableCellText primary="Administrator" secondary="Full Access" /> },
                            {
                                key: "status",
                                content: (
                                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                                        Active
                                    </span>
                                ),
                            },
                        ]}
                        isClickable
                    />
                </tbody>
            </table>
        </div>
    ),
};
