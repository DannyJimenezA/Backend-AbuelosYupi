// role.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private repo: Repository<Role>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  create(data: Partial<Role>) {
    return this.repo.save(data);
  }
}
