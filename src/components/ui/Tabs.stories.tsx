import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, type TabValue } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/UI/Tabs",
  component: Tabs,
};

export default meta;

type Story = StoryObj<typeof Tabs>;

function TabsStory() {
  const [value, setValue] = React.useState<TabValue>("all");
  return (
    <Tabs
      value={value}
      onChange={setValue}
      counts={{
        all: 128,
        pending: 12,
        active: 64,
        rejected: 6,
        sold: 18,
        archived: 5,
        drafts: 3,
      }}
    />
  );
}

export const Default: Story = {
  render: () => <TabsStory />,
};