import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from 'src/dto/create-order.dto';

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

  @Get('user/:id')
  getOrdersByUser(@Param('id') id: number) {
    return this.orderService.findByUserId(id);
  }
  

  @Post()
  create(@Body() body: CreateOrderDto) {
    return this.orderService.createOrder(body.userId, body.items);
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
