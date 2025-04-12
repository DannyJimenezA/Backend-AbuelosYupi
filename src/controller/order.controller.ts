import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { OrderService } from '../service/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.orderService.findOne(+id);
  }

  @Post()
  create(@Body() body) {
    return this.orderService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body) {
    return this.orderService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.orderService.remove(+id);
  }
}
