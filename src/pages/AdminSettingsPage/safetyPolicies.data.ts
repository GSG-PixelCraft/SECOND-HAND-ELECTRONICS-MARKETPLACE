export type Tab = "safety" | "photo" | "faq" | "report" | "rejection";
export type RejectTab = "verification" | "listing";
export type AppliesTo = "Listing" | "User" | "Chat";

export type Tip = { id: string; text: string };
export type Accordion = {
  id: string;
  title: string;
  body: string;
  open?: boolean;
  visible: boolean;
};
export type Faq = { id: string; q: string; a: string; visible: boolean };
export type Report = {
  id: string;
  reason: string;
  applies: AppliesTo[];
  needDesc: boolean;
  visible: boolean;
};
export type VerifyReason = {
  id: string;
  reason: string;
  needDesc: boolean;
  visible: boolean;
};
export type ListingReason = {
  id: string;
  issue: string;
  primary: string;
  needDesc: boolean;
  visible: boolean;
};
export type PrimaryIssue = { id: string; issue: string; visible: boolean };

export type ApplyFilter = "All" | AppliesTo;

export type ReportModalState = {
  id?: string;
  reason: string;
  applies: AppliesTo[];
  needDesc: boolean;
  visible: boolean;
};

export type RejectReasonModalState = {
  mode: "add" | "edit";
  id?: string;
  reason: string;
  needDesc: boolean;
  visible: boolean;
};

export type PrimaryIssueModalState = {
  mode: "add" | "edit";
  id?: string;
  issue: string;
  visible: boolean;
};

export type SpecificIssueModalState = {
  mode: "add" | "edit";
  id?: string;
  issue: string;
  primary: string;
  needDesc: boolean;
  visible: boolean;
};

export type DeleteState = {
  kind: Tab;
  id: string;
  entity?: "verification" | "primary" | "specific";
};

export type FaqModalState = { id?: string; q: string; a: string };
export type PhotoTipModalState = { id?: string; title: string; body: string };

export const safetySeed: Tip[] = [
  { id: "1", text: "Never meet in an unsafe location" },
  { id: "2", text: "Don't pay inspection fees" },
  { id: "3", text: "Inspect the product carefully before payment" },
];

export const photoSeed: Accordion[] = [
  {
    id: "1",
    title: "Zoom In",
    body: "Get close to the product or move away from it and fill the frame with it to give potential buyers a clear view of the details. Avoid zooming in or cropping the image incorrectly, which can result in a distorted or blurry picture.",
    open: true,
    visible: true,
  },
  {
    id: "2",
    title: "Use Good Lighting",
    body: "Good lighting is essential for capturing attractive images. Use natural light whenever possible by shooting near a window or outdoors during the day. If shooting indoors, consider using soft, diffused light sources such as lamps or light boxes to avoid shadows.",
    open: true,
    visible: true,
  },
  {
    id: "3",
    title: "Multiple Angles",
    body: "Take photos from different angles to give buyers a comprehensive view of the product. Take photos from all angles to highlight any imperfections and provide an accurate description.",
    open: true,
    visible: true,
  },
  {
    id: "4",
    title: "Background",
    body: "Choose a clean, clutter-free background so it doesn't distract from the product. Often, use a plain white or neutral-colored background, which enhances the focus on the product itself.",
    open: true,
    visible: true,
  },
  {
    id: "5",
    title: "Taking Blurry Photos",
    body: "Make sure your product is within the lens's range. Use autofocus on your camera or smartphone, or adjust the focus manually if necessary. Blurry, blurry photos can deter potential buyers.",
    open: true,
    visible: true,
  },
];

export const faqSeed: Faq[] = [
  {
    id: "1",
    q: "What is this app?",
    a: "A marketplace for buying and selling used electronics.",
    visible: true,
  },
  {
    id: "2",
    q: "How do I add a listing?",
    a: "Open Add Listing, fill details and submit for review.",
    visible: true,
  },
];

export const reportSeed: Report[] = [
  {
    id: "1",
    reason: "Scam or misleading information",
    applies: ["Listing"],
    needDesc: false,
    visible: true,
  },
  {
    id: "2",
    reason: "Harassment or abusive behavior",
    applies: ["User", "Chat"],
    needDesc: false,
    visible: true,
  },
];

export const verifySeed: VerifyReason[] = [
  {
    id: "1",
    reason: "Name does not match the profile",
    needDesc: false,
    visible: true,
  },
  { id: "2", reason: "ID document is expired", needDesc: false, visible: true },
  {
    id: "3",
    reason: "Expiry date is unclear or unreadable",
    needDesc: false,
    visible: true,
  },
  {
    id: "4",
    reason: "Front and back images belong to different IDs",
    needDesc: false,
    visible: true,
  },
  {
    id: "5",
    reason: "Selfie does not match ID photo",
    needDesc: false,
    visible: true,
  },
  {
    id: "6",
    reason: "Face is unclear or covered",
    needDesc: false,
    visible: true,
  },
  {
    id: "7",
    reason: "User is not holding the ID",
    needDesc: false,
    visible: true,
  },
  {
    id: "8",
    reason: "ID is not clearly visible in the selfie",
    needDesc: false,
    visible: true,
  },
  { id: "9", reason: "Additional notes", needDesc: true, visible: true },
];

export const primaryIssueSeed: PrimaryIssue[] = [
  { id: "p1", issue: "Photos & Visual Accuracy", visible: true },
  { id: "p2", issue: "Listing Information Accuracy", visible: true },
  { id: "p3", issue: "Product Specifications Consistency", visible: true },
  { id: "p4", issue: "Description & Disclosure Quality", visible: true },
];

export const listingSeed: ListingReason[] = [
  {
    id: "s1",
    issue: "Photos do not clearly show the actual item",
    primary: "Photos & Visual Accuracy",
    needDesc: false,
    visible: true,
  },
  {
    id: "s2",
    issue: "Damage mentioned in the description is not visible in the photos",
    primary: "Photos & Visual Accuracy",
    needDesc: false,
    visible: true,
  },
  {
    id: "s3",
    issue: "Images are blurry or low quality",
    primary: "Photos & Visual Accuracy",
    needDesc: false,
    visible: true,
  },
  {
    id: "s4",
    issue: "Stock images used instead of real photos",
    primary: "Photos & Visual Accuracy",
    needDesc: true,
    visible: true,
  },
  {
    id: "s5",
    issue: "Inaccurate title",
    primary: "Listing Information Accuracy",
    needDesc: false,
    visible: true,
  },
  {
    id: "s6",
    issue: "Mismatched category and item type",
    primary: "Listing Information Accuracy",
    needDesc: false,
    visible: true,
  },
  {
    id: "s7",
    issue: "Pricing information is misleading",
    primary: "Listing Information Accuracy",
    needDesc: false,
    visible: true,
  },
];
