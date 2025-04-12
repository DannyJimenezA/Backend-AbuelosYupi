// product.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ProductService } from '../service/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

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
