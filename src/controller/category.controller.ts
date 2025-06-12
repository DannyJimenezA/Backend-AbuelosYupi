import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CategoryService } from '../service/category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const imageUrl = file ? `/uploads/categories/${file.filename}` : null;

    const data = {
      name: body.name,
      description: body.description,
      imageUrl,
    };

    return this.categoryService.create(data);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const imageUrl = file ? `/uploads/categories/${file.filename}` : undefined;

    const data: any = {
      name: body.name,
      description: body.description,
    };

    if (imageUrl) {
      data.imageUrl = imageUrl;
    }

    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
