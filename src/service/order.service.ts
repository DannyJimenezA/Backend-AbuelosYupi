
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
import { OrderPromotion } from 'src/entities/oder-promotion.entity';
import { Promotion } from 'src/entities/promotion.entity';

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
    @InjectRepository(OrderPromotion)
private promoRepo: Repository<OrderPromotion>,

@InjectRepository(Promotion)
private promotionRepo: Repository<Promotion>,

    private readonly orderStatusService: OrderStatusService, // Para obtener estados
  ) {}

  findAll() {
  return this.orderRepo.find({
    relations: [
      'user',
      'status',
      'items',
      'items.product',
      'items.promotion',
      'items.promotion.products', // 👈 necesario para combos
      'deliveryPerson',
    ],
  });
}

  findOne(id: number) {
  return this.orderRepo.findOne({
    where: { id },
    relations: [
      'user',
      'status',
      'items',
      'items.product',
      'items.promotion',
      'items.promotion.products',
      'deliveryPerson',
    ],
  });
}


//  async createOrder(
//   userId: number,
//   itemsData: { productId: number; quantity: number; price: number }[],
//   combosData?: { promotionId: number; quantity: number; price: number }[],
// ) {
//   try {
//     const orderItems: OrderItem[] = [];
//     const orderPromotions: OrderPromotion[] = [];
//     let totalPrice = 0;

//     // 🟢 Guardar productos normales
//     for (const item of itemsData) {
//       const product = await this.productRepo.findOne({ where: { id: item.productId } });
//       if (!product) {
//         throw new BadRequestException(`Producto con ID ${item.productId} no encontrado`);
//       }

//       if (product.stock < item.quantity) {
//         throw new BadRequestException(`Stock insuficiente para el producto ${product.name}`);
//       }

//       product.stock -= item.quantity;
//       await this.productRepo.save(product);

//       const subtotal = item.price * item.quantity;
//       totalPrice += subtotal;

//       const orderItem = this.itemRepo.create({
//         product,
//         quantity: item.quantity,
//         subtotal,
//       });

//       orderItems.push(orderItem);
//     }

//     await this.itemRepo.save(orderItems);

//     // 🟣 Guardar combos si vienen
//     if (combosData && combosData.length > 0) {
//       for (const combo of combosData) {
//         const promo = await this.promoRepo.manager.findOne(Promotion, {
//           where: { id: combo.promotionId },
//           relations: ['products'],
//         });

//         if (!promo) {
//           throw new BadRequestException(`Promoción con ID ${combo.promotionId} no encontrada`);
//         }

//         // 🧮 Descontar stock de cada producto del combo * cantidad del combo
//         for (const prod of promo.products) {
//           if (prod.stock < combo.quantity) {
//             throw new BadRequestException(
//               `Stock insuficiente en combo: ${prod.name}`,
//             );
//           }

//           prod.stock -= combo.quantity;
//           await this.productRepo.save(prod);
//         }

//         totalPrice += combo.price;

//         const orderPromo = this.promoRepo.create({
//           promotion: { id: combo.promotionId },
//           quantity: combo.quantity,
//           price: combo.price,
//           order: null, // Se setea más abajo
//         });

//         orderPromotions.push(orderPromo);
//       }
//     }

//     // 🧾 Crear el pedido
//     const status = await this.orderStatusService.findByName('pendiente');

//     const order = this.orderRepo.create({
//       user: { id: userId },
//       status,
//       totalPrice,
//       items: orderItems,
//       deliveryAddress: 'Dirección por confirmar',
//       deliveryPerson: null,
//       deliveryCode: randomBytes(3).toString('hex'),
//     });

//     const savedOrder = await this.orderRepo.save(order);

//     // ✅ Asociar combos al pedido
//     for (const promo of orderPromotions) {
//       promo.order = savedOrder;
//       await this.promoRepo.save(promo);
//     }

//     return savedOrder;
//   } catch (error) {
//     console.error('❌ Error en createOrder:', error);
//     throw new BadRequestException(
//       error.message || 'Ocurrió un error al procesar el pedido',
//     );
//   }
// }
async createOrder(
  userId: number,
  itemsData: { productId: number; quantity: number; price: number }[],
  combosData?: { promotionId: number; quantity: number; price: number }[],
) {
  try {
    const orderItems: OrderItem[] = [];
    const orderPromotions: OrderPromotion[] = [];
    let totalPrice = 0;

    // 🟢 Procesar productos normales
    for (const item of itemsData) {
      const product = await this.productRepo.findOne({ where: { id: item.productId } });
      if (!product) throw new BadRequestException(`Producto con ID ${item.productId} no encontrado`);
      if (product.stock < item.quantity) throw new BadRequestException(`Stock insuficiente para ${product.name}`);

      product.stock -= item.quantity;
      await this.productRepo.save(product);

      const subtotal = item.price * item.quantity;
      totalPrice += subtotal;

      const orderItem = this.itemRepo.create({
        product,
        quantity: item.quantity,
        subtotal,
      });

      orderItems.push(orderItem);
    }

    await this.itemRepo.save(orderItems); // Guardar items

    // 🟣 Procesar promociones
    if (combosData && combosData.length > 0) {
      for (const combo of combosData) {
        const promo = await this.promotionRepo.findOne({
          where: { id: combo.promotionId },
          relations: ['products'],
        });
        if (!promo) throw new BadRequestException(`Promoción con ID ${combo.promotionId} no encontrada`);

        for (const prod of promo.products) {
          if (prod.stock < combo.quantity) throw new BadRequestException(`Stock insuficiente en combo: ${prod.name}`);
          prod.stock -= combo.quantity;
          await this.productRepo.save(prod);
        }

        totalPrice += combo.price;

        const orderPromo = this.promoRepo.create({
          promotion: { id: combo.promotionId },
          quantity: combo.quantity,
          price: combo.price,
          order: null, // lo asocias luego
        });

        orderPromotions.push(orderPromo);
      }
    }

    // 🧾 Crear pedido
    const status = await this.orderStatusService.findByName('pendiente');
    const order = this.orderRepo.create({
      user: { id: userId },
      status,
      totalPrice,
      items: orderItems,
      deliveryAddress: 'Dirección por confirmar',
      deliveryPerson: null,
      deliveryCode: randomBytes(3).toString('hex'),
    });

    const savedOrder = await this.orderRepo.save(order);

    // ✅ Asociar promociones al pedido
    for (const promo of orderPromotions) {
      promo.order = savedOrder;
      await this.promoRepo.save(promo);
    }

    return savedOrder;
  } catch (error) {
    console.error('❌ Error en createOrder:', error);
    throw new BadRequestException(error.message || 'Ocurrió un error al procesar el pedido');
  }
}

  findByUserId(userId: number) {
  return this.orderRepo.find({
    where: { user: { id: userId } },
    relations: [
      'user',
      'status',
      'items',
      'items.product',
      'items.promotion',
      'items.promotion.products',
    ],
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
  
  // ✅ Repartidor actualiza el estado
  async updateOrderStatus(orderId: number, repartidorId: number, dto: UpdateOrderStatusDto) {
  const order = await this.orderRepo.findOne({
    where: { id: orderId },
    relations: ['deliveryPerson', 'status'],
  });

  if (!order) {
    throw new NotFoundException('Pedido no encontrado');
  }

  // ✅ Asignar repartidor si el estado es "en_camino" y aún no tiene
  if (dto.status === 'en_camino') {
    if (!order.deliveryPerson) {
      const repartidor = await this.userRepo.findOneBy({ id: repartidorId });
      if (!repartidor) {
        throw new NotFoundException('Repartidor no encontrado');
      }
      order.deliveryPerson = repartidor;
    } else if (order.deliveryPerson.id !== repartidorId) {
      throw new ForbiddenException('Este pedido ya fue tomado por otro repartidor');
    }
  } else {
    // ✅ Validar que el repartidor sea el asignado para cualquier otro estado
    if (!order.deliveryPerson || order.deliveryPerson.id !== repartidorId) {
      throw new ForbiddenException('No tienes permiso para modificar este pedido');
    }
  }

  // ✅ Validación especial si se marca como "entregado"
  if (dto.status === 'entregado') {
    if (!order.deliveryCode || dto.deliveryCode !== order.deliveryCode) {
      throw new BadRequestException('Código de entrega incorrecto');
    }
  }

  const newStatus = await this.orderStatusService.findByName(
    dto.status.replace('_', ' ')
  );

  order.status = newStatus;

  await this.orderRepo.save(order);

  return { message: `Estado actualizado a '${dto.status}'` };
}

  async findAvailableOrdersForDeliveryPerson(
  deliveryPersonId: number,
  status?: string,
): Promise<Order[]> {
  const deliveryPerson = await this.userRepo.findOne({
    where: { id: deliveryPersonId },
    relations: ['role'],
  });

  if (!deliveryPerson || deliveryPerson.role.id !== 3) {
    throw new ForbiddenException('No tienes permisos para ver pedidos disponibles');
  }

  const query = this.orderRepo
    .createQueryBuilder('order')
    .leftJoinAndSelect('order.user', 'user')
    .leftJoinAndSelect('order.status', 'status')
    .leftJoinAndSelect('order.items', 'items')
    .leftJoinAndSelect('items.product', 'product')
    .leftJoinAndSelect('order.deliveryPerson', 'deliveryPerson')
    .orderBy('order.id', 'DESC')
    .leftJoinAndSelect('items.promotion', 'promotion')
    .leftJoinAndSelect('promotion.products', 'promotionProducts');


  // Normalizamos el nombre del status por si viene como en_camino
  const statusMap: Record<string, string> = {
    en_camino: 'en camino',
    pendiente: 'pendiente',
    entregado: 'entregado',
    cancelado: 'cancelado',
    preparando: 'preparando',
  };

  const normalized = status
    ? statusMap[status.toLowerCase().trim()] || status.toLowerCase().trim()
    : null;

  // 🧠 Lógica combinada
  if (!normalized) {
    query.andWhere(
      `(status.name = :pendiente AND order.deliveryPersonId IS NULL) OR 
       (order.deliveryPersonId = :userId AND status.name IN (:...assignedStatuses))`,
      {
        pendiente: 'pendiente',
        userId: deliveryPersonId,
        assignedStatuses: ['en camino', 'entregado'],
      },
    );
  } else if (normalized === 'pendiente') {
    query.andWhere('status.name = :status AND order.deliveryPersonId IS NULL', {
      status: normalized,
    });
  } else {
    query.andWhere('status.name = :status AND order.deliveryPersonId = :userId', {
      status: normalized,
      userId: deliveryPersonId,
    });
  }

  return query.getMany();
}
  
async findOrdersByStatus(userId: number, statusName: string) {
  const user = await this.userRepo.findOne({
    where: { id: userId },
    relations: ['role'],
  });

  if (!user || user.role.id !== 3) {
    throw new ForbiddenException('No tienes permiso para ver estos pedidos');
  }

  const orders = await this.orderRepo.find({
    where: [
      {
        deliveryPerson: { id: userId },
        status: { name: statusName },
      },
    ],
    relations: ['user', 'status', 'items', 'items.product', 'deliveryPerson'],
    order: { id: 'DESC' },
  });

  return orders;
}
}

