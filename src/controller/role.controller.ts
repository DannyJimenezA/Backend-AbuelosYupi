// role.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { RoleService } from '../service/role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() body) {
    return this.service.create(body);
  }
}
