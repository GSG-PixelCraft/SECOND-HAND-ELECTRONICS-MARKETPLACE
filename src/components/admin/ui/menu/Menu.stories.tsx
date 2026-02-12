import type { Meta, StoryObj } from "@storybook/react";
import { Menu } from "./Menu";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  CheckCircle,
  Users,
  Flag,
  FolderOpen,
  Settings,
} from "lucide-react";

const meta = {
  title: "Components/Admin/UI/Menu",
  component: Menu,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMenuItems = [
  { id: "dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { id: "listings", icon: <Package />, label: "Listings", badge: 12 },
  {
    id: "verifications",
    icon: <CheckCircle />,
    label: "Verifications",
    badge: 5,
  },
  { id: "users", icon: <Users />, label: "Users" },
  { id: "reports", icon: <Flag />, label: "Reports", badge: 3 },
  { id: "categories", icon: <FolderOpen />, label: "Categories" },
  { id: "settings", icon: <Settings />, label: "Settings" },
];

const InteractiveMenuStory = () => {
  const [activeId, setActiveId] = useState("dashboard");

  return (
    <Menu
      items={sampleMenuItems}
      activeItemId={activeId}
      onItemClick={(id) => {
        setActiveId(id);
        console.log("Clicked:", id);
      }}
    />
  );
};

export const Default: Story = {
  render: () => <InteractiveMenuStory />,
  args: {
    items: sampleMenuItems,
    activeItemId: "dashboard",
  },
};
