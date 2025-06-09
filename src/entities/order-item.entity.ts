// // order-item.entity.ts
// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     ManyToOne,
//   } from 'typeorm';
//   import { Order } from './order.entity';
//   import { Product } from './product.entity';
  
//   @Entity('order_items')
//   export class OrderItem {
//     @PrimaryGeneratedColumn()
//     id: number;
  
//     @ManyToOne(() => Order, order => order.items)
//     order: Order;
  
//     @ManyToOne(() => Product, product => product.orderItems)
//     product: Product;
  
//     @Column()
//     quantity: number;
  
//     // @Column('decimal', { precision: 10, scale: 2 })
//     // priceAtPurchase: number;
//     @Column({type:'decimal',  precision: 10, scale: 2, nullable: false })
//     subtotal: number;
//   }
  
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Promotion } from './promotion.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;
  @ManyToOne(() => Promotion, { eager: true, nullable: true })  // Relación con Promotion
  promotion: Promotion;
}
