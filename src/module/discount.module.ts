import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from 'src/entities/discount.entity';
import { DiscountService } from 'src/service/discount.service';
import { DiscountController } from 'src/controller/discount.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Discount])],
  providers: [DiscountService],
  controllers: [DiscountController],
  exports: [DiscountService],
})
export class DiscountModule {}
