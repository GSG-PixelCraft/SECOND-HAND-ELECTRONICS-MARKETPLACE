export interface CategoryIcon {
  id: string;
  url: string;
  fileName: string;
  type: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: CategoryIcon;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
