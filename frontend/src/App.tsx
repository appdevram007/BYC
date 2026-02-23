import React, { useState } from 'react';
import BondInputForm from './components/BondInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import CashFlowTable from './components/CashFlowTable';
import ErrorDisplay from './components/ErrorDisplay';
import { BondInput, BondCalculationResult } from './types/bond.types';
import { calculateBond, ApiError } from './services/api.service';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BondCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (input: BondInput) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const calculationResults = await calculateBond(input);
      setResults(calculationResults);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <div className="container">
      <header style={headerStyle}>
        <h1>Bond Yield Calculator</h1>
        <p style={subtitleStyle}>
          Professional fixed-income analysis tool for calculating yields and cash flows
        </p>
      </header>

      <main>
        <BondInputForm onSubmit={handleCalculate} loading={loading} />

        {error && (
          <ErrorDisplay message={error} onDismiss={handleDismissError} />
        )}

        {results && (
          <>
            <ResultsDisplay results={results} />
            <CashFlowTable cashFlows={results.cashFlows} />
          </>
        )}

        {!results && !error && !loading && (
          <div style={emptyStateStyle}>
            <div style={emptyStateIconStyle}>📊</div>
            <h3 style={emptyStateTitleStyle}>Ready to Calculate</h3>
            <p style={emptyStateTextStyle}>
              Enter bond parameters above to calculate yields and view detailed cash flow schedules
            </p>
          </div>
        )}
      </main>

      <footer style={footerStyle}>
        <p>
          Built with React, NestJS, and TypeScript • 
          Calculations use Newton-Raphson method for YTM approximation
        </p>
      </footer>
    </div>
  );
}

// Inline styles for header and footer (to avoid creating separate files)
const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: 'var(--spacing-2xl)',
  padding: 'var(--spacing-xl) 0',
  borderBottom: '3px solid var(--color-accent)',
};

const subtitleStyle: React.CSSProperties = {
  color: 'var(--color-text-muted)',
  fontSize: '1.1rem',
  marginTop: 'var(--spacing-sm)',
  fontWeight: 400,
};

const emptyStateStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: 'var(--spacing-2xl) var(--spacing-lg)',
  marginTop: 'var(--spacing-2xl)',
  background: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius-lg)',
  border: '2px dashed var(--color-border)',
};

const emptyStateIconStyle: React.CSSProperties = {
  fontSize: '3rem',
  marginBottom: 'var(--spacing-md)',
  opacity: 0.5,
};

const emptyStateTitleStyle: React.CSSProperties = {
  color: 'var(--color-text-secondary)',
  marginBottom: 'var(--spacing-sm)',
};

const emptyStateTextStyle: React.CSSProperties = {
  color: 'var(--color-text-muted)',
  maxWidth: '500px',
  margin: '0 auto',
  lineHeight: '1.6',
};

const footerStyle: React.CSSProperties = {
  marginTop: 'var(--spacing-2xl)',
  paddingTop: 'var(--spacing-xl)',
  borderTop: '1px solid var(--color-border)',
  textAlign: 'center',
  color: 'var(--color-text-muted)',
  fontSize: '0.9rem',
  lineHeight: '1.6',
};

export default App;
