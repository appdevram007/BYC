import { IsNumber, IsEnum, Min, Max, IsPositive } from 'class-validator';

export enum CouponFrequency {
  ANNUAL = 'annual',
  SEMI_ANNUAL = 'semi-annual',
}

export class CalculateBondDto {
  @IsNumber()
  @IsPositive({ message: 'Face value must be positive' })
  faceValue: number;

  @IsNumber()
  @Min(0, { message: 'Coupon rate cannot be negative' })
  @Max(100, { message: 'Coupon rate cannot exceed 100%' })
  couponRate: number;

  @IsNumber()
  @IsPositive({ message: 'Market price must be positive' })
  marketPrice: number;

  @IsNumber()
  @IsPositive({ message: 'Years to maturity must be positive' })
  @Max(100, { message: 'Years to maturity cannot exceed 100' })
  yearsToMaturity: number;

  @IsEnum(CouponFrequency, { 
    message: 'Coupon frequency must be either "annual" or "semi-annual"' 
  })
  couponFrequency: CouponFrequency;
}
