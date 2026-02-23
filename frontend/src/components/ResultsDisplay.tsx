import React from 'react';
import { BondCalculationResult } from '../types/bond.types';
import { formatCurrency, formatPercentage } from '../utils/validation';
import styles from './ResultsDisplay.module.css';

interface ResultsDisplayProps {
  results: BondCalculationResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const getPremiumDiscountText = () => {
    switch (results.premiumDiscount) {
      case 'premium':
        return `Premium (${formatCurrency(results.discountAmount)} above par)`;
      case 'discount':
        return `Discount (${formatCurrency(results.discountAmount)} below par)`;
      case 'par':
        return 'At Par Value';
    }
  };

  const getPremiumDiscountClass = () => {
    switch (results.premiumDiscount) {
      case 'premium':
        return styles.premium;
      case 'discount':
        return styles.discount;
      default:
        return styles.par;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Calculation Results</h2>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Current Yield</div>
          <div className={styles.metricValue}>
            {formatPercentage(results.currentYield)}
          </div>
          <div className={styles.metricDescription}>
            Annual coupon payment relative to market price
          </div>
        </div>

        <div className={`${styles.metricCard} ${styles.metricCardHighlight}`}>
          <div className={styles.metricLabel}>Yield to Maturity</div>
          <div className={styles.metricValue}>
            {formatPercentage(results.yieldToMaturity)}
          </div>
          <div className={styles.metricDescription}>
            Total return if held to maturity
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Interest</div>
          <div className={styles.metricValue}>
            {formatCurrency(results.totalInterest)}
          </div>
          <div className={styles.metricDescription}>
            Total coupon payments over life of bond
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Bond Status</div>
          <div className={`${styles.metricValue} ${getPremiumDiscountClass()}`}>
            {results.premiumDiscount.charAt(0).toUpperCase() + results.premiumDiscount.slice(1)}
          </div>
          <div className={styles.metricDescription}>
            {getPremiumDiscountText()}
          </div>
        </div>
      </div>

      <div className={styles.interpretation}>
        <h3>Interpretation</h3>
        <div className={styles.interpretationContent}>
          {results.premiumDiscount === 'discount' ? (
            <p>
              This bond is trading at a <strong>discount</strong> ({formatCurrency(results.discountAmount)} below face value). 
              The YTM of {formatPercentage(results.yieldToMaturity)} is higher than the current yield 
              of {formatPercentage(results.currentYield)}, indicating potential capital gains at maturity.
            </p>
          ) : results.premiumDiscount === 'premium' ? (
            <p>
              This bond is trading at a <strong>premium</strong> ({formatCurrency(results.discountAmount)} above face value). 
              The YTM of {formatPercentage(results.yieldToMaturity)} is lower than the current yield 
              of {formatPercentage(results.currentYield)}, indicating a capital loss at maturity offset by higher coupon payments.
            </p>
          ) : (
            <p>
              This bond is trading <strong>at par</strong>. The YTM and current yield are approximately equal, 
              indicating the market price reflects the coupon rate accurately.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
