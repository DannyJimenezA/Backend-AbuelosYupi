// src/dto/update-order-status.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsIn(['en_camino', 'entregado'])
  status: string;

  @IsOptional()
  @IsString()
  deliveryCode?: string;
}
