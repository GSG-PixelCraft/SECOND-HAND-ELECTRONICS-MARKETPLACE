import type { Meta, StoryObj } from "@storybook/react";
import { AppErrorBoundary } from "./AppErrorBoundary";

const meta: Meta<typeof AppErrorBoundary> = {
  title: "Components/AppErrorBoundary",
  component: AppErrorBoundary,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppErrorBoundary>;

const ThrowError = () => {
  throw new Error("Story error");
};

export const Normal: Story = {
  render: () => (
    <AppErrorBoundary>
      <div className="rounded-lg border border-neutral-20 bg-white p-6">
        App content
      </div>
    </AppErrorBoundary>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <AppErrorBoundary>
      <ThrowError />
    </AppErrorBoundary>
  ),
};
