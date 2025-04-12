// category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { CategoryService } from '../service/category.service';
import { CategoryController } from '../controller/category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
