import type { Meta, StoryObj } from "@storybook/react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./app-layout";

const meta: Meta<typeof AppLayout> = {
  title: "Components/Layout/AppLayout",
  component: AppLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

export const Default: Story = {
  render: () => (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          index
          element={
            <div className="rounded-xl border border-dashed border-neutral-20 bg-white p-8 text-center">
              AppLayout content
            </div>
          }
        />
      </Route>
    </Routes>
  ),
};