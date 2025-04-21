import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  console.log('📦 Connecting to:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    db: process.env.DB_NAME,
  });
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  //   prefix: '/uploads',
  // });

  

  app.enableCors({
    origin: '*',
  });

  await app.listen(3000);
}
bootstrap();
