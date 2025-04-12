// // product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  findAll() {
    return this.repo.find({ relations: ['category', 'status'] });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['category', 'status'],
    });
  }

  create(data: Partial<Product>) {
    return this.repo.save(data);
  }

  update(id: number, data: Partial<Product>) {
    return this.repo.update(id, data);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }

  async updateImage(id: number, imageUrl: string) {
    const product = await this.repo.findOneBy({ id });
    if (!product) throw new Error('Producto no encontrado');
    product.imageUrl = imageUrl;
    return this.repo.save(product);
  }
}
