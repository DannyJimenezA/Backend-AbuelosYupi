// category.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  findAll() {
    return this.repo.find();
  }

  create(data: Partial<Category>) {
    return this.repo.save(data);
  }

  async update(id: number, data: Partial<Category>) {
  await this.repo.update(id, data);
  return this.repo.findOne({ where: { id } });
}


findOne(id: number) {
  return this.repo.findOne({ where: { id } });
}

}
