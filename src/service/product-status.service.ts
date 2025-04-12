import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductStatus } from '../entities/product-status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductStatusService {
  constructor(
    @InjectRepository(ProductStatus)
    private repo: Repository<ProductStatus>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  create(data: Partial<ProductStatus>) {
    return this.repo.save(data);
  }

  update(id: number, data: Partial<ProductStatus>) {
    return this.repo.update(id, data);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}
