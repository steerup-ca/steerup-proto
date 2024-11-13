import React from 'react';
import { AdditionalFundingEntity } from '../../types';
import '../../styles/theme.css';

interface AdditionalFundingProps {
  entities: Record<string, AdditionalFundingEntity>;
  funding: Array<{ entityId: string; amount: number }>;
  investmentType: 'equity' | 'debt';
}

const AdditionalFunding: React.FC<AdditionalFundingProps> = ({ entities, funding, investmentType }) => {
  const accentColor = investmentType === 'equity' ? 'var(--equity-accent-color)' : 'var(--debt-accent-color)';

  return (
    <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="heading-large" style={{ color: accentColor }}>Additional Funding</h2>
        <ul className="space-y-2">
          {funding.map((fund) => {
            const entity = entities[fund.entityId];
            return entity ? (
              <li 
                key={fund.entityId} 
                className="bg-detail-item-bg-color p-3" 
                style={{ borderRadius: 'var(--border-radius)' }}
              >
                <div className="flex items-center mb-2">
                  {entity.iconUrl && (
                    <img 
                      src={entity.iconUrl} 
                      alt={entity.name} 
                      className="w-6 h-6 rounded-full mr-2"
                      style={{ 
                        borderColor: accentColor,
                        borderWidth: 'var(--border-width)',
                        boxShadow: 'var(--box-shadow)'
                      }}
                    />
                  )}
                  <div>
                    <span className="text-large">{entity.name}</span>
                    <span 
                      className="text-sm block" 
                      style={{ color: 'var(--secondary-color)' }}
                    >
                      {entity.label}
                    </span>
                  </div>
                </div>
                <p 
                  className="text-sm" 
                  style={{ color: 'var(--text-color)' }}
                >
                  {entity.description}
                </p>
                <span 
                  className="block mt-1 font-bold" 
                  style={{ color: accentColor }}
                >
                  ${fund.amount.toLocaleString()}
                </span>
              </li>
            ) : null;
          })}
        </ul>
      </div>
    </div>
  );
};

export default AdditionalFunding;
