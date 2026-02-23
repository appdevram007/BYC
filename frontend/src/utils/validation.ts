import { BondInput, ValidationError } from '../types/bond.types';

/**
 * Client-side validation for bond inputs
 * Provides immediate feedback before sending to backend
 */
export const validateBondInput = (input: Partial<BondInput>): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Face Value validation
  if (input.faceValue === undefined || input.faceValue === null) {
    errors.push({ field: 'faceValue', message: 'Face value is required' });
  } else if (input.faceValue <= 0) {
    errors.push({ field: 'faceValue', message: 'Face value must be positive' });
  }

  // Coupon Rate validation
  if (input.couponRate === undefined || input.couponRate === null) {
    errors.push({ field: 'couponRate', message: 'Coupon rate is required' });
  } else if (input.couponRate < 0) {
    errors.push({ field: 'couponRate', message: 'Coupon rate cannot be negative' });
  } else if (input.couponRate > 100) {
    errors.push({ field: 'couponRate', message: 'Coupon rate cannot exceed 100%' });
  }

  // Market Price validation
  if (input.marketPrice === undefined || input.marketPrice === null) {
    errors.push({ field: 'marketPrice', message: 'Market price is required' });
  } else if (input.marketPrice <= 0) {
    errors.push({ field: 'marketPrice', message: 'Market price must be positive' });
  }

  // Years to Maturity validation
  if (input.yearsToMaturity === undefined || input.yearsToMaturity === null) {
    errors.push({ field: 'yearsToMaturity', message: 'Years to maturity is required' });
  } else if (input.yearsToMaturity <= 0) {
    errors.push({ field: 'yearsToMaturity', message: 'Years to maturity must be positive' });
  } else if (input.yearsToMaturity > 100) {
    errors.push({ field: 'yearsToMaturity', message: 'Years to maturity cannot exceed 100' });
  }

  // Coupon Frequency validation
  if (!input.couponFrequency) {
    errors.push({ field: 'couponFrequency', message: 'Coupon frequency is required' });
  }

  return errors;
};

/**
 * Format currency values
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

/**
 * Format date strings
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};
