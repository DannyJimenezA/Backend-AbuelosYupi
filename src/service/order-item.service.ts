import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly repo: Repository<OrderItem>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['order', 'product'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['order', 'product'] });
  }

  create(data: Partial<OrderItem>) {
    const item = this.repo.create(data);
    return this.repo.save(item);
  }

  update(id: number, data: Partial<OrderItem>) {
    return this.repo.update(id, data);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}
