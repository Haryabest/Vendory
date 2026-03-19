export interface CreateProductDto {
  title: string;
  description: string;
  price: number;
  categoryId?: string;
  stock?: number;
}

export interface UpdateProductDto {
  title?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  stock?: number;
  status?: string;
}
