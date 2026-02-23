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
