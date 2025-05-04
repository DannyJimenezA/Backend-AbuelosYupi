
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Order } from '../entities/order.entity';
// import { OrderItem } from '../entities/order-item.entity';
// import { Product } from '../entities/product.entity';

// @Injectable()
// export class OrderService {
//   constructor(
//     @InjectRepository(Order)
//     private orderRepo: Repository<Order>,

//     @InjectRepository(OrderItem)
//     private itemRepo: Repository<OrderItem>,

//     @InjectRepository(Product)
//     private productRepo: Repository<Product>,
//   ) {}

//   findAll() {
//     return this.orderRepo.find({
//       relations: ['user', 'status', 'items', 'items.product'],
//     });
//   }

//   findOne(id: number) {
//     return this.orderRepo.findOne({
//       where: { id },
//       relations: ['user', 'status', 'items', 'items.product'],
//     });
//   }

//   // async createOrder(
//   //   userId: number,
//   //   itemsData: { productId: number; quantity: number; subtotal?: number }[],
//   // ) {
//   //   const items: OrderItem[] = [];
  
//   //   // Crear y validar OrderItems
//   //   for (const item of itemsData) {
//   //     const product = await this.productRepo.findOne({ where: { id: item.productId } });
//   //     if (!product) continue;
  
//   //     const quantity = item.quantity;
//   //     const subtotal = product.price * quantity;
  
//   //     const orderItem = this.itemRepo.create({
//   //       product: { id: item.productId },
//   //       quantity,
//   //       subtotal, // 👈 garantizado que se setea correctamente
//   //     });
  
//   //     items.push(orderItem);
//   //   }
  
//   //   await this.itemRepo.save(items);
  
//   //   const totalPrice = items.reduce((acc, i) => acc + i.subtotal, 0);
  
//   //   const newOrder = this.orderRepo.create({
//   //     user: { id: userId },
//   //     totalPrice,
//   //     status: { id: 1 },
//   //     items,
//   //     deliveryAddress: 'Dirección por confirmar',
//   //   });
  
//   //   return this.orderRepo.save(newOrder);
//   // }
  
//   async createOrder(userId: number, itemsData: { productId: number; quantity: number }[]) {
//     const items: OrderItem[] = [];
//     let totalPrice = 0;
  
//     for (const item of itemsData) {
//       const product = await this.productRepo.findOne({ where: { id: item.productId } });
//       if (!product) {
//         throw new Error(`Producto con ID ${item.productId} no encontrado`);
//       }
  
//       if (product.stock < item.quantity) {
//         throw new Error(`Stock insuficiente para el producto ${product.name}`);
//       }
  
//       // Descontar stock
//       product.stock -= item.quantity;
//       await this.productRepo.save(product);
  
//       const subtotal = product.price * item.quantity;
//       totalPrice += subtotal;
  
//       const orderItem = this.itemRepo.create({
//         product,
//         quantity: item.quantity,
//         subtotal,
//       });
  
//       items.push(orderItem);
//     }
  
//     // Primero guardamos los items
//     await this.itemRepo.save(items);
  
//     // Ahora guardamos la orden
//     const order = this.orderRepo.create({
//       user: { id: userId },
//       status: { id: 1 }, // Estado inicial
//       totalPrice,
//       items,
//       deliveryAddress: 'Dirección por confirmar',
//     });
  
//     return this.orderRepo.save(order);
//   }
  
//   findByUserId(userId: number) {
//     return this.orderRepo.find({
//       where: { user: { id: userId } },
//       relations: ['user', 'status', 'items', 'items.product'],
//       order: { id: 'DESC' }, // Opcional: ordena del más nuevo al más viejo
//     });
//   }
  

//   update(id: number, data: Partial<Order>) {
//     return this.orderRepo.update(id, data);
//   }

//   remove(id: number) {
//     return this.orderRepo.delete(id);
//   }
// }
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { OrderStatusService } from './order-status.service';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(User)
    private userRepo: Repository<User>, // Repartidor

    private readonly orderStatusService: OrderStatusService, // Para obtener estados
  ) {}

  findAll() {
    return this.orderRepo.find({
      relations: ['user', 'status', 'items', 'items.product', 'deliveryPerson'],
    });
  }

  findOne(id: number) {
    return this.orderRepo.findOne({
      where: { id },
      relations: ['user', 'status', 'items', 'items.product', 'deliveryPerson'],
    });
  }

  async createOrder(userId: number, itemsData: { productId: number; quantity: number }[]) {
    try {
      const items: OrderItem[] = [];
      let totalPrice = 0;

      for (const item of itemsData) {
        const product = await this.productRepo.findOne({ where: { id: item.productId } });
        if (!product) {
          throw new BadRequestException(`Producto con ID ${item.productId} no encontrado`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(`Stock insuficiente para el producto ${product.name}`);
        }

        product.stock -= item.quantity;
        await this.productRepo.save(product);

        const subtotal = product.price * item.quantity;
        totalPrice += subtotal;

        const orderItem = this.itemRepo.create({
          product,
          quantity: item.quantity,
          subtotal,
        });

        items.push(orderItem);
      }

      await this.itemRepo.save(items);

      const status = await this.orderStatusService.findByName('pendiente');

      const code = randomBytes(3).toString('hex'); // Código de entrega
      const order = this.orderRepo.create({
        user: { id: userId },
        deliveryPerson: { id: 3 }, // 👈 asignación automática
        status,
        totalPrice,
        items,
        deliveryCode: code,
        deliveryAddress: 'Dirección por confirmar',
      });

      return await this.orderRepo.save(order);
    } catch (error) {
      console.error('❌ Error en createOrder:', error);
      throw new BadRequestException(
        error.message || 'Ocurrió un error al procesar el pedido',
      );
    }
  }

  findByUserId(userId: number) {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'status', 'items', 'items.product'],
      order: { id: 'DESC' },
    });
  }

  update(id: number, data: Partial<Order>) {
    return this.orderRepo.update(id, data);
  }

  remove(id: number) {
    return this.orderRepo.delete(id);
  }

  // ✅ Admin asigna un repartidor
  async assignDelivery(orderId: number, deliveryPersonId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['deliveryPerson', 'status'],
    });

    if (!order) throw new NotFoundException('Pedido no encontrado');

    const repartidor = await this.userRepo.findOne({ where: { id: deliveryPersonId } });
    if (!repartidor) throw new NotFoundException('Repartidor no encontrado');

    const code = randomBytes(3).toString('hex'); // Ej: 'a9f3b1'
    const status = await this.orderStatusService.findByName('pendiente');

    order.deliveryPerson = repartidor;
    order.deliveryCode = code;
    order.status = status;

    await this.orderRepo.save(order);

    return {
      message: 'Pedido asignado exitosamente',
      deliveryCode: code,
    };
  }

  // ✅ Repartidor actualiza el estado
  async updateOrderStatus(orderId: number, repartidorId: number, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['deliveryPerson', 'status'],
    });

    if (!order) throw new NotFoundException('Pedido no encontrado');
    if (!order.deliveryPerson || order.deliveryPerson.id !== repartidorId) {
      throw new ForbiddenException('No tienes permiso para modificar este pedido');
    }

    if (dto.status === 'entregado') {
      if (!dto.deliveryCode || dto.deliveryCode !== order.deliveryCode) {
        throw new BadRequestException('Código de entrega incorrecto');
      }
    }

    const newStatus = await this.orderStatusService.findByName(dto.status);
    order.status = newStatus;

    await this.orderRepo.save(order);

    return { message: `Estado actualizado a '${dto.status}'` };
  }
}

