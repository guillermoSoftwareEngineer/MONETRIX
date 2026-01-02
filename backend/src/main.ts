import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Habilitar CORS para el frontend
  await app.setGlobalPrefix('api'); // Prefijo global
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
