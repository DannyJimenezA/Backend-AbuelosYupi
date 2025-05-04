import { IsInt } from 'class-validator';

export class AssignDeliveryDto {
  @IsInt()
  deliveryPersonId: number;
}