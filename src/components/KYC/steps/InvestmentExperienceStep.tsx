import React, { useState } from 'react';
import { KYCData } from '../../../types';

interface InvestmentExperienceStepProps {
  onNext: (data: Partial<KYCData>) => void;
  onBack: () => void;
  data: Partial<KYCData>;
}

const InvestmentExperienceStep: React.FC<InvestmentExperienceStepProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    privateEquityExperience: data.investmentExperience?.privateEquityExperience || false,
    yearsInvesting: data.investmentExperience?.yearsInvesting || 0,
    previousInvestmentTypes: data.investmentExperience?.previousInvestmentTypes || [],
    averageInvestmentSize: data.investmentExperience?.averageInvestmentSize || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      investmentExperience: formData,
    });
  };

  const handleInvestmentTypeChange = (type: string) => {
    const types = formData.previousInvestmentTypes.includes(type)
      ? formData.previousInvestmentTypes.filter(t => t !== type)
      : [...formData.previousInvestmentTypes, type];
    setFormData({ ...formData, previousInvestmentTypes: types });
  };

  const inputStyle = "w-full p-2 border rounded";
  const labelStyle = "block mb-2 font-semibold";
  const checkboxStyle = "mr-2 form-checkbox";

  return (
    <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)' }}>
      <h2 className="text-xl font-semibold mb-4">Investment Experience</h2>
      <p style={{ color: 'var(--secondary-color)' }} className="mb-6">
        Help us understand your investment experience to better serve your needs and
        ensure suitable investment opportunities.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.privateEquityExperience}
                onChange={(e) => setFormData({ ...formData, privateEquityExperience: e.target.checked })}
                className={checkboxStyle}
                style={{ borderColor: 'var(--primary-color)' }}
              />
              <span>I have previous private equity investment experience</span>
            </label>
          </div>

          <div>
            <label className={labelStyle}>Years of Investment Experience</label>
            <select
              required
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.yearsInvesting}
              onChange={(e) => setFormData({ ...formData, yearsInvesting: parseInt(e.target.value) })}
            >
              <option value="0">No experience</option>
              <option value="1">1-2 years</option>
              <option value="3">3-5 years</option>
              <option value="6">6-10 years</option>
              <option value="10">10+ years</option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>Previous Investment Types</label>
            <div className="space-y-2">
              {['Stocks', 'Bonds', 'Real Estate', 'Private Equity', 'Venture Capital', 'Cryptocurrencies'].map((type) => (
                <label key={type} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.previousInvestmentTypes.includes(type)}
                    onChange={() => handleInvestmentTypeChange(type)}
                    className={checkboxStyle}
                    style={{ borderColor: 'var(--primary-color)' }}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelStyle}>Average Investment Size</label>
            <select
              required
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.averageInvestmentSize}
              onChange={(e) => setFormData({ ...formData, averageInvestmentSize: e.target.value })}
            >
              <option value="">Select Range</option>
              <option value="0-1000">$0 - $1,000</option>
              <option value="1001-10000">$1,001 - $10,000</option>
              <option value="10001-50000">$10,001 - $50,000</option>
              <option value="50001-100000">$50,001 - $100,000</option>
              <option value="100001+">$100,001+</option>
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

export default InvestmentExperienceStep;
