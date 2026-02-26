// src/components/ui/FileUpload.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FileUpload, type PhotoItem } from "../FileUpload/file-upload";

const meta: Meta<typeof FileUpload> = {
  title: "Components/UI/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

const EmptyExample = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  return (
    <FileUpload
      photos={photos}
      onPhotosChange={setPhotos}
      error={error}
      onErrorChange={setError}
      emptyTitle="Click to upload or drag and drop"
      emptyHint="JPG, JPEG, PNG less than 5MB"
      addMoreLabel="Add photo"
      mainLabel="Main"
      helperText="Add up to 8 photos. The first photo will be the main photo."
    />
  );
};

const WithPhotosExample = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      file: new File([], "phone1.jpg"),
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1592286927505-ed6d33efdb0e?w=400",
      file: new File([], "phone2.jpg"),
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
      file: new File([], "phone3.jpg"),
    },
  ]);
  const [error, setError] = useState<string | null>(null);

  return (
    <FileUpload
      photos={photos}
      onPhotosChange={setPhotos}
      error={error}
      onErrorChange={setError}
      emptyTitle="Click to upload or drag and drop"
      emptyHint="JPG, JPEG, PNG less than 5MB"
      addMoreLabel="Add photo"
      mainLabel="Main"
      helperText="Add up to 8 photos. The first photo will be the main photo."
    />
  );
};

const WithErrorExample = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [error, setError] = useState<string | null>(
    "Please upload at least one photo",
  );

  return (
    <FileUpload
      photos={photos}
      onPhotosChange={setPhotos}
      error={error}
      onErrorChange={setError}
      emptyTitle="Click to upload or drag and drop"
      emptyHint="JPG, JPEG, PNG less than 5MB"
      addMoreLabel="Add photo"
      mainLabel="Main"
    />
  );
};

const WithTipsExample = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  return (
    <FileUpload
      photos={photos}
      onPhotosChange={setPhotos}
      error={error}
      onErrorChange={setError}
      emptyTitle="Click to upload or drag and drop"
      emptyHint="JPG, JPEG, PNG less than 5MB"
      addMoreLabel="Add photo"
      mainLabel="Main"
      helperText="Add up to 8 photos. The first photo will be the main photo."
      tipsLabel="Photos"
      onTipsClick={() => console.log("Tips clicked")}
    />
  );
};

export const Empty: Story = {
  render: () => <EmptyExample />,
};

export const WithPhotos: Story = {
  render: () => <WithPhotosExample />,
};

export const WithError: Story = {
  render: () => <WithErrorExample />,
};

export const WithTips: Story = {
  render: () => <WithTipsExample />,
};
