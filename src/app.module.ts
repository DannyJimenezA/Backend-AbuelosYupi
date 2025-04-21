import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

// Importación de módulos personalizados
import { UserModule } from './module/user.module';
import { RoleModule } from './module/role.module';
import { ProductModule } from './module/product.module';
import { CategoryModule } from './module/category.module';
import { OrderModule } from './module/order.module';
import { OrderItemModule } from './module/order-item.module';
import { OrderStatusModule } from './module/order-status.module';
import { ProductStatusModule } from './module/product-status.module';
import { AuthController } from './controller/auth.controller';
import { PublicModule } from './module/public.module';
import { DiscountModule } from './module/discount.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    
    
    
    

    // Módulos personalizados
    UserModule,
    RoleModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    OrderItemModule,
    OrderStatusModule,
    ProductStatusModule,
    PublicModule,
    DiscountModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
