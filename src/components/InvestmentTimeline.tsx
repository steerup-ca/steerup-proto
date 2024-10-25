import React from 'react';
import { InvestmentStage, InvestmentStageDetail } from '../types';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ErrorIcon from '@mui/icons-material/Error';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

interface InvestmentTimelineProps {
  stages: InvestmentStageDetail[];
  currentStage: InvestmentStage;
}

const CircularProgress: React.FC<{ progress: number; isCurrent: boolean }> = ({ progress, isCurrent }) => {
  const circumference = 2 * Math.PI * 18; // Slightly smaller radius to prevent cropping
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-10 h-10">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
        <circle
          className={`${isCurrent ? 'text-white' : 'text-[var(--text-color)]'} opacity-20`}
          strokeWidth="3"
          stroke="currentColor"
          fill="transparent"
          r="18"
          cx="20"
          cy="20"
        />
        <circle
          className={isCurrent ? 'text-white' : 'text-[var(--success-color)]'}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="18"
          cx="20"
          cy="20"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`${isCurrent ? 'text-white' : 'text-[var(--text-color)]'} text-xs font-medium`}>
          {progress.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

const StageIcon: React.FC<{ stage: InvestmentStage; stageDetail: InvestmentStageDetail | undefined; isCurrent: boolean }> = ({ stage, stageDetail, isCurrent }) => {
  const iconClass = `w-5 h-5 ${stageDetail?.status === 'completed' ? 'text-[var(--success-color)]' : 
    isCurrent ? 'text-white' : 'text-[var(--text-color)] opacity-40'}`;

  // For FUNDS_INVESTED stage with progress
  if (stage === InvestmentStage.FUNDS_INVESTED && stageDetail?.fundsProgress) {
    const progress = (stageDetail.fundsProgress.transferredAmount / stageDetail.fundsProgress.totalAmount) * 100;
    return <CircularProgress progress={progress} isCurrent={isCurrent} />;
  }

  switch (stage) {
    case InvestmentStage.PLEDGE:
      return <PaidIcon className={iconClass} />;
    case InvestmentStage.CUSTODIAN:
      return <AccountBalanceIcon className={iconClass} />;
    case InvestmentStage.CAMPAIGN_SUCCESS:
      return <CelebrationIcon className={iconClass} />;
    case InvestmentStage.CAMPAIGN_FAILURE:
      return <ErrorIcon className={iconClass} />;
    case InvestmentStage.FUNDS_INVESTED:
      return <MonetizationOnIcon className={iconClass} />;
    case InvestmentStage.REFUND:
      return <AssignmentReturnIcon className={iconClass} />;
    case InvestmentStage.PERFORMANCE_TRACKING:
      return <ShowChartIcon className={iconClass} />;
    case InvestmentStage.EXIT:
      return <ExitToAppIcon className={iconClass} />;
    default:
      return null;
  }
};

const InvestmentTimeline: React.FC<InvestmentTimelineProps> = ({ stages, currentStage }) => {
  // Filter stages to only show relevant ones based on campaign success/failure
  const relevantStages = stages.reduce((acc: InvestmentStage[], stage) => {
    if (stage.stage === InvestmentStage.CAMPAIGN_FAILURE) {
      // For failed campaigns, show only up to REFUND
      return [
        InvestmentStage.PLEDGE,
        InvestmentStage.CUSTODIAN,
        InvestmentStage.CAMPAIGN_FAILURE,
        InvestmentStage.REFUND
      ];
    } else if (stage.stage === InvestmentStage.CAMPAIGN_SUCCESS) {
      // For successful campaigns, show success path
      return [
        InvestmentStage.PLEDGE,
        InvestmentStage.CUSTODIAN,
        InvestmentStage.CAMPAIGN_SUCCESS,
        InvestmentStage.FUNDS_INVESTED,
        InvestmentStage.PERFORMANCE_TRACKING,
        InvestmentStage.EXIT
      ];
    }
    return acc;
  }, []);

  // If no relevant stages determined yet, show initial stages
  const displayStages = relevantStages.length > 0 ? relevantStages : [
    InvestmentStage.PLEDGE,
    InvestmentStage.CUSTODIAN
  ];

  const currentStageIndex = displayStages.indexOf(currentStage);

  return (
    <div className="mt-3">
      <div className="relative px-2 md:px-4">
        {/* Timeline line */}
        <div className="absolute top-[19px] left-4 right-4 h-[2px] bg-[var(--progress-bg-color)] opacity-30" />
        
        {/* Active line */}
        <div 
          className="absolute top-[19px] left-4 h-[2px] bg-[var(--success-color)] transition-all duration-500"
          style={{
            width: `${((currentStageIndex + 1) / displayStages.length) * (100 - (100/displayStages.length))}%`
          }}
        />
        
        {/* Timeline steps */}
        <div className="relative flex justify-between">
          {displayStages.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = stage === currentStage;
            const stageDetail = stages.find(s => s.stage === stage);

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
                    'bg-[var(--detail-item-bg-color)]'}
                  transition-all duration-300
                  relative
                  ${isCurrent ? 'z-10' : 'z-0'}
                  overflow-visible
                `}>
                  {/* Icon */}
                  <div className={`
                    flex items-center justify-center
                    ${isCurrent ? 'transform scale-100' : ''}
                  `}>
                    <StageIcon stage={stage} stageDetail={stageDetail} isCurrent={isCurrent} />
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
