import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StartupsSelection, LeadInvestor, Startup, Campaign, AdditionalFundingEntity, InvestmentType } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface StartupsSelectionCardProps {
  selection: StartupsSelection;
  leadInvestor: LeadInvestor;
  startups: Startup[];
  campaigns: Campaign[];
}

const StartupsSelectionCard: React.FC<StartupsSelectionCardProps> = ({ selection, leadInvestor, startups, campaigns }) => {
  const [fundingEntities, setFundingEntities] = useState<Record<string, AdditionalFundingEntity>>({});
  const navigate = useNavigate();

  const isDebt = selection.investmentType === InvestmentType.DEBT;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch additional funding entities
        const entityIds = selection.additionalFunding.map(f => f.entityId);
        const entities: Record<string, AdditionalFundingEntity> = {};
        
        for (const entityId of entityIds) {
          try {
            const entityDoc = await getDoc(doc(db, 'additionalFundingEntities', entityId));
            if (entityDoc.exists()) {
              entities[entityId] = { id: entityDoc.id, ...entityDoc.data() } as AdditionalFundingEntity;
            }
          } catch (error) {
            console.error(`Error fetching funding entity ${entityId}:`, error);
          }
        }
        
        setFundingEntities(entities);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selection.additionalFunding]);

  const progressPercentage = selection.goal > 0 
    ? Math.min((selection.currentAmount / selection.goal) * 100, 100)
    : 0;

  const handleInvestmentClick = () => {
    const route = isDebt ? 'co-lend' : 'co-invest';
    navigate(`/${route}/${selection.id}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selection.title,
        text: `Check out this investment opportunity: ${selection.title}`,
        url: window.location.href
      }).catch((error) => console.log('Error sharing:', error));
    }
  };

  const handleAdditionalFundingClick = (entityId: string) => {
    navigate(`/additional-funding/${entityId}`);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg relative" style={{
      background: `linear-gradient(to bottom, var(--${isDebt ? 'debt' : 'equity'}-gradient-start), var(--${isDebt ? 'debt' : 'equity'}-gradient-end))`
    }}>
      <span className="absolute top-0 right-0 px-3 py-0 text-xs text-white rounded-bl-lg" style={{
        backgroundColor: `var(--${isDebt ? 'debt' : 'equity'}-accent-color)`,
        borderTopRightRadius: 'var(--border-radius)'
      }}>
        {isDebt ? 'Debt' : 'Equity'}
      </span>

      <div className="p-2">
        <div className="flex items-center mb-5">
          <div className="flex items-center">
            <Link to={`/lead-investor/${leadInvestor.id}`} className="mr-2">
              <div className="relative w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--card-bg-color)' }}>
                <img 
                  src={leadInvestor.photo} 
                  alt={leadInvestor.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-avatar.png';
                  }}
                />
              </div>
            </Link>
            <h2 className="text-base font-bold text-white">{selection.title}</h2>
          </div>
        </div>

        {isDebt && selection.debtTerms && (
          <div className="mb-5 p-3 rounded-lg" style={{ backgroundColor: 'var(--detail-item-bg-color)' }}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-300 text-sm">Interest Rate</p>
                <p className="text-white font-semibold">{selection.debtTerms.interestRate}% APR</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Term Length</p>
                <p className="text-white font-semibold">{selection.debtTerms.maturityMonths} months</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Payment Schedule</p>
                <p className="text-white font-semibold capitalize">{selection.debtTerms.paymentSchedule}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-2 mb-6">
          {startups.map((startup) => (
            <Link key={startup.id} to={`/startup/${startup.id}`} className="relative overflow-hidden rounded-lg" style={{ height: '100px' }}>
              <img 
                src={startup.imageUrl} 
                alt={startup.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/default-startup.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h4 className="font-semibold text-white text-lg mb-1">{startup.name}</h4>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mb-5">
          <div className="flex justify-between text-sm mb-1 text-white">
            <span>Raised: ${selection.currentAmount.toLocaleString()}</span>
            <span>Goal: ${selection.goal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div
              className="h-1 rounded-full"
              style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: `var(--${isDebt ? 'debt' : 'equity'}-accent-color)`
              }}
            ></div>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          <button 
            onClick={handleInvestmentClick}
            className="flex-1 text-white py-2 rounded-lg font-semibold transition-colors duration-200 text-lg"
            style={{
              backgroundColor: `var(--${isDebt ? 'debt' : 'equity'}-accent-color)`,
              color: 'var(--button-text-color)',
              borderRadius: 'var(--border-radius)'
            }}
          >
            {isDebt ? 'Co-lend' : 'Co-invest'}
          </button>
          <button
            onClick={handleShare}
            className="aspect-square text-white p-3 rounded-lg transition-colors duration-200"
            style={{
              backgroundColor: `var(--${isDebt ? 'debt' : 'equity'}-accent-color)`,
              color: 'var(--button-text-color)',
              borderRadius: 'var(--border-radius)'
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2 text-gray-300">ADDITIONAL FUNDING</h3>
          <div className="space-y-2">
            {selection.additionalFunding.map((funding) => {
              const entity = fundingEntities[funding.entityId];
              return entity ? (
                <div 
                  key={funding.entityId} 
                  className="rounded-lg py-1 px-1.5 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'var(--additional-funding-bg-color)' }}
                  onClick={() => handleAdditionalFundingClick(funding.entityId)}
                >
                  <div className="flex items-center flex-grow">
                    <div className="relative w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--card-bg-color)' }}>
                      {entity.iconUrl && (
                        <img 
                          src={entity.iconUrl} 
                          alt={entity.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-entity.png';
                          }}
                        />
                      )}
                    </div>
                    <div className="ml-2">
                      <div className="flex items-center">
                        <span className="text-white font-medium">{entity.name}</span>
                      </div>
                      <span className="text-sm block text-gray-300">
                        {entity.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span 
                      className="font-medium"
                      style={{ color: 'var(--success-color)' }}
                    >
                      ${funding.amount.toLocaleString()}
                    </span>
                    <div 
                      className="ml-2 -mt-1.5"
                      style={{ 
                        color: funding.isLocked ? `var(--${isDebt ? 'debt' : 'equity'}-accent-color)` : '#9CA3AF'
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {funding.isLocked ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        )}
                      </svg>
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupsSelectionCard;
