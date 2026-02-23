export type CouponFrequency = 'annual' | 'semi-annual';

export interface BondInput {
  faceValue: number;
  couponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: CouponFrequency;
}

export interface CashFlow {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface BondCalculationResult {
  currentYield: number;
  yieldToMaturity: number;
  totalInterest: number;
  premiumDiscount: 'premium' | 'discount' | 'par';
  discountAmount: number;
  cashFlows: CashFlow[];
}

export interface ValidationError {
  field: string;
  message: string;
}
