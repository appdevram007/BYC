import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'byc-backend',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('live')
  @HttpCode(HttpStatus.OK)
  liveness() {
    return { status: 'alive' };
  }

  @Get('ready')
  @HttpCode(HttpStatus.OK)
  readiness() {
    // Add any dependency checks here (database, external services, etc.)
    return { 
      status: 'ready',
      checks: {
        database: 'connected', // You can add actual DB check here
      }
    };
  }
}