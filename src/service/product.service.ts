// // // product.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Product } from '../entities/product.entity';
// import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';

// @Injectable()
// export class ProductService {
//   constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

//   findAll() {
//     return this.repo.find({ relations: ['category', 'status'] });
//   }

//   findOne(id: number) {
//     return this.repo.findOne({
//       where: { id },
//       relations: ['category', 'status'],
//     });
//   }

//   create(data: Partial<Product>) {
//     const product = this.repo.create({
//       name: data.name,
//       description: data.description,
//       price: Number(data.price),
//       stock: data.stock,
//       category: { id: data.category?.id || data['categoryId'] },
//       status: { id: data.status?.id || data['statusId'] },
//       discount: Number(data.discount) || 0,
//       imageUrl: data.imageUrl,
//     });

//     if (product.discount < 0 || product.discount > 1) {
//       throw new Error('El descuento debe estar entre 0 y 1');
//     }

//     return this.repo.save(product);
//   }



//   update(id: number, data: Partial<Product>) {
//     return this.repo.update(id, data);
//   }

//   delete(id: number) {
//     return this.repo.delete(id);
//   }

//   async updateImage(id: number, imageUrl: string) {
//     const product = await this.repo.findOneBy({ id });
//     if (!product) throw new Error('Producto no encontrado');
//     product.imageUrl = imageUrl;
//     return this.repo.save(product);
//   }

//   async findByCategory(categoryId: number) {
//     return this.repo.find({
//       where: {
//         category: { id: categoryId },
//       },
//       relations: ['category', 'status'],
//     });
//   }

//   findPromotions() {
//     const today = new Date();
//     return this.repo.find({
//       where: {
//         discount: {
//           percentage: Not(0),
//           startDate: LessThanOrEqual(today),
//           endDate: MoreThanOrEqual(today),
//         },
//       },
//       relations: ['category', 'status', 'discount'],
//     });
//   }



// }


import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { Discount } from '../entities/discount.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    @InjectRepository(Discount) private discountRepo: Repository<Discount>,
  ) { }

  findAll() {
    return this.repo.find({ relations: ['category', 'status', 'discount'] });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['category', 'status', 'discount'],
    });
  }

  async create(data: Partial<Product> & { categoryId: number; statusId: number; discountId?: number }) {
    const product = this.repo.create({
      name: data.name,
      description: data.description,
      price: Number(data.price),
      stock: data.stock,
      imageUrl: data.imageUrl,
      category: { id: data.categoryId },
      status: { id: data.statusId },
    });

    // ⚠️ Validamos y asignamos la relación con el descuento (si viene)
    if (data.discountId) {
      const discount = await this.discountRepo.findOne({ where: { id: data.discountId } });
      if (!discount) throw new Error('Descuento no encontrado');
      product.discount = discount;
    }

    return this.repo.save(product);
  }

  // async findPromotions(): Promise<Product[]> {
  //   return this.repo.find({
  //     where: {
  //       discount: {
  //         percentage: Not(0),
  //       },
  //     },
  //     relations: ['discount'],
  //   });
  // }

  // async findPromotions(): Promise<Product[]> {
  //   return this.repo.find({
  //     where: {
  //       discount: Not(IsNull()), // ✅ Solo productos que tienen discount asignado
  //     },
  //     relations: ['discount', 'category', 'status'],
  //   });
  // }
  async findPromotions(): Promise<Product[]> {
    return this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.discount', 'discount')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.status', 'status')
      .where('discount.percentage > 0')
      .getMany();
  }
  
  
  

  async updateImage(id: number, imageUrl: string) {
    const product = await this.repo.findOneBy({ id });
    if (!product) throw new Error('Producto no encontrado');
    product.imageUrl = imageUrl;
    return this.repo.save(product);
  }

  // async findByCategory(categoryId: number) {
  //   return this.repo.find({
  //     where: {
  //       category: { id: categoryId },
  //     },
  //     relations: ['category', 'status'],
  //   });
  // }
  async findByCategory(categoryId: number) {
    if (isNaN(categoryId)) {
      throw new Error('ID de categoría inválido');
    }
  
    return this.repo.find({
      where: {
        category: { id: categoryId },
      },
      relations: ['category', 'status', 'discount'],
    });
  }
  

  update(id: number, data: Partial<Product>) {
    return this.repo.update(id, data);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}
