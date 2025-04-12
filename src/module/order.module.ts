import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderService } from '../service/order.service';
import { OrderController } from '../controller/order.controller';
import { OrderItem } from '../entities/order-item.entity';
import { User } from '../entities/user.entity';
import { OrderStatus } from '../entities/order-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, User, OrderStatus])],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
