import type { Meta, StoryObj } from "@storybook/react";
import { ShowPagination } from "./ShowPagination";
import { useState } from "react";

const meta = {
  title: "Components/Admin/UI/Pagination/ShowPagination",
  component: ShowPagination,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ShowPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveStory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 124;
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <ShowPagination
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      totalItems={totalItems}
      onPageChange={setCurrentPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
      }}
    />
  );
};

export const Default: Story = {
  render: () => <InteractiveStory />,
  args: {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
};
