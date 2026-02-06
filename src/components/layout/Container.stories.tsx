import type { Meta, StoryObj } from "@storybook/react";
import Container from "./Container";

const meta: Meta<typeof Container> = {
  title: "Components/Layout/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  render: () => (
    <Container maxWidth="6xl">
      <div className="rounded-xl border border-dashed border-neutral-20 bg-white p-8 text-center">
        Container content
      </div>
    </Container>
  ),
};