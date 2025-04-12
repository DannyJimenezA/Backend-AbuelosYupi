import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStatus } from '../entities/product-status.entity';
import { ProductStatusService } from '../service/product-status.service';
import { ProductStatusController } from '../controller/product-status.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductStatus])],
  providers: [ProductStatusService],
  controllers: [ProductStatusController],
  exports: [ProductStatusService],
})
export class ProductStatusModule {}
