import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Promotion } from './promotion.entity';

@Entity()
export class OrderPromotion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.promotions, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Promotion)
  promotion: Promotion;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}


