import React from 'react';
import { Startup, Campaign, StartupsSelection, LeadInvestor } from '../../types';
import { getLeadInvestorById } from '../../services/leadInvestorService';

interface StartupInvestingProps {
  startup: Startup;
  campaign?: Campaign;
  investmentAmount: number;
  currentAmount: number;
  selection: StartupsSelection;
  startupRaisedAmount: number;
  startupGoalAmount: number;
}

const StartupInvesting: React.FC<StartupInvestingProps> = ({
  startup,
  campaign,
  investmentAmount,
  currentAmount,
  selection,
  startupRaisedAmount,
  startupGoalAmount
}) => {
  const location = startup.location.replace(', QC, Canada', '');
  const currentRoundNumber = startup.fundingHistory.length + 1;

  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'decimal',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    });
  };

  return (
    <div
      className="block hover:bg-[#30363D] transition-colors duration-200 overflow-hidden"
      style={{
        border: '1px solid rgba(142, 68, 173, 0.40)',
        borderRadius: '12px',
        backgroundColor: 'var(--card-bg-color)',
      }}
    >
      {/* Image Section with Overlay */}
      <div className="relative">
        {/* Full-width Image with Name */}
        <div className="w-full h-[125px] relative">
          <img
            src={startup.imageUrl}
            alt={`${startup.name}`}
            className="w-full h-full object-cover"
          />
          {/* Dark Gradient Overlay with Startup Name and Pills */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 58%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
              paddingBottom: '8px'
            }}
          >
            <div className="px-2">
              <h3 className="text-xl font-bold text-white mb-1">
                {startup.name}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: 'var(--detail-item-bg-color)',
                    color: 'var(--text-color)',
                    opacity: '0.65'
                  }}
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {location}
                </span>
                <span
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: 'var(--detail-item-bg-color)',
                    color: 'var(--text-color)',
                    opacity: '0.65'
                  }}
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Founded {startup.foundedYear}
                </span>
                <span
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: 'var(--detail-item-bg-color)',
                    color: 'var(--text-color)',
                    opacity: '0.65'
                  }}
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  {currentRoundNumber}{getOrdinalSuffix(currentRoundNumber)} Funding
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-2">
        {campaign && (
          <span
            style={{
              color: 'var(--primary-color)',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            You invest ${formatAmount(investmentAmount)}
          </span>
        )}

        {campaign && (
          <a
            href={campaign.offeringDetails.offeringDocument}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium hover:opacity-90 transition-opacity underline"
            style={{
              color: 'var(--text-color)',
              opacity: '0.7'
            }}
          >
            Your Investment in Action
          </a>
        )}
      </div>
    </div>
  );
};

export default StartupInvesting;
