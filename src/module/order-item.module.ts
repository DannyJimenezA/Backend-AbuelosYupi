import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { OrderItemService } from '../service/order-item.service';
import { OrderItemController } from '../controller/order-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order, Product])],
  providers: [OrderItemService],
  controllers: [OrderItemController],
  exports: [OrderItemService],
})
export class OrderItemModule {}
