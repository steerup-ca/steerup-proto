import React, { useState } from 'react';
import { KYCData } from '../../../types';

interface FinancialInfoStepProps {
  onNext: (data: Partial<KYCData>) => void;
  onBack: () => void;
  data: Partial<KYCData>;
}

const FinancialInfoStep: React.FC<FinancialInfoStepProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    annualIncome: data.financialInfo?.annualIncome || '',
    sourceOfFunds: data.financialInfo?.sourceOfFunds || '',
    netWorth: data.financialInfo?.netWorth || '',
    expectedInvestmentRange: data.financialInfo?.expectedInvestmentRange || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      financialInfo: formData,
    });
  };

  const inputStyle = "w-full p-2 border rounded";
  const labelStyle = "block mb-2 font-semibold";

  return (
    <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)' }}>
      <h2 className="text-xl font-semibold mb-4">Financial Information</h2>
      <p style={{ color: 'var(--secondary-color)' }} className="mb-6">
        This information helps us understand your investment capacity and ensure compliance
        with regulatory requirements.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className={labelStyle}>Annual Income Range</label>
            <select
              required
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.annualIncome}
              onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
            >
              <option value="">Select Range</option>
              <option value="0-50000">$0 - $50,000</option>
              <option value="50001-100000">$50,001 - $100,000</option>
              <option value="100001-250000">$100,001 - $250,000</option>
              <option value="250001-500000">$250,001 - $500,000</option>
              <option value="500001+">$500,001+</option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>Source of Funds</label>
            <select
              required
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.sourceOfFunds}
              onChange={(e) => setFormData({ ...formData, sourceOfFunds: e.target.value })}
            >
              <option value="">Select Source</option>
              <option value="employment">Employment Income</option>
              <option value="business">Business Income</option>
              <option value="investments">Investment Returns</option>
              <option value="inheritance">Inheritance</option>
              <option value="savings">Savings</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>Net Worth Range</label>
            <select
              required
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.netWorth}
              onChange={(e) => setFormData({ ...formData, netWorth: e.target.value })}
            >
              <option value="">Select Range</option>
              <option value="0-100000">$0 - $100,000</option>
              <option value="100001-500000">$100,001 - $500,000</option>
              <option value="500001-1000000">$500,001 - $1,000,000</option>
              <option value="1000001-5000000">$1,000,001 - $5,000,000</option>
              <option value="5000001+">$5,000,001+</option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>Expected Investment Range</label>
            <select
              required
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.expectedInvestmentRange}
              onChange={(e) => setFormData({ ...formData, expectedInvestmentRange: e.target.value })}
            >
              <option value="">Select Range</option>
              <option value="0-10000">$0 - $10,000</option>
              <option value="10001-50000">$10,001 - $50,000</option>
              <option value="50001-100000">$50,001 - $100,000</option>
              <option value="100001-500000">$100,001 - $500,000</option>
              <option value="500001+">$500,001+</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 rounded transition-colors duration-200"
            style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--button-text-color)' }}
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded transition-colors duration-200"
            style={{ backgroundColor: 'var(--primary-color)', color: 'var(--button-text-color)' }}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default FinancialInfoStep;
