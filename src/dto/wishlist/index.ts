export type WishlistItem = {
  id: string;
  title: string;
  price: number;
  images: string[];
  location: string | null;
  category: { id: string; name: string } | null;
  condition: string;
  status?: string;
  isNegotiable: boolean;
  createdAt: string;
  seller?: {
    id: string;
    name: string;
    avatar?: string;
  };
};
