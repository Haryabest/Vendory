export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId?: string;
  status: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  avatarUrl?: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  balance: number;
  isBanned: boolean;
}
