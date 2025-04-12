// user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { Role } from './role.entity';
  import { Order } from './order.entity';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    passwordHash: string;
  
    @Column({ nullable: true })
    phone: string;
  
    @Column({ nullable: true })
    address: string;
  
    @ManyToOne(() => Role, role => role.users)
    role: Role;
  
    @OneToMany(() => Order, order => order.user)
    orders: Order[];
  
    @OneToMany(() => Order, order => order.deliveryPerson)
    deliveries: Order[];
  }
  