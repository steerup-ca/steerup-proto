import React from 'react';
import { StartupsSelection } from '../../types';
import '../../styles/theme.css';

interface InvestmentFormProps {
  selection: StartupsSelection;
  investmentType: 'equity' | 'debt';
  onInvestClick: () => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ selection, investmentType, onInvestClick }) => {
  const accentColor = investmentType === 'equity' ? 'var(--equity-accent-color)' : 'var(--debt-accent-color)';
  const actionText = investmentType === 'equity' ? 'Start Co-investment' : 'Start Co-lending';

  const getInvestmentDescription = () => {
    if (investmentType === 'debt' && selection.debtTerms) {
      return `By co-lending, you'll receive ${selection.debtTerms.interestRate}% APR with ${selection.debtTerms.maturityMonths} months maturity and ${selection.debtTerms.paymentSchedule} payments.`;
    }
    return "By co-investing, you'll receive equity proportional to your investment amount in these startups.";
  };

  return (
    <div 
      className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden"
      style={{ boxShadow: 'var(--box-shadow)' }}
    >
      <div className="p-6">
        <h2 className="heading-large" style={{ color: accentColor }}>
          Make Your Investment
        </h2>
        <p 
          className="text-medium mb-4" 
          style={{ color: 'var(--text-color)' }}
        >
          {getInvestmentDescription()}
        </p>

        {/* Debt Terms Display */}
        {investmentType === 'debt' && selection.debtTerms && (
          <div 
            className="mb-4 grid grid-cols-3 gap-4"
            style={{ marginBottom: 'var(--spacing-large)' }}
          >
            <div 
              className="bg-detail-item-bg-color p-3 text-center"
              style={{ borderRadius: 'var(--border-radius)' }}
            >
              <div 
                className="text-sm"
                style={{ color: 'var(--secondary-color)' }}
              >
                APR
              </div>
              <div 
                className="font-bold"
                style={{ color: accentColor }}
              >
                {selection.debtTerms.interestRate}%
              </div>
            </div>
            <div 
              className="bg-detail-item-bg-color p-3 text-center"
              style={{ borderRadius: 'var(--border-radius)' }}
            >
              <div 
                className="text-sm"
                style={{ color: 'var(--secondary-color)' }}
              >
                Term
              </div>
              <div 
                className="font-bold"
                style={{ color: accentColor }}
              >
                {selection.debtTerms.maturityMonths} months
              </div>
            </div>
            <div 
              className="bg-detail-item-bg-color p-3 text-center"
              style={{ borderRadius: 'var(--border-radius)' }}
            >
              <div 
                className="text-sm"
                style={{ color: 'var(--secondary-color)' }}
              >
                Payments
              </div>
              <div 
                className="font-bold"
                style={{ color: accentColor }}
              >
                {selection.debtTerms.paymentSchedule}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onInvestClick}
          className="w-full py-3 px-6 text-lg font-semibold hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-200"
          style={{
            backgroundColor: accentColor,
            color: 'var(--button-text-color)',
            borderRadius: 'var(--button-border-radius)',
            boxShadow: 'var(--box-shadow)'
          }}
        >
          {actionText}
        </button>
      </div>
    </div>
  );
};

export default InvestmentForm;
