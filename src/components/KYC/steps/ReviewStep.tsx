import React from 'react';
import { KYCData } from '../../../types';

interface ReviewStepProps {
  onSubmit: () => void;
  onBack: () => void;
  data: Partial<KYCData>;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onSubmit, onBack, data }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const sectionStyle = "mb-6";
  const sectionTitleStyle = "text-lg font-medium mb-3";
  const labelStyle = "text-sm mb-1";
  const valueStyle = "font-medium";
  const gridStyle = "grid grid-cols-2 gap-4 p-4 rounded";

  return (
    <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)' }}>
      <h2 className="text-xl font-semibold mb-4">Review Your Information</h2>
      <p style={{ color: 'var(--secondary-color)' }} className="mb-6">
        Please review your information carefully. You can go back to make changes
        if needed.
      </p>

      <div className="space-y-6">
        <section className={sectionStyle}>
          <h3 className={sectionTitleStyle}>Personal Information</h3>
          <div className={gridStyle} style={{ backgroundColor: 'var(--detail-item-bg-color)' }}>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Date of Birth</p>
              <p className={valueStyle}>{formatDate(data.personalInfo?.dateOfBirth || '')}</p>
            </div>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Nationality</p>
              <p className={valueStyle}>{data.personalInfo?.nationality}</p>
            </div>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Occupation</p>
              <p className={valueStyle}>{data.personalInfo?.occupation}</p>
            </div>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Tax Residency</p>
              <p className={valueStyle}>{data.personalInfo?.taxResidency}</p>
            </div>
          </div>
        </section>

        <section className={sectionStyle}>
          <h3 className={sectionTitleStyle}>Identity Verification</h3>
          <div className={gridStyle} style={{ backgroundColor: 'var(--detail-item-bg-color)' }}>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Document Type</p>
              <p className={valueStyle}>{data.identityVerification?.documentType}</p>
            </div>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Document Number</p>
              <p className={valueStyle}>{data.identityVerification?.documentNumber}</p>
            </div>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Expiry Date</p>
              <p className={valueStyle}>{formatDate(data.identityVerification?.documentExpiryDate || '')}</p>
            </div>
          </div>
        </section>

        <section className={sectionStyle}>
          <h3 className={sectionTitleStyle}>Financial Information</h3>
          <div className={gridStyle} style={{ backgroundColor: 'var(--detail-item-bg-color)' }}>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Annual Income Range</p>
              <p className={valueStyle}>{data.financialInfo?.annualIncome}</p>
            </div>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Source of Funds</p>
              <p className={valueStyle}>{data.financialInfo?.sourceOfFunds}</p>
            </div>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Net Worth Range</p>
              <p className={valueStyle}>{data.financialInfo?.netWorth}</p>
            </div>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Expected Investment Range</p>
              <p className={valueStyle}>{data.financialInfo?.expectedInvestmentRange}</p>
            </div>
          </div>
        </section>

        <section className={sectionStyle}>
          <h3 className={sectionTitleStyle}>Investment Experience</h3>
          <div className={gridStyle} style={{ backgroundColor: 'var(--detail-item-bg-color)' }}>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Private Equity Experience</p>
              <p className={valueStyle}>{data.investmentExperience?.privateEquityExperience ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Years Investing</p>
              <p className={valueStyle}>{data.investmentExperience?.yearsInvesting} years</p>
            </div>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Investment Types</p>
              <p className={valueStyle}>{data.investmentExperience?.previousInvestmentTypes.join(', ')}</p>
            </div>
          </div>
        </section>

        <section className={sectionStyle}>
          <h3 className={sectionTitleStyle}>Risk Assessment</h3>
          <div className={gridStyle} style={{ backgroundColor: 'var(--detail-item-bg-color)' }}>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Risk Tolerance</p>
              <p className={valueStyle}>{data.riskAssessment?.riskTolerance}</p>
            </div>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Investment Horizon</p>
              <p className={valueStyle}>{data.riskAssessment?.investmentHorizon}</p>
            </div>
            <div>
              <p className={labelStyle} style={{ color: 'var(--secondary-color)' }}>Investment Objectives</p>
              <p className={valueStyle}>{data.riskAssessment?.investmentObjectives.join(', ')}</p>
            </div>
          </div>
        </section>

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
            type="button"
            onClick={onSubmit}
            className="px-6 py-2 rounded transition-colors duration-200"
            style={{ backgroundColor: 'var(--primary-color)', color: 'var(--button-text-color)' }}
          >
            Submit KYC
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
