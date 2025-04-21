import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Role } from './entities/role.entity';
import { ProductStatus } from './entities/product-status.entity';
import { OrderStatus } from './entities/order-status.entity';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);

  const roleRepo = dataSource.getRepository(Role);
  const productStatusRepo = dataSource.getRepository(ProductStatus);
  const orderStatusRepo = dataSource.getRepository(OrderStatus);

  console.log('🌱 Iniciando seeding...');

  await roleRepo.save([
    { id: 1, name: 'admin' },
    { id: 2, name: 'customer' },
    { id: 3, name: 'delivery' },
  ]);

  await productStatusRepo.save([
    { id: 1, name: 'activo' },
    { id: 2, name: 'agotado' },
    { id: 3, name: 'descontinuado' },
  ]);

  await orderStatusRepo.save([
    { id: 1, name: 'pendiente' },
    { id: 2, name: 'preparando' },
    { id: 3, name: 'en camino' },
    { id: 4, name: 'entregado' },
    { id: 5, name: 'cancelado' },
  ]);

  console.log('✅ Seed completado!');
  await app.close();
}

bootstrap();
