import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatus } from '../entities/order-status.entity';
import { OrderStatusService } from '../service/order-status.service';
import { OrderStatusController } from '../controller/order-status.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatus])],
  providers: [OrderStatusService],
  controllers: [OrderStatusController],
  exports: [OrderStatusService],
})
export class OrderStatusModule {}
