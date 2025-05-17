import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from '../entities/promotion.entity';
import { Product } from '../entities/product.entity';
import { PromotionService } from '../service/promotion.service';
import { PromotionController } from '../controller/promotion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion, Product])],
  providers: [PromotionService],
  controllers: [PromotionController],
  exports: [PromotionService], // solo si otro módulo necesita usarlo
})
export class PromotionModule {}