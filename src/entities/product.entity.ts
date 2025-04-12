// product.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { Category } from './category.entity';
  import { ProductStatus } from './product-status.entity';
  import { OrderItem } from './order-item.entity';
  
  @Entity('products')
  export class Product {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ type: 'text' })
    description: string;
  
    @Column('decimal', { precision: 10, scale: 2 })
    price: number;
  
    @Column()
    stock: number;
  
    @ManyToOne(() => Category, category => category.products)
    category: Category;
  
    @ManyToOne(() => ProductStatus, status => status.products)
    status: ProductStatus;
  
    @OneToMany(() => OrderItem, item => item.product)
    orderItems: OrderItem[];
  }
  