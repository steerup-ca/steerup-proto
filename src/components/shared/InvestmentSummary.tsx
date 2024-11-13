import React from 'react';
import { StartupsSelection } from '../../types';
import '../../styles/theme.css';

interface InvestmentSummaryProps {
  selection: StartupsSelection;
  investmentType: 'equity' | 'debt';
}

const InvestmentSummary: React.FC<InvestmentSummaryProps> = ({ selection, investmentType }) => {
  const accentColor = investmentType === 'equity' ? 'var(--equity-accent-color)' : 'var(--debt-accent-color)';

  return (
    <div 
      className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden"
      style={{ boxShadow: 'var(--box-shadow)' }}
    >
      <div className="p-4">
        <div className="mb-6">
          <div className="grid grid-cols-4 text-center mb-1">
            <div className="text-sm" style={{ color: 'var(--secondary-color)', opacity: 0.6 }}>Total Raised</div>
            <div className="text-sm" style={{ color: 'var(--secondary-color)', opacity: 0.6 }}>Goal</div>
            <div className="text-sm" style={{ color: 'var(--secondary-color)', opacity: 0.6 }}>Backers</div>
            <div className="text-sm" style={{ color: 'var(--secondary-color)', opacity: 0.6 }}>Days Left</div>
          </div>
          <div className="grid grid-cols-4 text-center">
            <div className="text-large font-bold" style={{ color: accentColor }}>
              ${selection.currentAmount.toLocaleString()}
            </div>
            <div className="text-large font-bold" style={{ color: accentColor }}>
              ${selection.goal.toLocaleString()}
            </div>
            <div className="text-large font-bold" style={{ color: accentColor }}>
              {selection.backersCount}
            </div>
            <div className="text-large font-bold" style={{ color: accentColor }}>
              {selection.daysLeft}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div 
          className="w-full h-2 rounded-full"
          style={{ 
            backgroundColor: 'var(--progress-bg-color)',
            overflow: 'hidden',
            borderRadius: 'var(--border-radius)'
          }}
        >
          <div
            className="h-full rounded-full"
            style={{
              backgroundColor: accentColor,
              width: `${Math.min((selection.currentAmount / selection.goal) * 100, 100)}%`,
              transition: 'width 0.5s ease-in-out',
              borderRadius: 'var(--border-radius)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InvestmentSummary;
