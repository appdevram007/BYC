import { Module } from '@nestjs/common';
import { BondModule } from './bond/bond.module';

@Module({
  imports: [BondModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
