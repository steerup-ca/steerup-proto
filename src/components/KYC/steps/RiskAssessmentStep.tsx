import React, { useState } from 'react';
import { KYCData } from '../../../types';

interface RiskAssessmentStepProps {
  onNext: (data: Partial<KYCData>) => void;
  onBack: () => void;
  data: Partial<KYCData>;
}

const RiskAssessmentStep: React.FC<RiskAssessmentStepProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    riskTolerance: data.riskAssessment?.riskTolerance || 'moderate',
    investmentHorizon: data.riskAssessment?.investmentHorizon || '',
    investmentObjectives: data.riskAssessment?.investmentObjectives || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      riskAssessment: formData,
    });
  };

  const handleObjectiveChange = (objective: string) => {
    const objectives = formData.investmentObjectives.includes(objective)
      ? formData.investmentObjectives.filter(o => o !== objective)
      : [...formData.investmentObjectives, objective];
    setFormData({ ...formData, investmentObjectives: objectives });
  };

  const inputStyle = "w-full p-2 border rounded";
  const labelStyle = "block mb-2 font-semibold";
  const checkboxStyle = "mr-2 form-checkbox";

  return (
    <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)' }}>
      <h2 className="text-xl font-semibold mb-4">Risk Assessment</h2>
      <p style={{ color: 'var(--secondary-color)' }} className="mb-6">
        Understanding your risk tolerance and investment goals helps us ensure
        suitable investment opportunities are presented to you.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className={labelStyle}>Risk Tolerance</label>
            <select
              required
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.riskTolerance}
              onChange={(e) => setFormData({ ...formData, riskTolerance: e.target.value as any })}
            >
              <option value="conservative">Conservative - Prefer lower risk investments</option>
              <option value="moderate">Moderate - Balance between risk and return</option>
              <option value="aggressive">Aggressive - Comfortable with higher risk for higher returns</option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>Investment Time Horizon</label>
            <select
              required
              className={inputStyle}
              style={{ backgroundColor: 'var(--detail-item-bg-color)', color: 'var(--text-color)' }}
              value={formData.investmentHorizon}
              onChange={(e) => setFormData({ ...formData, investmentHorizon: e.target.value })}
            >
              <option value="">Select Horizon</option>
              <option value="short">Short-term (1-3 years)</option>
              <option value="medium">Medium-term (3-5 years)</option>
              <option value="long">Long-term (5+ years)</option>
            </select>
          </div>

          <div>
            <label className={labelStyle}>Investment Objectives</label>
            <div className="space-y-2">
              {[
                'Capital Preservation',
                'Income Generation',
                'Capital Growth',
                'Portfolio Diversification',
                'Tax Benefits',
                'Impact Investing'
              ].map((objective) => (
                <label key={objective} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.investmentObjectives.includes(objective)}
                    onChange={() => handleObjectiveChange(objective)}
                    className={checkboxStyle}
                    style={{ borderColor: 'var(--primary-color)' }}
                  />
                  <span>{objective}</span>
                </label>
              ))}
            </div>
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

export default RiskAssessmentStep;
