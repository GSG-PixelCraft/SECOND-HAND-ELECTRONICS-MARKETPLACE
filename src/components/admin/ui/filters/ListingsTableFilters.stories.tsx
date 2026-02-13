import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ListingsTableFilters } from "./ListingsTableFilters";
import type { ListingFilterParams } from "@/types/admin";

const meta: Meta<typeof ListingsTableFilters> = {
  title: "Components/Admin/UI/Filters/ListingsTableFilters",
  component: ListingsTableFilters,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof ListingsTableFilters>;

const Example = () => {
  const [filters, setFilters] = useState<ListingFilterParams>({
    status: "all",
    page: 1,
    limit: 10,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <ListingsTableFilters
      filters={filters}
      onFiltersChange={setFilters}
      onClearFilters={() =>
        setFilters({
          status: filters.status,
          page: 1,
          limit: 10,
          sortBy: "createdAt",
          sortOrder: "desc",
        })
      }
    />
  );
};

export const Default: Story = {
  render: () => <Example />,
};
