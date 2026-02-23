import React from 'react';
import styles from './ErrorDisplay.module.css';

interface ErrorDisplayProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss }) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠</div>
      <div className={styles.content}>
        <h3 className={styles.title}>Calculation Error</h3>
        <p className={styles.message}>{message}</p>
      </div>
      {onDismiss && (
        <button 
          className={styles.dismissButton}
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
