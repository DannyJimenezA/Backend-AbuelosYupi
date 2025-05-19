// order.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  import { OrderStatus } from './order-status.entity';
  import { OrderItem } from './order-item.entity';
import { OrderPromotion } from './oder-promotion.entity';
  
  @Entity('orders')
  export class Order {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, user => user.orders)
    user: User;
  
    @ManyToOne(() => OrderStatus, status => status.orders)
    status: OrderStatus;
  
    @ManyToOne(() => User, user => user.deliveries, { nullable: true })
    deliveryPerson: User;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;
  
    @Column()
    deliveryAddress: string;
  
    @OneToMany(() => OrderItem, item => item.order)
    items: OrderItem[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    deliveryCode: string;
    @OneToMany(() => OrderPromotion, op => op.order, { cascade: true })
promotions: OrderPromotion[];
  }
  