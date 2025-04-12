// order-status.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_statuses')
export class OrderStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Order, order => order.status)
  orders: Order[];
}
