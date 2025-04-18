// // product.entity.ts
// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   OneToMany,
// } from 'typeorm';
// import { Category } from './category.entity';
// import { ProductStatus } from './product-status.entity';
// import { OrderItem } from './order-item.entity';

// @Entity('products')
// export class Product {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column('decimal', { precision: 10, scale: 2 })
//   price: number;

//   @Column()
//   stock: number;

//   @Column({ nullable: true })
//   imageUrl: string;

//   @ManyToOne(() => Category, category => category.products)
//   category: Category;

//   @ManyToOne(() => ProductStatus, status => status.products)
//   status: ProductStatus;

//   @OneToMany(() => OrderItem, item => item.product)
//   orderItems: OrderItem[];
// }

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
import { Discount } from './discount.entity';

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

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @ManyToOne(() => ProductStatus, status => status.products)
  status: ProductStatus;

  @OneToMany(() => OrderItem, item => item.product)
  orderItems: OrderItem[];

//   @ManyToOne(() => Discount, discount => discount.products, { nullable: true })
// discount: Discount;
@ManyToOne(() => Discount, { nullable: true })
discount: Discount;

  // 💡 Getter virtual para obtener el precio con descuento aplicado
  get finalPrice(): number {
    return this.price * (1 - Number(this.discount));
  }
}
