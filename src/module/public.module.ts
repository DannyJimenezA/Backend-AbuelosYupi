import { Module } from '@nestjs/common';
import { PublicController } from '../controller/public.controller';

@Module({
  controllers: [PublicController],
})
export class PublicModule {}
