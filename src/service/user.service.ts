import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

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

  create(data: Partial<User>) {
    return this.userRepo.save(data);
  }

  update(id: number, data: Partial<User>) {
    return this.userRepo.update(id, data);
  }

  delete(id: number) {
    return this.userRepo.delete(id);
  }
}
