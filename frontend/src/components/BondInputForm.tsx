import React, { useState, ChangeEvent, FormEvent } from 'react';
import { BondInput } from '../types/bond.types';
import { validateBondInput } from '../utils/validation';
import styles from './BondInputForm.module.css';

interface BondInputFormProps {
  onSubmit: (input: BondInput) => void;
  loading: boolean;
}

const BondInputForm: React.FC<BondInputFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<Partial<BondInput>>({
    faceValue: 1000,
    couponRate: 5,
    marketPrice: 950,
    yearsToMaturity: 10,
    couponFrequency: 'semi-annual',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Keep value as string while typing to allow -0.09 etc.
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'couponFrequency' ? value : value, // keep raw string
    }));

    // Clear error while typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    const numericValue = parseFloat(formData[name] as string);

    // Custom validation for faceValue
    if (name === 'faceValue' && (!numericValue || numericValue <= 0)) {
      setErrors(prev => ({ ...prev, faceValue: 'Face Value must be greater than 0' }));
      return;
    }

    // Validate other fields
    const validationErrors = validateBondInput({
      ...formData,
      [name]: numericValue,
    });
    const fieldError = validationErrors.find(err => err.field === name);
    if (fieldError) {
      setErrors(prev => ({ ...prev, [name]: fieldError.message }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const allFields = ['faceValue', 'couponRate', 'marketPrice', 'yearsToMaturity', 'couponFrequency'];
    setTouched(Object.fromEntries(allFields.map(field => [field, true])));

    // Convert numeric fields before validating
    const preparedData = {
      ...formData,
      faceValue: parseFloat(formData.faceValue as string),
      couponRate: parseFloat(formData.couponRate as string),
      marketPrice: parseFloat(formData.marketPrice as string),
      yearsToMaturity: parseFloat(formData.yearsToMaturity as string),
    };

    const validationErrors = validateBondInput(preparedData);

    // Ensure Face Value > 0
    if (!preparedData.faceValue || preparedData.faceValue <= 0) {
      validationErrors.push({ field: 'faceValue', message: 'Face Value must be greater than 0' });
    }

    if (validationErrors.length > 0) {
      const errorMap = Object.fromEntries(validationErrors.map(err => [err.field, err.message]));
      setErrors(errorMap);
      return;
    }

    onSubmit(preparedData as BondInput);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h2>Bond Parameters</h2>
        <p className={styles.formSubtitle}>Enter bond details to calculate yields</p>
      </div>

      <div className={styles.formGrid}>
        {/* Face Value */}
        <div className={styles.formGroup}>
          <label htmlFor="faceValue" className={styles.label}>
            Face Value <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputPrefix}>AED</span>
            <input
              type="number"
              id="faceValue"
              name="faceValue"
              value={formData.faceValue}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${errors.faceValue && touched.faceValue ? styles.inputError : ''}`}
              step="0.01"
              min={0.01}

              placeholder="1000.00"
            />
          </div>
          {errors.faceValue && touched.faceValue && (
            <span className={styles.errorMessage}>{errors.faceValue}</span>
          )}
        </div>

        {/* Coupon Rate */}
        <div className={styles.formGroup}>
          <label htmlFor="couponRate" className={styles.label}>
            Annual Coupon Rate <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              id="couponRate"
              name="couponRate"
              value={formData.couponRate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${errors.couponRate && touched.couponRate ? styles.inputError : ''}`}
              step="0.01"
              placeholder="5.00"
            />
            <span className={styles.inputSuffix}>%</span>
          </div>
          {errors.couponRate && touched.couponRate && (
            <span className={styles.errorMessage}>{errors.couponRate}</span>
          )}
        </div>

        {/* Market Price */}
        <div className={styles.formGroup}>
          <label htmlFor="marketPrice" className={styles.label}>
            Market Price <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputPrefix}>AED</span>
            <input
              type="number"
              id="marketPrice"
              name="marketPrice"
              value={formData.marketPrice}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${errors.marketPrice && touched.marketPrice ? styles.inputError : ''}`}
              step="0.01"
              placeholder="950.00"
            />
          </div>
          {errors.marketPrice && touched.marketPrice && (
            <span className={styles.errorMessage}>{errors.marketPrice}</span>
          )}
        </div>

        {/* Years to Maturity */}
        <div className={styles.formGroup}>
          <label htmlFor="yearsToMaturity" className={styles.label}>
            Years to Maturity <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="yearsToMaturity"
            name="yearsToMaturity"
            value={formData.yearsToMaturity}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.input} ${errors.yearsToMaturity && touched.yearsToMaturity ? styles.inputError : ''}`}
            step="0.5"
            placeholder="10"
          />
          {errors.yearsToMaturity && touched.yearsToMaturity && (
            <span className={styles.errorMessage}>{errors.yearsToMaturity}</span>
          )}
        </div>

        {/* Coupon Frequency */}
        <div className={styles.formGroup}>
          <label htmlFor="couponFrequency" className={styles.label}>
            Coupon Frequency <span className={styles.required}>*</span>
          </label>
          <select
            id="couponFrequency"
            name="couponFrequency"
            value={formData.couponFrequency}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="annual">Annual</option>
            <option value="semi-annual">Semi-Annual</option>
          </select>
        </div>
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? (
          <>
            <span className={styles.spinner}></span> Calculating...
          </>
        ) : (
          'Calculate Yields'
        )}
      </button>
    </form>
  );
};

export default BondInputForm;