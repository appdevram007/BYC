import { Module } from '@nestjs/common';
import { BondModule } from './bond/bond.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [BondModule],
  controllers: [HealthController], 
  providers: [],
})
export class AppModule {}