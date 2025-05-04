import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  findAll() {
    return this.userRepo.find({ relations: ['role'] });
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id }, relations: ['role'] });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email }, relations: ['role'] });
  }

  // async create(data: Partial<User>) {
  //   const salt = await bcrypt.genSalt();
  //   const hashedPassword = await bcrypt.hash(data.passwordHash, salt);

  //   const role = await this.roleRepo.findOneBy({ id: 2 }); 

  //   const newUser = this.userRepo.create({
  //     ...data,
  //     passwordHash: hashedPassword,
  //     role,
  //   });

  //   const saved = await this.userRepo.save(newUser);

  //   // ✅ Devuelve con relación de rol para Flutter
  //   return this.userRepo.findOne({
  //     where: { id: saved.id },
  //     relations: ['role'],
  //   });

  // }
  // async create(data: Partial<User> & { password: string }) {
  //   const existing = await this.userRepo.findOne({ where: { email: data.email } });
  //   if (existing) throw new Error('Este correo ya está registrado');
  
  //   const salt = await bcrypt.genSalt();
  //   const hashedPassword = await bcrypt.hash(data.password, salt);
  
  //   const role = await this.roleRepo.findOneBy({ id: 2 });
  
  //   const { password, ...rest } = data;
  
  //   const newUser = this.userRepo.create({
  //     ...rest,
  //     passwordHash: hashedPassword,
  //     role,
  //   });
  
  //   const saved = await this.userRepo.save(newUser);
  
  //   return this.userRepo.findOne({
  //     where: { id: saved.id },
  //     relations: ['role'],
  //   });
  // }
  async create(data: Partial<User> & { password: string; role?: { id: number } }) {
    const existing = await this.userRepo.findOne({ where: { email: data.email } });
    if (existing) throw new Error('Este correo ya está registrado');
  
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
  
    // Si se pasa un rol, úsalo; si no, asigna el id = 2
    const roleId = data.role?.id ?? 2;
    const role = await this.roleRepo.findOneBy({ id: roleId });
    if (!role) throw new Error(`Rol con ID ${roleId} no encontrado`);
  
    const { password, role: _, ...rest } = data;
  
    const newUser = this.userRepo.create({
      ...rest,
      passwordHash: hashedPassword,
      role,
    });
  
    const saved = await this.userRepo.save(newUser);
  
    return this.userRepo.findOne({
      where: { id: saved.id },
      relations: ['role'],
    });
  }
  
  

  update(id: number, data: Partial<User>) {
    return this.userRepo.update(id, data);
  }

  delete(id: number) {
    return this.userRepo.delete(id);
  }
}
