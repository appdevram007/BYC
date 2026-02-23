import React from 'react';
import { CashFlow } from '../types/bond.types';
import { formatCurrency, formatDate } from '../utils/validation';
import styles from './CashFlowTable.module.css';

interface CashFlowTableProps {
  cashFlows: CashFlow[];
}

const CashFlowTable: React.FC<CashFlowTableProps> = ({ cashFlows }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Cash Flow Schedule</h2>
        <p className={styles.subtitle}>
          Detailed payment schedule showing {cashFlows.length} periods
        </p>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Period</th>
              <th>Payment Date</th>
              <th>Coupon Payment</th>
              <th>Cumulative Interest</th>
              <th>Remaining Principal</th>
            </tr>
          </thead>
          <tbody>
            {cashFlows.map((cashFlow, index) => (
              <tr 
                key={cashFlow.period}
                className={index === cashFlows.length - 1 ? styles.lastRow : ''}
              >
                <td className={styles.periodCell}>{cashFlow.period}</td>
                <td>{formatDate(cashFlow.paymentDate)}</td>
                <td className={styles.currencyCell}>
                  {formatCurrency(cashFlow.couponPayment)}
                </td>
                <td className={styles.currencyCell}>
                  {formatCurrency(cashFlow.cumulativeInterest)}
                </td>
                <td className={styles.currencyCell}>
                  {cashFlow.remainingPrincipal === 0 ? (
                    <span className={styles.matured}>Matured</span>
                  ) : (
                    formatCurrency(cashFlow.remainingPrincipal)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={styles.totalRow}>
              <td colSpan={2}>
                <strong>Total Interest Paid</strong>
              </td>
              <td className={styles.currencyCell}>
                <strong>
                  {formatCurrency(
                    cashFlows[cashFlows.length - 1].cumulativeInterest
                  )}
                </strong>
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className={styles.notes}>
        <h3>Notes</h3>
        <ul>
          <li>
            <strong>Coupon Payment:</strong> The fixed interest payment made to bondholders each period
          </li>
          <li>
            <strong>Cumulative Interest:</strong> Total interest received from bond inception to this period
          </li>
          <li>
            <strong>Remaining Principal:</strong> Face value returned at maturity (final period)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CashFlowTable;
