import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Role } from './entities/role.entity';
import { ProductStatus } from './entities/product-status.entity';
import { OrderStatus } from './entities/order-status.entity';
import { DataSource } from 'typeorm';
import { Discount } from './entities/discount.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);

  const roleRepo = dataSource.getRepository(Role);
  const productStatusRepo = dataSource.getRepository(ProductStatus);
  const orderStatusRepo = dataSource.getRepository(OrderStatus);
  const discountRepo = dataSource.getRepository(Discount);

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

  await discountRepo.save([
    { id: 1, percentage: 0.15 }, // 20%
    { id: 2, percentage: 0.2 }, // 15%
    { id: 3, percentage: 0.3 }, // 30%
    { id: 4, percentage: 0.5 }, // 50%
  ]);

  console.log('✅ Seed completado!');
  await app.close();
}

bootstrap();
