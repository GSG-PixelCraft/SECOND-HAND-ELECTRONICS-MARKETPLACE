import type { Meta, StoryObj } from "@storybook/react";
import { VerificationImages } from "./VerificationImages";

const meta = {
  title: "Components/Admin/UI/Verification/VerificationImages",
  component: VerificationImages,
  tags: ["autodocs"],
} satisfies Meta<typeof VerificationImages>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockImages = [
  { id: "1", url: "https://picsum.photos/400/400?random=1", type: "Front ID" },
  { id: "2", url: "https://picsum.photos/400/400?random=2", type: "Back ID" },
  { id: "3", url: "https://picsum.photos/400/400?random=3", type: "Selfie" },
  { id: "4", url: "https://picsum.photos/400/400?random=4", type: "Passport" },
];

export const Default: Story = {
  args: {
    images: mockImages,
    onImageClick: (img) => console.log("Clicked", img.id),
    onImageRemove: (id) => console.log("Remove", id),
  },
};