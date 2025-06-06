import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Put,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Category } from '../entities/category.entity';
import { ProductStatus } from '../entities/product-status.entity';
import { Product } from 'src/entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

// @Get()
// findAll(@Query('categoryId') categoryId?: string) {
//   const parsedId = parseInt(categoryId);
//   if (!isNaN(parsedId)) {
//     return this.service.findByCategory(parsedId);
//   }
//   return this.service.findAll();
// }
@Get('promotions') 
findPromotions() {
  return this.service.findPromotions();
}

@Get()
findAll(@Query('categoryId') categoryId?: string) {
  const parsedId = parseInt(categoryId);
  if (!isNaN(parsedId)) {
    return this.service.findByCategory(parsedId);
  }
  return this.service.findAll();
}




  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }


  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const imageUrl = file ? `/uploads/products/${file.filename}` : null;

    const category = new Category();
    category.id = parseInt(body.categoryId);

    const status = new ProductStatus();
    status.id = parseInt(body.statusId);

    const data = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      stock: parseInt(body.stock),
      categoryId: parseInt(body.categoryId),
      statusId: parseInt(body.statusId),
      imageUrl,
      discountId: body.discountId ? parseInt(body.discountId) : undefined,
    };

    return this.service.create(data);
  }

  // @Put(':id')
  // update(@Param('id') id: number, @Body() body) {
  //   return this.service.update(+id, body);
  // }
  @Put(':id')
update(@Param('id') id: number, @Body() body: Partial<Product>) {
  return this.service.update(+id, body);
}


  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(+id);
  }
  @Patch(':id')
async updateStock(
  @Param('id') id: number,
  @Body() body: Partial<Product>,
) {
  return this.service.update(id, body);
}
}
