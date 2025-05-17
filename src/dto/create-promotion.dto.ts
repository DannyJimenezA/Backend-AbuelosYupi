import {
  IsArray,
  ArrayNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['combo', 'discount'])
  type: 'combo' | 'discount';

  @IsOptional()
  @IsNumber()
  discountPercentage?: number;

  @IsOptional()
  @IsNumber()
  comboPrice?: number;

  @IsArray()
  @ArrayNotEmpty({ message: 'Debe seleccionar al menos un producto' })
  @IsNumber({}, { each: true })
  productIds: number[];
}


