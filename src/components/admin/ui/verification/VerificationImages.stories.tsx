import type { Meta, StoryObj } from "@storybook/react";
import { VerificationImages } from "./VerificationImages";

const meta = {
    title: "Admin/UI/Verification/VerificationImages",
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
    { id: "5", url: "https://picsum.photos/400/400?random=5" },
];

export const Default: Story = {
    args: {
        images: mockImages,
        onImageClick: (img) => alert(`Clicked ${img.id}`),
        onImageRemove: (id) => alert(`Remove ${id}`),
    },
};

export const MaxDisplay: Story = {
    args: {
        images: mockImages,
        maxDisplay: 3,
    },
};

export const TwoColumns: Story = {
    args: {
        images: mockImages.slice(0, 4),
        columns: 2,
    },
};
