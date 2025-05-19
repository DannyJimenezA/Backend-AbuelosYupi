// dto/update-stock.dto.ts
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductStockUpdate {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateStockDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductStockUpdate)
  updates: ProductStockUpdate[];
}
