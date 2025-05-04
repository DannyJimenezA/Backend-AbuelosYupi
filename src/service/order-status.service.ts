import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from '../entities/order-status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectRepository(OrderStatus)
    private repo: Repository<OrderStatus>,
  ) {}

  findAll() {
    return this.repo.find();
  }
  async findByName(name: string): Promise<OrderStatus> {
    const status = await this.repo.findOne({ where: { name } });
    if (!status) throw new Error(`Estado '${name}' no encontrado`);
    return status;
  }
  create(data: Partial<OrderStatus>) {
    return this.repo.save(data);
  }

  update(id: number, data: Partial<OrderStatus>) {
    return this.repo.update(id, data);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}
