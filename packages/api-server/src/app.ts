import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Express } from 'express';

export async function createApp(): Promise<Express> {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // CORS
  app.enableCors();

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Reki API')
    .setDescription('Reki Medical Device Management System API Documentation')
    .setVersion('0.9.0')
    .addBearerAuth()
    .addTag('devices', 'Device management')
    .addTag('clients', 'Client management')
    .addTag('assessments', 'Assessment system')
    .addTag('protocols', 'Protocol management')
    .addTag('sessions', 'Session management')
    .addTag('tickets', 'Support ticket system')
    .addTag('media', 'Media management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Return Express instance for testing
  return app.getHttpAdapter().getInstance();
}
