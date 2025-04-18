
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.orderRepo.find({
      relations: ['user', 'status', 'items', 'items.product'],
    });
  }

  findOne(id: number) {
    return this.orderRepo.findOne({
      where: { id },
      relations: ['user', 'status', 'items', 'items.product'],
    });
  }

  // async createOrder(
  //   userId: number,
  //   itemsData: { productId: number; quantity: number; subtotal?: number }[],
  // ) {
  //   const items: OrderItem[] = [];
  
  //   // Crear y validar OrderItems
  //   for (const item of itemsData) {
  //     const product = await this.productRepo.findOne({ where: { id: item.productId } });
  //     if (!product) continue;
  
  //     const quantity = item.quantity;
  //     const subtotal = product.price * quantity;
  
  //     const orderItem = this.itemRepo.create({
  //       product: { id: item.productId },
  //       quantity,
  //       subtotal, // 👈 garantizado que se setea correctamente
  //     });
  
  //     items.push(orderItem);
  //   }
  
  //   await this.itemRepo.save(items);
  
  //   const totalPrice = items.reduce((acc, i) => acc + i.subtotal, 0);
  
  //   const newOrder = this.orderRepo.create({
  //     user: { id: userId },
  //     totalPrice,
  //     status: { id: 1 },
  //     items,
  //     deliveryAddress: 'Dirección por confirmar',
  //   });
  
  //   return this.orderRepo.save(newOrder);
  // }
  
  async createOrder(userId: number, itemsData: { productId: number; quantity: number }[]) {
    const items: OrderItem[] = [];
    let totalPrice = 0;
  
    for (const item of itemsData) {
      const product = await this.productRepo.findOne({ where: { id: item.productId } });
      if (!product) {
        throw new Error(`Producto con ID ${item.productId} no encontrado`);
      }
  
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para el producto ${product.name}`);
      }
  
      // Descontar stock
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
  
    // Primero guardamos los items
    await this.itemRepo.save(items);
  
    // Ahora guardamos la orden
    const order = this.orderRepo.create({
      user: { id: userId },
      status: { id: 1 }, // Estado inicial
      totalPrice,
      items,
      deliveryAddress: 'Dirección por confirmar',
    });
  
    return this.orderRepo.save(order);
  }
  
  findByUserId(userId: number) {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'status', 'items', 'items.product'],
      order: { id: 'DESC' }, // Opcional: ordena del más nuevo al más viejo
    });
  }
  

  update(id: number, data: Partial<Order>) {
    return this.orderRepo.update(id, data);
  }

  remove(id: number) {
    return this.orderRepo.delete(id);
  }
}
