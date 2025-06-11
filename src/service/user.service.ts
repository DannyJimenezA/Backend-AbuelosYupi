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
  async create(data: Partial<User> & { password: string; roleId?: number }) {
  const existing = await this.userRepo.findOne({ where: { email: data.email } });
  if (existing) throw new Error('Este correo ya está registrado');

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const roleId = data.roleId ?? 2; // 👈 Usa roleId plano, no data.role?.id
  const role = await this.roleRepo.findOneBy({ id: roleId });
  if (!role) throw new Error(`Rol con ID ${roleId} no encontrado`);

  const { password, roleId: _, ...rest } = data;

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




  async findByRole(roleId: number) {
  return this.userRepo.find({
    where: { role: { id: roleId } },
    relations: ['role'],
  });
}

}



