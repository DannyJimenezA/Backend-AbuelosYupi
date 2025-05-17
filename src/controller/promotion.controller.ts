import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { PromotionService } from "src/service/promotion.service";
import { CreatePromotionDto } from "src/dto/create-promotion.dto";

@Controller('promotions')
export class PromotionController {
  constructor(private readonly promoService: PromotionService) {}

  @Get()
  findAll() {
    return this.promoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promoService.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() body: CreatePromotionDto) {
    return this.promoService.create(body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.promoService.delete(id);
  }
}
