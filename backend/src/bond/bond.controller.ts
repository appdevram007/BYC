import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { BondService } from './bond.service';
import { CalculateBondDto } from './dto/calculate-bond.dto';
import { BondCalculationResult } from './interfaces/bond-result.interface';

@Controller('api/bond')
export class BondController {
  constructor(private readonly bondService: BondService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true,
    forbidNonWhitelisted: true 
  }))
  calculate(@Body() calculateBondDto: CalculateBondDto): BondCalculationResult {
    return this.bondService.calculate(calculateBondDto);
  }
}
