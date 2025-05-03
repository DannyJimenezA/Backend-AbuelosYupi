import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Discount } from '../entities/discount.entity';
import { ProductStatus } from 'src/entities/product-status.entity';

const AGOTADO_STATUS_ID = 2; // ID del estado "agotado"
const ACTIVO_STATUS_ID = 1;  // ID del estado "activo"

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    @InjectRepository(Discount) private discountRepo: Repository<Discount>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['category', 'status', 'discount'] });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['category', 'status', 'discount'],
    });
  }

  // async create(data: Partial<Product> & { categoryId: number; statusId: number; discountId?: number }) {
  //   const product = this.repo.create({
  //     name: data.name,
  //     description: data.description,
  //     price: Number(data.price),
  //     stock: data.stock,
  //     imageUrl: data.imageUrl,
  //     category: { id: data.categoryId },
  //     status: {
  //       id: data.stock === 0 ? AGOTADO_STATUS_ID : data.statusId,
  //     },
  //   });

  //   if (data.discountId) {
  //     const discount = await this.discountRepo.findOne({ where: { id: data.discountId } });
  //     if (!discount) throw new Error('Descuento no encontrado');
  //     product.discount = discount;
  //   }

  //   return this.repo.save(product);
  // }

  async create(data: Partial<Product> & { categoryId: number; statusId: number; discountId?: number }) {
    const price = parseFloat(String(data.price));
    const stock = parseInt(String(data.stock), 10);
  
    if (isNaN(price)) throw new Error('Precio inválido');
    if (isNaN(stock)) throw new Error('Stock inválido');
  
    const product = this.repo.create({
      name: data.name,
      description: data.description,
      price,
      stock,
      imageUrl: data.imageUrl,
      category: { id: data.categoryId },
      status: {
        id: stock === 0 ? AGOTADO_STATUS_ID : data.statusId,
      },
    });
  
    if (data.discountId) {
      const discount = await this.discountRepo.findOne({ where: { id: data.discountId } });
      if (!discount) throw new Error('Descuento no encontrado');
      product.discount = discount;
    }
  
    return this.repo.save(product);
  }
  

  async update(id: number, data: Partial<Product>) {
    console.log('📦 BODY recibido en update:', data); // 👈 AGREGALO
  
    const product = await this.repo.findOne({
      where: { id },
      relations: ['status'],
    });
  
    if (!product) throw new Error('Producto no encontrado');
  
    const { stock, ...rest } = data;
    Object.assign(product, rest);
  
    if (typeof stock === 'number') {
      product.stock = stock;
  
      if (stock === 0) {
        product.status = { id: 2 } as ProductStatus;
      } else if (product.status.id === 2) {
        product.status = { id: 1 } as ProductStatus;
      }
    }
  
    return this.repo.save(product);
  }
  
  

  async updateImage(id: number, imageUrl: string) {
    const product = await this.repo.findOneBy({ id });
    if (!product) throw new Error('Producto no encontrado');
    product.imageUrl = imageUrl;
    return this.repo.save(product);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }

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

  async findPromotions(): Promise<Product[]> {
    return this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.discount', 'discount')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.status', 'status')
      .where('discount.percentage > 0')
      .getMany();
  }

  // ✅ Verificación de stock antes de comprar
  async checkStock(productId: number, requestedQuantity: number) {
    const product = await this.repo.findOne({ where: { id: productId } });
    if (!product) throw new Error('Producto no encontrado');

    if (product.stock === 0) {
      throw new Error('Este producto está agotado');
    }

    if (requestedQuantity > product.stock) {
      throw new Error(`Solo hay ${product.stock} unidades disponibles`);
    }

    return true;
  }
}
