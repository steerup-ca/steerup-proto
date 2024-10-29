import React, { useState } from 'react';
import { PortfolioInvestment, PortfolioSummary, InvestmentStage } from '../types';
import InvestmentTimeline from './InvestmentTimeline';
import SecurityDocumentModal from './SecurityDocumentModal';
import { Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Stage names for the status display
const stageNames: { [key in InvestmentStage]: string } = {
  [InvestmentStage.PLEDGE]: 'Pledged',
  [InvestmentStage.CUSTODIAN]: 'In Custody',
  [InvestmentStage.CAMPAIGN_SUCCESS]: 'Campaign Successful',
  [InvestmentStage.CAMPAIGN_FAILURE]: 'Campaign Failed',
  [InvestmentStage.FUNDS_INVESTED]: 'Funds Being Invested',
  [InvestmentStage.REFUND]: 'Refund Initiated',
  [InvestmentStage.PERFORMANCE_TRACKING]: 'Performance Tracking',
  [InvestmentStage.EXIT]: 'Investment Exited'
};

const PortfolioPage: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSecurity, setSelectedSecurity] = useState<{
    isOpen: boolean;
    url?: string;
    startupName?: string;
  }>({ isOpen: false });
  const navigate = useNavigate();

  // Sample investments for demonstration
  const sampleInvestments: PortfolioInvestment[] = [
    {
      id: '1',
      userId: 'user1',
      selectionId: 'selection1',
      startupId: 'startup1',
      investmentDate: Timestamp.now(),
      amount: 50000,
      type: 'equity',
      terms: {
        equity: {
          percentageOwned: 2.5,
          shareClass: 'Common'
        }
      },
      status: 'active',
      performance: {
        currentValue: 55000,
        roi: 10,
        lastValuationDate: Timestamp.now()
      },
      tracking: {
        currentStage: InvestmentStage.FUNDS_INVESTED,
        lastUpdated: Timestamp.now(),
        stages: [
          {
            stage: InvestmentStage.PLEDGE,
            status: 'completed',
            timestamp: Timestamp.now(),
            message: 'Investment pledged: $50,000'
          },
          {
            stage: InvestmentStage.CUSTODIAN,
            status: 'completed',
            timestamp: Timestamp.now(),
            message: 'Funds secured in custodian account'
          },
          {
            stage: InvestmentStage.CAMPAIGN_SUCCESS,
            status: 'completed',
            timestamp: Timestamp.now(),
            message: 'Campaign successfully reached its goal'
          },
          {
            stage: InvestmentStage.FUNDS_INVESTED,
            status: 'active',
            timestamp: Timestamp.now(),
            message: 'Funds transfer in progress (50% complete). Equivalent securities are being purchased as funds are transferred.',
            fundsProgress: {
              totalAmount: 50000,
              transferredAmount: 25000,
              lastTransferDate: Timestamp.now(),
              transferHistory: [
                {
                  amount: 25000,
                  date: Timestamp.now(),
                  description: 'First tranche released with equivalent securities purchased'
                }
              ]
            }
          }
        ]
      }
    },
    {
      id: '2',
      userId: 'user1',
      selectionId: 'selection2',
      startupId: 'startup2',
      investmentDate: Timestamp.now(),
      amount: 25000,
      type: 'equity',
      terms: {
        equity: {
          percentageOwned: 1.2,
          shareClass: 'Preferred'
        }
      },
      status: 'active',
      performance: {
        currentValue: 30000,
        roi: 20,
        lastValuationDate: Timestamp.now()
      },
      tracking: {
        currentStage: InvestmentStage.PERFORMANCE_TRACKING,
        lastUpdated: Timestamp.now(),
        stages: [
          {
            stage: InvestmentStage.PLEDGE,
            status: 'completed',
            timestamp: Timestamp.now(),
            message: 'Investment pledged: $25,000'
          },
          {
            stage: InvestmentStage.CUSTODIAN,
            status: 'completed',
            timestamp: Timestamp.now(),
            message: 'Funds secured in custodian account'
          },
          {
            stage: InvestmentStage.CAMPAIGN_SUCCESS,
            status: 'completed',
            timestamp: Timestamp.now(),
            message: 'Campaign successfully reached its goal'
          },
          {
            stage: InvestmentStage.FUNDS_INVESTED,
            status: 'completed',
            timestamp: Timestamp.now(),
            message: 'Funds transfer complete (100%). All equivalent securities have been purchased.',
            fundsProgress: {
              totalAmount: 25000,
              transferredAmount: 25000,
              lastTransferDate: Timestamp.now(),
              transferHistory: [
                {
                  amount: 25000,
                  date: Timestamp.now(),
                  description: 'Full amount transferred with all equivalent securities purchased'
                }
              ]
            }
          },
          {
            stage: InvestmentStage.PERFORMANCE_TRACKING,
            status: 'active',
            timestamp: Timestamp.now(),
            message: 'Investment performing well, +20% ROI achieved'
          }
        ]
      }
    },
    {
      id: '3',
      userId: 'user1',
      selectionId: 'selection3',
      startupId: 'startup3',
      investmentDate: Timestamp.now(),
      amount: 75000,
      type: 'equity',
      terms: {
        equity: {
          percentageOwned: 3.5,
          shareClass: 'Common'
        }
      },
      status: 'active',
      performance: {
        currentValue: 72000,
        roi: -4,
        lastValuationDate: Timestamp.now()
      },
      tracking: {
        currentStage: InvestmentStage.CAMPAIGN_FAILURE,
        lastUpdated: Timestamp.now(),
        stages: [
          {
            stage: InvestmentStage.PLEDGE,
            status: 'completed',
            timestamp: Timestamp.now(),
            message: 'Investment pledged: $75,000'
          },
          {
            stage: InvestmentStage.CUSTODIAN,
            status: 'completed',
            timestamp: Timestamp.now(),
            message: 'Funds secured in custodian account'
          },
          {
            stage: InvestmentStage.CAMPAIGN_FAILURE,
            status: 'active',
            timestamp: Timestamp.now(),
            message: 'Campaign did not reach its goal'
          }
        ]
      }
    }
  ];

  const portfolioSummary: PortfolioSummary = {
    totalInvested: 150000,
    totalValue: 157000,
    totalRoi: 4.67,
    investmentCount: 3,
    equityInvestments: 3,
    debtInvestments: 0,
    activeInvestments: 3,
    exitedInvestments: 0
  };

  // Sample startup data
  const startupInfo: { [key: string]: { name: string, industry: string, securityDocument?: string }} = {
    'startup1': { 
      name: 'TechFlow AI', 
      industry: 'Artificial Intelligence',
      securityDocument: '/documents/techflow-security.pdf'
    },
    'startup2': { 
      name: 'GreenEnergy Solutions', 
      industry: 'Clean Technology',
      securityDocument: '/documents/greenenergy-security.pdf'
    },
    'startup3': { 
      name: 'HealthTech Innovations', 
      industry: 'Healthcare Technology',
      securityDocument: '/documents/healthtech-security.pdf'
    }
  };

  // Calculate sector distribution
  const sectorDistribution = sampleInvestments.reduce((acc: { [key: string]: number }, investment) => {
    const sector = startupInfo[investment.startupId].industry;
    acc[sector] = (acc[sector] || 0) + investment.amount;
    return acc;
  }, {});

  const handleInvestmentClick = (investmentId: string) => {
    navigate(`/portfolio/investment/${investmentId}`);
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderROI = (investment: PortfolioInvestment) => {
    const isTrackingStage = investment.tracking.stages.some(
      s => s.stage === InvestmentStage.PERFORMANCE_TRACKING && s.status !== 'pending'
    );

    if (!isTrackingStage) {
      return (
        <div className="text-[var(--text-color)] text-[var(--font-size-small)] opacity-40">
          ROI tracking starts after investment
        </div>
      );
    }

    return (
      <div className={`text-[var(--font-size-small)] font-medium ${
        investment.performance.roi >= 0 ? 'text-[var(--success-color)]' : 'text-red-500'
      }`}>
        {investment.performance.roi > 0 ? '+' : ''}{investment.performance.roi}% ROI
      </div>
    );
  };

  const renderSecurityDocumentLink = (investment: PortfolioInvestment, startupId: string) => {
    const isFundsInvestedOrTracking = investment.tracking.currentStage === InvestmentStage.FUNDS_INVESTED || 
                                     investment.tracking.currentStage === InvestmentStage.PERFORMANCE_TRACKING;
    const securityDocument = startupInfo[startupId]?.securityDocument;
    const startupName = startupInfo[startupId]?.name;

    if (!isFundsInvestedOrTracking || !securityDocument) return null;

    return (
      <button
        onClick={() => setSelectedSecurity({ 
          isOpen: true, 
          url: securityDocument,
          startupName: startupName
        })}
        className="flex items-center gap-1 bg-[var(--detail-item-bg-color)] text-[var(--text-color)] px-2 py-1 rounded-[var(--button-border-radius)] hover:bg-[var(--primary-color)] hover:text-[var(--button-text-color)] transition-all text-[var(--font-size-xsmall)] border border-[var(--primary-color)] border-opacity-30 mb-2"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <span>View Purchased Securities</span>
      </button>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Portfolio Summary Dashboard */}
      <div className="bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-6 mb-8 shadow-[var(--box-shadow)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Value & ROI */}
          <div className="bg-[var(--detail-item-bg-color)] p-4 rounded-[var(--border-radius)]">
            <h3 className="text-[var(--text-color)] text-[var(--font-size-small)] opacity-60 mb-2">Portfolio Value</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-[var(--text-color)] text-[var(--font-size-xlarge)] font-bold">
                ${portfolioSummary.totalValue.toLocaleString()}
              </span>
              <span className={`text-[var(--font-size-small)] font-medium ${
                portfolioSummary.totalRoi >= 0 ? 'text-[var(--success-color)]' : 'text-red-500'
              }`}>
                {portfolioSummary.totalRoi > 0 ? '+' : ''}{portfolioSummary.totalRoi.toFixed(2)}%
              </span>
            </div>
            <div className="text-[var(--text-color)] text-[var(--font-size-small)] opacity-60 mt-1">
              Initial Investment: ${portfolioSummary.totalInvested.toLocaleString()}
            </div>
          </div>

          {/* Investment Distribution */}
          <div className="bg-[var(--detail-item-bg-color)] p-4 rounded-[var(--border-radius)]">
            <h3 className="text-[var(--text-color)] text-[var(--font-size-small)] opacity-60 mb-2">Investment Mix</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[var(--text-color)] text-[var(--font-size-medium)] font-bold">
                  {portfolioSummary.equityInvestments}
                </div>
                <div className="text-[var(--text-color)] text-[var(--font-size-small)] opacity-60">Equity</div>
              </div>
              <div>
                <div className="text-[var(--text-color)] text-[var(--font-size-medium)] font-bold">
                  {portfolioSummary.debtInvestments}
                </div>
                <div className="text-[var(--text-color)] text-[var(--font-size-small)] opacity-60">Debt</div>
              </div>
            </div>
          </div>

          {/* Sector Distribution */}
          <div className="bg-[var(--detail-item-bg-color)] p-4 rounded-[var(--border-radius)]">
            <h3 className="text-[var(--text-color)] text-[var(--font-size-small)] opacity-60 mb-2">Sector Allocation</h3>
            <div className="space-y-2">
              {Object.entries(sectorDistribution).map(([sector, amount]) => (
                <div key={sector} className="flex justify-between items-center">
                  <span className="text-[var(--text-color)] text-[var(--font-size-small)]">{sector}</span>
                  <span className="text-[var(--text-color)] text-[var(--font-size-small)] font-medium">
                    {((amount / portfolioSummary.totalInvested) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Status */}
          <div className="bg-[var(--detail-item-bg-color)] p-4 rounded-[var(--border-radius)]">
            <h3 className="text-[var(--text-color)] text-[var(--font-size-small)] opacity-60 mb-2">Portfolio Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[var(--text-color)] text-[var(--font-size-medium)] font-bold">
                  {portfolioSummary.activeInvestments}
                </div>
                <div className="text-[var(--text-color)] text-[var(--font-size-small)] opacity-60">Active</div>
              </div>
              <div>
                <div className="text-[var(--text-color)] text-[var(--font-size-medium)] font-bold">
                  {portfolioSummary.exitedInvestments}
                </div>
                <div className="text-[var(--text-color)] text-[var(--font-size-small)] opacity-60">Exited</div>
              </div>
            </div>
            <div className="mt-2 text-[var(--text-color)] text-[var(--font-size-small)] opacity-60">
              {portfolioSummary.investmentCount} Total Investments
            </div>
          </div>
        </div>
      </div>

      {/* Investment List */}
      <div className="space-y-6">
        {sampleInvestments.map((investment) => {
          const currentStageDetail = investment.tracking.stages.find(s => s.stage === investment.tracking.currentStage);
          
          return (
            <div 
              key={investment.id}
              className="bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-4 shadow-[var(--box-shadow)]"
            >
              {/* Primary Information */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[var(--text-color)] text-[var(--font-size-medium)] font-bold mb-1">
                    {startupInfo[investment.startupId].name}
                  </h3>
                  <div className="text-[var(--text-color)] text-[var(--font-size-small)] opacity-60">
                    {startupInfo[investment.startupId].industry}
                  </div>
                </div>
                <div className="text-right">
                  {renderSecurityDocumentLink(investment, investment.startupId)}
                  <div className="text-[var(--text-color)] text-[var(--font-size-medium)] font-bold">
                    ${investment.amount.toLocaleString()}
                  </div>
                  {renderROI(investment)}
                </div>
              </div>

              {/* Secondary Information */}
              <div className="grid grid-cols-4 gap-4 mb-6 mt-6">
                <div className="bg-[var(--detail-item-bg-color)] p-3 rounded-[var(--border-radius)]">
                  <div className="text-[var(--text-color)] text-[var(--font-size-xsmall)] opacity-60 mb-1">
                    Investment
                  </div>
                  <div className="text-[var(--text-color)] font-medium">
                    ${investment.amount.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[var(--detail-item-bg-color)] p-3 rounded-[var(--border-radius)]">
                  <div className="text-[var(--text-color)] text-[var(--font-size-xsmall)] opacity-60 mb-1">
                    Ownership
                  </div>
                  <div className="text-[var(--text-color)] font-medium">
                    {investment.terms.equity?.percentageOwned}%
                  </div>
                </div>
                <div className="bg-[var(--detail-item-bg-color)] p-3 rounded-[var(--border-radius)]">
                  <div className="text-[var(--text-color)] text-[var(--font-size-xsmall)] opacity-60 mb-1">
                    Date
                  </div>
                  <div className="text-[var(--text-color)] font-medium">
                    {formatDate(investment.investmentDate)}
                  </div>
                </div>
                <div className={`p-3 rounded-[var(--border-radius)] transition-all duration-300
                  ${currentStageDetail?.status === 'active' ? 
                    'bg-[#9c27b0] bg-opacity-[0.15]' : 
                    'bg-[var(--detail-item-bg-color)]'}`}>
                  <div className={`text-[var-size-xsmall)] mb-1 ${
                    currentStageDetail?.status === 'active' ? 
                    'text-[#9c27b0] opacity-90' : 
                    'text-[var(--text-color)] opacity-60'
                  }`}>
                    Status
                  </div>
                  <div className={`font-medium ${
                    currentStageDetail?.status === 'active' ? 
                    'text-white' : 
                    'text-[var(--text-color)]'
                  }`}>
                    {stageNames[investment.tracking.currentStage]}
                  </div>
                </div>
              </div>

              {/* Status Message */}
              {currentStageDetail && (
                <div className="mb-2 text-[var(--text-color)] text-[var(--font-size-small)] opacity-80">
                  {currentStageDetail.message}
                </div>
              )}

              {/* Investment Timeline */}
              <InvestmentTimeline 
                stages={investment.tracking.stages}
                currentStage={investment.tracking.currentStage}
              />
            </div>
          );
        })}
      </div>

      {/* Security Document Modal */}
      <SecurityDocumentModal
        isOpen={selectedSecurity.isOpen}
        onClose={() => setSelectedSecurity({ isOpen: false })}
        documentUrl={selectedSecurity.url || ''}
        startupName={selectedSecurity.startupName || ''}
      />
    </div>
  );
};

export default PortfolioPage;
