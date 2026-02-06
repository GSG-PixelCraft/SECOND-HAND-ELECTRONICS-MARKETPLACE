import type { Meta, StoryObj } from "@storybook/react";
import { ToggleControlPanel } from "./ToggleControlPanel";
import { useState, type ComponentProps } from "react";

const meta = {
  title: "Components/Admin/UI/Toggle/ToggleControlPanel",
  component: ToggleControlPanel,
  tags: ["autodocs"],
} satisfies Meta<typeof ToggleControlPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

type ToggleControlPanelStoryArgs = ComponentProps<typeof ToggleControlPanel>;

const DefaultStory = (args: ToggleControlPanelStoryArgs) => {
  const [enabled, setEnabled] = useState(args.enabled);
  return <ToggleControlPanel {...args} enabled={enabled} onToggle={setEnabled} />;
};

export const Default: Story = {
  args: {
    label: "Enable email notifications",
    description: "Receive updates about new listings and sales via email.",
    enabled: false,
    onToggle: () => {},
  },
  render: (args) => <DefaultStory {...args} />,
};