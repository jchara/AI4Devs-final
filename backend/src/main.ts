import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { webcrypto } from 'crypto';

// Polyfill para crypto en entornos que no lo tienen disponible globalmente
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: false,
    configurable: true,
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('DevTracker API')
    .setDescription('API para el sistema de seguimiento de desarrollos')
    .setVersion('1.0')
    .addTag('users', 'Gestión de usuarios del sistema')
    .addTag('developments', 'Gestión de desarrollos')
    .addTag('environments', 'Gestión de ambientes')
    .addTag('microservices', 'Gestión de microservicios')
    .addTag('activities', 'Actividades recientes del sistema')
    .addTag('deployments', 'Próximos despliegues')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 DevTracker API running on ${process.env.HOST}:${port}`);
  console.log(`📚 Swagger docs available at: ${process.env.HOST}:${port}/api/docs`);
}

bootstrap();
