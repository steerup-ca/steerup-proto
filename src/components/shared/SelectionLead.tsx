import React from 'react';
import { LeadInvestor } from '../../types';
import '../../styles/theme.css';

interface SelectionLeadProps {
  lead: LeadInvestor;
  investmentType: 'equity' | 'debt';
}

const SelectionLead: React.FC<SelectionLeadProps> = ({ lead, investmentType }) => {
  const accentColor = investmentType === 'equity' ? 'var(--equity-accent-color)' : 'var(--debt-accent-color)';

  return (
    <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="heading-large" style={{ color: accentColor }}>Selection Lead</h2>
        <div className="flex items-center mb-4">
          <img 
            src={lead.photo} 
            alt={lead.name} 
            className="w-16 h-16 rounded-full mr-4"
            style={{ 
              borderColor: accentColor, 
              borderWidth: 'var(--border-width)',
              boxShadow: 'var(--box-shadow)'
            }}
          />
          <div>
            <p className="text-large">{lead.name}</p>
            <p className="text-sm" style={{ color: 'var(--secondary-color)' }}>
              {lead.title} at {lead.company}
            </p>
          </div>
        </div>
        <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-color)' }}>
          {lead.bio}
        </p>
        <div className="flex flex-wrap gap-2">
          {lead.areasOfExpertise.map((area, index) => (
            <span 
              key={index}
              className="px-3 py-1 text-xs rounded-full"
              style={{
                backgroundColor: accentColor,
                opacity: 0.8,
                color: 'var(--button-text-color)',
                borderRadius: 'var(--button-border-radius)'
              }}
            >
              {area}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectionLead;
