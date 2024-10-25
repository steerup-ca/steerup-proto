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
  [InvestmentStage.INITIATION]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.CONFIRMATION]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.PAYMENT_VALIDATION]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.FUNDS_IN_CUSTODY]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.SHARE_ISSUANCE]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.FUNDS_TRANSFER]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.FUND_DEPLOYMENT]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </IconWrapper>
  ),
  [InvestmentStage.PERFORMANCE_TRACKING]: (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </IconWrapper>
  )
};

const stageInfo = {
  [InvestmentStage.INITIATION]: {
    title: 'Investment Amount',
    value: '$50,000'
  },
  [InvestmentStage.CONFIRMATION]: {
    title: 'Investment Confirmed',
    value: 'Payment Method Verified'
  },
  [InvestmentStage.PAYMENT_VALIDATION]: {
    title: 'Payment Processed',
    value: 'Identity Verified'
  },
  [InvestmentStage.FUNDS_IN_CUSTODY]: {
    title: 'Funds Secured',
    value: 'In Custodian Account'
  },
  [InvestmentStage.SHARE_ISSUANCE]: {
    title: 'Share Issuance',
    value: 'Pending'
  },
  [InvestmentStage.FUNDS_TRANSFER]: {
    title: 'Fund Transfer',
    value: 'Awaiting Transfer'
  },
  [InvestmentStage.FUND_DEPLOYMENT]: {
    title: 'Deployment',
    value: 'Not Started'
  },
  [InvestmentStage.PERFORMANCE_TRACKING]: {
    title: 'Performance',
    value: 'Pending'
  }
};

const InvestmentTracker: React.FC<InvestmentTrackerProps> = ({ tracking }) => {
  const stages = Object.values(InvestmentStage);
  const currentStageIndex = stages.indexOf(tracking.currentStage);

  const getStageStatus = (stage: InvestmentStage) => {
    const stageDetail = tracking.stages.find(s => s.stage === stage);
    return stageDetail?.status || 'pending';
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
                      {stageInfo[stage].value}
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
