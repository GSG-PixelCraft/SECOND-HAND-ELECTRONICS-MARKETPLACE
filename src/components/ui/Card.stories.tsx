import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "./Card";
import { Button } from "./button";

const meta: Meta<typeof Card> = {
  title: "Components/UI/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader className="border-b">
        <CardTitle>Card Title</CardTitle>
        <CardDescription className="text-muted-foreground">
          Supporting description text.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-60 text-sm">
          This card mirrors the structure used in production layouts.
        </p>
      </CardContent>
      <CardFooter>
        <Button intent="outline" size="sm">
          Action
        </Button>
      </CardFooter>
    </Card>
  ),
};
