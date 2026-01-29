import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import type { TabValue } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
};

export default meta;

type Story = StoryObj<typeof Tabs>;

function TabsStory() {
  const [value, setValue] = React.useState<TabValue>("all");
  return <Tabs value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: () => <TabsStory />,
};
