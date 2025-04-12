import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  findAll() {
    return this.orderRepo.find({ relations: ['user', 'status', 'items'] });
  }

  findOne(id: number) {
    return this.orderRepo.findOne({ where: { id }, relations: ['user', 'status', 'items'] });
  }

  create(order: Partial<Order>) {
    return this.orderRepo.save(order);
  }

  update(id: number, data: Partial<Order>) {
    return this.orderRepo.update(id, data);
  }

  remove(id: number) {
    return this.orderRepo.delete(id);
  }
}
