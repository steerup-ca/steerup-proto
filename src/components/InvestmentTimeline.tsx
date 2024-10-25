import React from 'react';
import { InvestmentStage, InvestmentStageDetail } from '../types';
import PaidIcon from '@mui/icons-material/Paid';
import VerifiedIcon from '@mui/icons-material/Verified';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DescriptionIcon from '@mui/icons-material/Description';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface InvestmentTimelineProps {
  stages: InvestmentStageDetail[];
  currentStage: InvestmentStage;
}

const StageIcon: React.FC<{ stage: InvestmentStage; isCompleted: boolean; isCurrent: boolean }> = ({ stage, isCompleted, isCurrent }) => {
  const iconClass = `w-5 h-5 ${isCompleted ? 'text-[var(--success-color)]' : 
    isCurrent ? 'text-white' : 'text-[var(--text-color)] opacity-40'}`;

  if (isCompleted) {
    return <CheckCircleIcon className={iconClass} />;
  }

  switch (stage) {
    case InvestmentStage.INITIATION:
      return <PaidIcon className={iconClass} />;
    case InvestmentStage.CONFIRMATION:
      return <VerifiedIcon className={iconClass} />;
    case InvestmentStage.PAYMENT_VALIDATION:
      return <SecurityIcon className={iconClass} />;
    case InvestmentStage.FUNDS_IN_CUSTODY:
      return <AccountBalanceIcon className={iconClass} />;
    case InvestmentStage.SHARE_ISSUANCE:
      return <DescriptionIcon className={iconClass} />;
    case InvestmentStage.FUNDS_TRANSFER:
      return <SwapHorizIcon className={iconClass} />;
    case InvestmentStage.FUND_DEPLOYMENT:
      return <RocketLaunchIcon className={iconClass} />;
    case InvestmentStage.PERFORMANCE_TRACKING:
      return <ShowChartIcon className={iconClass} />;
    default:
      return null;
  }
};

const InvestmentTimeline: React.FC<InvestmentTimelineProps> = ({ stages, currentStage }) => {
  const allStages = Object.values(InvestmentStage);
  const currentStageIndex = allStages.indexOf(currentStage);

  return (
    <div className="mt-3">
      <div className="relative px-2 md:px-4">
        {/* Timeline line */}
        <div className="absolute top-[19px] left-4 right-4 h-[2px] bg-[var(--progress-bg-color)] opacity-30" />
        
        {/* Active line */}
        <div 
          className="absolute top-[19px] left-4 h-[2px] bg-[var(--success-color)] transition-all duration-500"
          style={{
            width: `${((currentStageIndex + 1) / allStages.length) * (100 - (100/allStages.length))}%`
          }}
        />
        
        {/* Timeline steps */}
        <div className="relative flex justify-between">
          {allStages.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = stage === currentStage;

            return (
              <div 
                key={stage}
                className="flex flex-col items-center relative"
                style={{ flex: '1' }}
              >
                {/* Icon Container */}
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  ${isCurrent ? 'bg-[#9c27b0] shadow-lg scale-125' : 
                    isCompleted ? 'bg-[var(--detail-item-bg-color)]' : 'bg-[var(--detail-item-bg-color)]'}
                  transition-all duration-300
                  relative
                  ${isCurrent ? 'z-10' : 'z-0'}
                `}>
                  {/* Icon */}
                  <div className={`
                    flex items-center justify-center
                    ${isCurrent ? 'transform scale-100' : ''}
                  `}>
                    <StageIcon stage={stage} isCompleted={isCompleted} isCurrent={isCurrent} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InvestmentTimeline;
