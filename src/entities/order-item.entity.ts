// order-item.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from 'typeorm';
  import { Order } from './order.entity';
  import { Product } from './product.entity';
  
  @Entity('order_items')
  export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Order, order => order.items)
    order: Order;
  
    @ManyToOne(() => Product, product => product.orderItems)
    product: Product;
  
    @Column()
    quantity: number;
  
    @Column('decimal', { precision: 10, scale: 2 })
    priceAtPurchase: number;
  }
  