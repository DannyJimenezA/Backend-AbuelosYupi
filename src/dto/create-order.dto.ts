export class CreateOrderDto {
  userId: number;
  items: {
    productId: number;
    quantity: number;
    price: number; // 👈 unitario, más flexible
  }[];
  combos?: {
    promotionId: number;
    quantity: number;
    price: number;
  }[];
}

  