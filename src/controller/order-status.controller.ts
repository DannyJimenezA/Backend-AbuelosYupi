import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { OrderStatusService } from '../service/order-status.service';

@Controller('order-statuses')
export class OrderStatusController {
  constructor(private readonly service: OrderStatusService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() body) {
    return this.service.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body) {
    return this.service.update(+id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(+id);
  }
}
