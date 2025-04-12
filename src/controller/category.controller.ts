// category.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoryService } from '../service/category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() body) {
    return this.service.create(body);
  }
}
