import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../service/user.service';
import { UserController } from '../controller/user.controller';
import { Role } from '../entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
