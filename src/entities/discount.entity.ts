// discount.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('discounts')
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 3, scale: 2 })
  percentage: number; // ej. 0.15 = 15%

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @OneToMany(() => Product, product => product.discount)
  products: Product[];
}
