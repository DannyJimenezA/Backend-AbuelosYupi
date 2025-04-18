import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from 'src/entities/discount.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepo: Repository<Discount>,
  ) {}

  // 🟢 Crear un nuevo descuento
  create(data: Partial<Discount>) {
    const discount = this.discountRepo.create(data);
    return this.discountRepo.save(discount);
  }

  // 🔵 Obtener todos los descuentos
  findAll() {
    return this.discountRepo.find();
  }

  // 🟣 Obtener un solo descuento por ID
  findOne(id: number) {
    return this.discountRepo.findOneBy({ id });
  }

  // 🟠 Actualizar descuento
  update(id: number, data: Partial<Discount>) {
    return this.discountRepo.update(id, data);
  }

  // 🔴 Eliminar descuento
  remove(id: number) {
    return this.discountRepo.delete(id);
  }
}
