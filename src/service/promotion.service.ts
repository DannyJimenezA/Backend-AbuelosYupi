import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/entities/product.entity";
import { Promotion } from "src/entities/promotion.entity";
import { In, Repository } from "typeorm";
import { CreatePromotionDto } from "src/dto/create-promotion.dto"; // 💡 recomendado

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private promoRepo: Repository<Promotion>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.promoRepo.find({ relations: ['products'] });
  }

  findOne(id: number) {
    return this.promoRepo.findOne({ where: { id }, relations: ['products'] });
  }

//   async create(data: CreatePromotionDto) {
//     if (data.type === 'combo' && !data.comboPrice) {
//       throw new BadRequestException('Precio del combo es requerido');
//     }

//     if (data.type === 'discount' && !data.discountPercentage) {
//       throw new BadRequestException('Porcentaje de descuento requerido');
//     }

//     const products = await this.productRepo.findBy({ id: In(data.productIds) });

//     if (!products.length) {
//       throw new BadRequestException('Debe seleccionar al menos un producto');
//     }

//     const promo = this.promoRepo.create({
//       title: data.title,
//       description: data.description,
//       type: data.type,
//       discountPercentage: data.discountPercentage,
//       comboPrice: data.comboPrice,
//       products,
//     });

//     return this.promoRepo.save(promo);
//   }
async create(data: CreatePromotionDto) {
    // 💥 Validaciones condicionales según el tipo
    if (data.type === 'combo' && !data.comboPrice) {
      throw new BadRequestException('Precio del combo es requerido');
    }

    if (data.type === 'discount' && data.discountPercentage == null) {
  throw new BadRequestException('Porcentaje de descuento requerido');
}

    // 🛡 Validación de productos
    if (!Array.isArray(data.productIds) || !data.productIds.length) {
      throw new BadRequestException('Debe seleccionar al menos un producto');
    }

    const products = await this.productRepo.findBy({ id: In(data.productIds) });

    if (!products.length) {
      throw new BadRequestException('Los productos seleccionados no existen');
    }

    // 🧱 Crear y guardar promoción
    const promo = this.promoRepo.create({
      title: data.title,
      description: data.description,
      type: data.type,
      discountPercentage: data.discountPercentage,
      comboPrice: data.comboPrice,
      products,
    });

    return this.promoRepo.save(promo);
  }

  async delete(id: number) {
    const promo = await this.promoRepo.findOne({ where: { id } });
    if (!promo) {
      throw new NotFoundException('Promoción no encontrada');
    }
    return this.promoRepo.delete(id);
  }
  async decreaseStock(updates: { productId: number; quantity: number }[]) {
  for (const { productId, quantity } of updates) {
    const product = await this.productRepo.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException(`Producto con id ${productId} no encontrado`);
    }

    if (product.stock < quantity) {
      throw new BadRequestException(`Stock insuficiente para el producto ${product.name}`);
    }

    product.stock -= quantity;
    await this.productRepo.save(product);
  }

  return { success: true };
}


}
