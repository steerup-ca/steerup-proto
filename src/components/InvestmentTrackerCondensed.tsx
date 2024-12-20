import React from 'react';
import { InvestmentTracking, InvestmentStage } from '../types';

interface InvestmentTrackerCondensedProps {
  tracking: InvestmentTracking;
}

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center justify-center translate-y-[0.5px]">
    {children}
  </div>
);

// Using consistent Heroicons style
const stageIcons = {
  [InvestmentStage.PLEDGE]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.CUSTODIAN]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.CAMPAIGN_SUCCESS]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.CAMPAIGN_FAILURE]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.FUNDS_INVESTED]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.REFUND]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.PERFORMANCE_TRACKING]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.EXIT]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    </IconWrapper>
  )
};

const stageShortNames = {
  [InvestmentStage.PLEDGE]: 'Pledge',
  [InvestmentStage.CUSTODIAN]: 'Custody',
  [InvestmentStage.CAMPAIGN_SUCCESS]: 'Success',
  [InvestmentStage.CAMPAIGN_FAILURE]: 'Failed',
  [InvestmentStage.FUNDS_INVESTED]: 'Investing',
  [InvestmentStage.REFUND]: 'Refund',
  [InvestmentStage.PERFORMANCE_TRACKING]: 'Track',
  [InvestmentStage.EXIT]: 'Exit'
};

const InvestmentTrackerCondensed: React.FC<InvestmentTrackerCondensedProps> = ({ tracking }) => {
  // Determine which stages to show based on campaign success/failure
  const getRelevantStages = () => {
    const hasFailure = tracking.stages.some(s => s.stage === InvestmentStage.CAMPAIGN_FAILURE);
    const hasSuccess = tracking.stages.some(s => s.stage === InvestmentStage.CAMPAIGN_SUCCESS);

    if (hasFailure) {
      return [
        InvestmentStage.PLEDGE,
        InvestmentStage.CUSTODIAN,
        InvestmentStage.CAMPAIGN_FAILURE,
        InvestmentStage.REFUND
      ];
    } else if (hasSuccess) {
      return [
        InvestmentStage.PLEDGE,
        InvestmentStage.CUSTODIAN,
        InvestmentStage.CAMPAIGN_SUCCESS,
        InvestmentStage.FUNDS_INVESTED,
        InvestmentStage.PERFORMANCE_TRACKING,
        InvestmentStage.EXIT
      ];
    }

    return [InvestmentStage.PLEDGE, InvestmentStage.CUSTODIAN];
  };

  const stages = getRelevantStages();
  const currentStageIndex = stages.indexOf(tracking.currentStage);

  const getStageStatus = (stage: InvestmentStage) => {
    const stageDetail = tracking.stages.find(s => s.stage === stage);
    return stageDetail?.status || 'pending';
  };

  const getStageMessage = (stage: InvestmentStage) => {
    const stageDetail = tracking.stages.find(s => s.stage === stage);
    return stageDetail?.message || '';
  };

  return (
    <div className="bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-6 shadow-[var(--box-shadow)]">
      {/* Current Stage Highlight */}
      <div className="mb-6 text-center">
        <div className="inline-flex justify-center items-center w-10 h-10 rounded-full bg-[var(--primary-color)] mb-3">
          <div className="w-5 h-5 text-white flex items-center justify-center">
            {stageIcons[tracking.currentStage]}
          </div>
        </div>
        <h3 className="text-[var(--text-color)] text-[var(--font-size-medium)] font-bold mb-1">
          {stageShortNames[tracking.currentStage]}
        </h3>
        <p className="text-[var(--text-color)] text-[var(--font-size-small)] opacity-80">
          {getStageMessage(tracking.currentStage)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="h-1 bg-[var(--progress-bg-color)] rounded-full">
          <div 
            className="h-full bg-[var(--primary-color)] rounded-full transition-all duration-500"
            style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Stage Pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage);
          const isActive = tracking.currentStage === stage;
          const isPast = index <= currentStageIndex;

          return (
            <div
              key={stage}
              className={`
                inline-flex items-center h-7 px-3 rounded-full text-[var(--text-color)] text-[var(--font-size-xsmall)]
                ${isActive ? 'bg-[var(--primary-color)]' : 
                  status === 'completed' ? 'bg-[var(--success-color)] opacity-70' : 
                  'bg-[var(--detail-item-bg-color)] opacity-50'}
                ${isPast ? '' : 'opacity-40'}
                transition-all duration-300
              `}
            >
              <div className="flex items-center">
                {stageIcons[stage]}
                <span className="ml-1.5 leading-none">{stageShortNames[stage]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-3">
        <button 
          className="h-8 px-4 text-[var(--font-size-small)] bg-[var(--detail-item-bg-color)] rounded-full text-[var(--text-color)] hover:opacity-80 transition-opacity inline-flex items-center"
        >
          <IconWrapper>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </IconWrapper>
          <span className="ml-1.5 leading-none">Details</span>
        </button>
        <button 
          className="h-8 px-4 text-[var(--font-size-small)] bg-[var(--detail-item-bg-color)] rounded-full text-[var(--text-color)] hover:opacity-80 transition-opacity inline-flex items-center"
        >
          <IconWrapper>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </IconWrapper>
          <span className="ml-1.5 leading-none">Updates</span>
        </button>
      </div>
    </div>
  );
};

export default InvestmentTrackerCondensed;
