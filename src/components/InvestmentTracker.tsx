import React from 'react';
import { InvestmentTracking, InvestmentStage } from '../types';

interface InvestmentTrackerProps {
  tracking: InvestmentTracking;
}

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center justify-center translate-y-[0.5px]">
    {children}
  </div>
);

const stageIcons = {
  [InvestmentStage.PLEDGE]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.CUSTODIAN]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.CAMPAIGN_SUCCESS]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.CAMPAIGN_FAILURE]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.FUNDS_INVESTED]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.REFUND]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.PERFORMANCE_TRACKING]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.EXIT]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    </IconWrapper>
  )
};

const stageInfo = {
  [InvestmentStage.PLEDGE]: {
    title: 'Investment Pledged',
    value: 'Awaiting Campaign'
  },
  [InvestmentStage.CUSTODIAN]: {
    title: 'Funds in Custody',
    value: 'Escrow Account'
  },
  [InvestmentStage.CAMPAIGN_SUCCESS]: {
    title: 'Campaign Successful',
    value: 'Goal Reached'
  },
  [InvestmentStage.CAMPAIGN_FAILURE]: {
    title: 'Campaign Failed',
    value: 'Goal Not Met'
  },
  [InvestmentStage.FUNDS_INVESTED]: {
    title: 'Funds Being Invested',
    value: 'Transfer in Progress'
  },
  [InvestmentStage.REFUND]: {
    title: 'Refund Process',
    value: 'Funds Returning'
  },
  [InvestmentStage.PERFORMANCE_TRACKING]: {
    title: 'Performance Tracking',
    value: 'Monitoring ROI'
  },
  [InvestmentStage.EXIT]: {
    title: 'Investment Exit',
    value: 'Security Sold'
  }
};

const InvestmentTracker: React.FC<InvestmentTrackerProps> = ({ tracking }) => {
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

  const getStageValue = (stage: InvestmentStage) => {
    const stageDetail = tracking.stages.find(s => s.stage === stage);
    if (stage === InvestmentStage.FUNDS_INVESTED && stageDetail?.fundsProgress) {
      const progress = (stageDetail.fundsProgress.transferredAmount / stageDetail.fundsProgress.totalAmount) * 100;
      return `${progress.toFixed(0)}% Transferred`;
    }
    return stageDetail?.message || stageInfo[stage].value;
  };

  return (
    <div className="bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-8 shadow-[var(--box-shadow)]">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="h-1 bg-[var(--progress-bg-color)] rounded-full">
          <div 
            className="h-full bg-[var(--success-color)] rounded-full transition-all duration-500"
            style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Stages Flow */}
      <div className="relative">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage);
          const isActive = tracking.currentStage === stage;
          const isPast = index <= currentStageIndex;
          const isLast = index === stages.length - 1;

          return (
            <div key={stage} className="relative">
              <div className={`
                flex items-center p-4 rounded-[var(--border-radius)] mb-5
                ${status === 'completed' ? 'bg-[var(--success-color)] bg-opacity-5' : 
                  isActive ? 'bg-[var(--detail-item-bg-color)] ring-1 ring-[var(--success-color)]' : 
                  'bg-[var(--detail-item-bg-color)]'}
                ${isPast ? '' : 'opacity-40'}
                relative z-10
              `}>
                {/* Step Number */}
                <div className="w-8 mr-4 text-[var(--text-color)] text-[var(--font-size-small)] font-medium">
                  {(index + 1).toString().padStart(2, '0')}
                </div>

                {/* Status Icon */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mr-4
                  ${status === 'completed' ? 'bg-[var(--success-color)]' :
                    isActive ? 'bg-[var(--detail-item-bg-color)] ring-1 ring-[var(--success-color)]' :
                    'bg-[var(--detail-item-bg-color)]'}
                `}>
                  {stageIcons[stage]}
                </div>

                {/* Stage Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-color)] text-[var(--font-size-small)] font-medium">
                      {stageInfo[stage].title}
                    </span>
                    <span className="text-[var(--text-color)] text-[var(--font-size-small)] opacity-80">
                      {getStageValue(stage)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className={`
                  absolute left-4 ml-0 w-[1px] h-5
                  ${isPast ? 'bg-[var(--success-color)]' : 'bg-[var(--detail-item-bg-color)]'}
                  opacity-20 z-0
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InvestmentTracker;
