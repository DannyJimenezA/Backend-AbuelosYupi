export class CreateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    statusId: number;
    discountId?: number;
    imageUrl: string;
  }
  