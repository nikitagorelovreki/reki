import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppAuthServerModule } from './app-auth-server.module';

async function bootstrap() {
  const app = await NestFactory.create(AppAuthServerModule);
  
  // Получаем конфигурацию
  const configService = app.get(ConfigService);
  
  // Настройка CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    credentials: true,
  });

  // Глобальная валидация
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Префикс для API
  app.setGlobalPrefix('api');

  const port = configService.get('PORT', 3003);
  await app.listen(port);
  
  console.log(`🚀 Auth server is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
