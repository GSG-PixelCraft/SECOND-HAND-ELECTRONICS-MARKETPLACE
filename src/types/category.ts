export interface CategoryIcon {
  id: string;
  url: string;
  fileName: string;
  type: string;
  createdAt: string;
  storageProviderName?: string;
  fileId?: string;
  fileSizeInKB?: number;
  fileType?: string;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  uploaderId?: string | null;
  updatedAt?: string;
  productId?: string | null;
}

export interface CategoryAttribute {
  id: string;
  categoryId: string;
  name: string;
  type: string;
  body?: Record<string, unknown>;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
  assetId?: string | null;
}

export interface Category {
  id: string;
  name: string;
  icon: CategoryIcon | null;
  parentId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  attributes?: CategoryAttribute[];
}
