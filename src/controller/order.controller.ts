import { Controller, Get, Post, Body, Param, Put, Delete, Patch, ParseIntPipe, Request } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from 'src/dto/create-order.dto';
import { AssignDeliveryDto } from 'src/dto/assign-delivery.dto';
import { UpdateOrderStatusDto } from 'src/dto/update-order-status.dto';

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
//   @Get('delivery/:id')
// findByDeliveryPerson(@Param('id') id: number) {
//   return this.orderSer.find({
//     where: { deliveryPerson: { id } },
//     relations: ['user', 'status', 'items', 'items.product', 'deliveryPerson'],
//     order: { id: 'DESC' },
//   });
// }

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

  @Patch(':id/assign')
  assignDelivery(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignDeliveryDto,
  ) {
    return this.orderService.assignDelivery(id, dto.deliveryPersonId);
  }

  /**
   * REPARTIDOR actualiza estado del pedido
   */
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.orderService.updateOrderStatus(id, userId, dto);
  }
}
