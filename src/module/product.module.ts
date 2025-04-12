// product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { ProductService } from '../service/product.service';
import { ProductController } from '../controller/product.controller';
import { Category } from '../entities/category.entity';
import { ProductStatus } from '../entities/product-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, ProductStatus])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
