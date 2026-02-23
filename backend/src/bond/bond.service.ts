import { Injectable } from '@nestjs/common';
import { addMonths, addYears, format } from 'date-fns';
import { CalculateBondDto, CouponFrequency } from './dto/calculate-bond.dto';
import { 
  BondCalculationResult, 
  CashFlow 
} from './interfaces/bond-result.interface';

@Injectable()
export class BondService {
  /**
   * Main calculation method that orchestrates all bond calculations
   */
  calculate(dto: CalculateBondDto): BondCalculationResult {
    const paymentsPerYear = this.getPaymentsPerYear(dto.couponFrequency);
    const totalPeriods = dto.yearsToMaturity * paymentsPerYear;
    const couponPayment = this.calculateCouponPayment(
      dto.faceValue,
      dto.couponRate,
      paymentsPerYear
    );

    const currentYield = this.calculateCurrentYield(
      dto.couponRate,
      dto.faceValue,
      dto.marketPrice
    );

    const yieldToMaturity = this.calculateYTM(
      dto.faceValue,
      dto.marketPrice,
      couponPayment,
      totalPeriods,
      paymentsPerYear
    );

    const totalInterest = this.calculateTotalInterest(
      dto.faceValue,
      dto.couponRate,
      dto.yearsToMaturity
    );

    const { premiumDiscount, discountAmount } = this.determinePremiumDiscount(
      dto.faceValue,
      dto.marketPrice
    );

    const cashFlows = this.generateCashFlows(
      dto.faceValue,
      couponPayment,
      totalPeriods,
      dto.couponFrequency
    );

    return {
      currentYield: this.roundToTwoDecimals(currentYield),
      yieldToMaturity: this.roundToTwoDecimals(yieldToMaturity),
      totalInterest: this.roundToTwoDecimals(totalInterest),
      premiumDiscount,
      discountAmount: this.roundToTwoDecimals(Math.abs(discountAmount)),
      cashFlows,
    };
  }

  /**
   * Calculate current yield: (Annual Coupon Payment / Market Price) * 100
   */
  private calculateCurrentYield(
    couponRate: number,
    faceValue: number,
    marketPrice: number
  ): number {
    const annualCouponPayment = (couponRate / 100) * faceValue;
    return (annualCouponPayment / marketPrice) * 100;
  }

  /**
   * Calculate Yield to Maturity using Newton-Raphson method
   * This iteratively solves for YTM in the bond pricing formula:
   * Market Price = Σ[C/(1+YTM)^t] + FV/(1+YTM)^n
   */
  private calculateYTM(
    faceValue: number,
    marketPrice: number,
    couponPayment: number,
    totalPeriods: number,
    paymentsPerYear: number
  ): number {
    // Initial guess for YTM (approximate formula)
    let ytm = (
      (couponPayment * paymentsPerYear + (faceValue - marketPrice) / totalPeriods * paymentsPerYear) /
      ((faceValue + marketPrice) / 2)
    );

    const tolerance = 0.00001;
    const maxIterations = 100;
    let iteration = 0;

    while (iteration < maxIterations) {
      const ytmPerPeriod = ytm / paymentsPerYear;
      
      // Calculate bond price with current YTM guess
      let price = 0;
      let priceDerivative = 0;

      for (let t = 1; t <= totalPeriods; t++) {
        const discountFactor = Math.pow(1 + ytmPerPeriod, t);
        price += couponPayment / discountFactor;
        priceDerivative -= (t * couponPayment) / (discountFactor * (1 + ytmPerPeriod));
      }

      // Add face value at maturity
      const finalDiscountFactor = Math.pow(1 + ytmPerPeriod, totalPeriods);
      price += faceValue / finalDiscountFactor;
      priceDerivative -= (totalPeriods * faceValue) / (finalDiscountFactor * (1 + ytmPerPeriod));

      // Adjust derivative for annual YTM
      priceDerivative = priceDerivative / paymentsPerYear;

      const priceDifference = price - marketPrice;

      if (Math.abs(priceDifference) < tolerance) {
        break;
      }

      // Newton-Raphson update
      ytm = ytm - priceDifference / priceDerivative;
      iteration++;
    }

    return ytm * 100; // Convert to percentage
  }

  /**
   * Calculate total interest earned over the life of the bond
   */
  private calculateTotalInterest(
    faceValue: number,
    couponRate: number,
    yearsToMaturity: number
  ): number {
    return (couponRate / 100) * faceValue * yearsToMaturity;
  }

  /**
   * Determine if bond is trading at premium, discount, or par
   */
  private determinePremiumDiscount(
    faceValue: number,
    marketPrice: number
  ): { premiumDiscount: 'premium' | 'discount' | 'par'; discountAmount: number } {
    const difference = marketPrice - faceValue;
    const tolerance = 0.01; // Consider par if within 1 cent

    if (Math.abs(difference) < tolerance) {
      return { premiumDiscount: 'par', discountAmount: 0 };
    } else if (difference > 0) {
      return { premiumDiscount: 'premium', discountAmount: difference };
    } else {
      return { premiumDiscount: 'discount', discountAmount: difference };
    }
  }

  /**
   * Generate complete cash flow schedule
   */
  private generateCashFlows(
    faceValue: number,
    couponPayment: number,
    totalPeriods: number,
    couponFrequency: CouponFrequency
  ): CashFlow[] {
    const cashFlows: CashFlow[] = [];
    const startDate = new Date();
    const monthsPerPeriod = couponFrequency === CouponFrequency.ANNUAL ? 12 : 6;

    let cumulativeInterest = 0;

    for (let period = 1; period <= totalPeriods; period++) {
      const paymentDate = this.calculatePaymentDate(
        startDate,
        period,
        monthsPerPeriod
      );

      cumulativeInterest += couponPayment;

      // On the last period, principal is returned
      const isLastPeriod = period === totalPeriods;
      const remainingPrincipal = isLastPeriod ? 0 : faceValue;

      cashFlows.push({
        period,
        paymentDate: format(paymentDate, 'yyyy-MM-dd'),
        couponPayment: this.roundToTwoDecimals(couponPayment),
        cumulativeInterest: this.roundToTwoDecimals(cumulativeInterest),
        remainingPrincipal: this.roundToTwoDecimals(remainingPrincipal),
      });
    }

    return cashFlows;
  }

  /**
   * Calculate periodic coupon payment
   */
  private calculateCouponPayment(
    faceValue: number,
    couponRate: number,
    paymentsPerYear: number
  ): number {
    return (faceValue * (couponRate / 100)) / paymentsPerYear;
  }

  /**
   * Get number of payments per year based on frequency
   */
  private getPaymentsPerYear(frequency: CouponFrequency): number {
    return frequency === CouponFrequency.ANNUAL ? 1 : 2;
  }

  /**
   * Calculate payment date for a given period
   */
  private calculatePaymentDate(
    startDate: Date,
    period: number,
    monthsPerPeriod: number
  ): Date {
    return addMonths(startDate, period * monthsPerPeriod);
  }

  /**
   * Round numbers to 2 decimal places for financial display
   */
  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
