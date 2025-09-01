import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS
  app.enableCors();

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('CUIS API')
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

  // Start server
  const port = configService.get('PORT', 3002);
  await app.listen(port);
  
  console.log(`🚀 CUIS API Server is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
