import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable shutdown hooks for graceful shutdown
  app.enableShutdownHooks();

  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://byc-1.onrender.com',
    ],
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Set global prefix for API routes (optional but recommended)
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Backend server is running on: http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`📊 Bond calculator API: http://localhost:${port}/api/bond/calculate`);
}

bootstrap();