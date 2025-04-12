import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
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

  async create(data: Partial<User>) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.passwordHash, salt);

    const newUser = this.userRepo.create({
      ...data,
      passwordHash: hashedPassword,
    });

    return this.userRepo.save(newUser);
  }

  update(id: number, data: Partial<User>) {
    return this.userRepo.update(id, data);
  }

  delete(id: number) {
    return this.userRepo.delete(id);
  }
}
