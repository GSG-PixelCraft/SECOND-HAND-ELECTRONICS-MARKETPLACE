import type { Meta, StoryObj } from "@storybook/react";
import { DashboardTableHeader } from "./DashboardTableHeader";
import { DashboardTableRow, TableCellImage, TableCellText } from "./DashboardTableRow";

const meta = {
  title: "Components/Admin/UI/Table/DashboardTable",
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

export const Default: Story = {
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
        </tbody>
      </table>
    </div>
  ),
};