import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderService } from '../service/order.service';
import { OrderController } from '../controller/order.controller';
import { OrderItem } from '../entities/order-item.entity';
import { User } from '../entities/user.entity';
import { OrderStatus } from '../entities/order-status.entity';
import { Product } from 'src/entities/product.entity';
import { OrderStatusModule } from './order-status.module';
import { OrderPromotion } from 'src/entities/oder-promotion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem,Product, User, OrderStatus, OrderPromotion,]),
  OrderStatusModule,
],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
