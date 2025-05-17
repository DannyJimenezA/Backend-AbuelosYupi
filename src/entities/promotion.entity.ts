import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ['combo', 'discount'] })
  type: 'combo' | 'discount';

  @Column({ type: 'float', nullable: true })
  discountPercentage?: number; // solo si es descuento

  @Column({ type: 'decimal', nullable: true })
  comboPrice?: number; // solo si es combo

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}