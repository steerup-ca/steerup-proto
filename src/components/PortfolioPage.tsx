import React, { useState } from 'react';
import { PortfolioInvestment, PortfolioSummary, InvestmentStage } from '../types';
import InvestmentTracker from './InvestmentTracker';
import InvestmentTrackerCondensed from './InvestmentTrackerCondensed';
import { Timestamp } from 'firebase/firestore';

const PortfolioPage: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  // Sample investment for demonstration
  const sampleInvestment: PortfolioInvestment = {
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
      currentStage: InvestmentStage.FUNDS_IN_CUSTODY,
      lastUpdated: Timestamp.now(),
      stages: [
        {
          stage: InvestmentStage.INITIATION,
          status: 'completed',
          timestamp: Timestamp.now(),
          message: 'Investment amount selected: $50,000'
        },
        {
          stage: InvestmentStage.CONFIRMATION,
          status: 'completed',
          timestamp: Timestamp.now(),
          message: 'Investment confirmed and payment method verified'
        },
        {
          stage: InvestmentStage.PAYMENT_VALIDATION,
          status: 'completed',
          timestamp: Timestamp.now(),
          message: 'Payment processed and identity verified'
        },
        {
          stage: InvestmentStage.FUNDS_IN_CUSTODY,
          status: 'active',
          timestamp: Timestamp.now(),
          message: 'Funds secured in custodian account, preparing share issuance'
        },
        {
          stage: InvestmentStage.SHARE_ISSUANCE,
          status: 'pending',
          message: 'Awaiting share issuance'
        },
        {
          stage: InvestmentStage.FUNDS_TRANSFER,
          status: 'pending',
          message: 'Pending funds transfer to startup'
        },
        {
          stage: InvestmentStage.FUND_DEPLOYMENT,
          status: 'pending',
          message: 'Awaiting fund deployment'
        },
        {
          stage: InvestmentStage.PERFORMANCE_TRACKING,
          status: 'pending',
          message: 'Performance tracking will begin after fund deployment'
        }
      ]
    }
  };

  const portfolioSummary: PortfolioSummary = {
    totalInvested: 50000,
    totalValue: 55000,
    totalRoi: 10,
    investmentCount: 1,
    equityInvestments: 1,
    debtInvestments: 0,
    activeInvestments: 1,
    exitedInvestments: 0
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Portfolio Summary - Condensed for Mobile */}
      <div className="bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-4 mb-4 shadow-[var(--box-shadow)] md:hidden">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[var(--text-color)] text-[var(--font-size-large)] font-bold">Portfolio</h1>
          <span className="text-[var(--text-color)] text-[var(--font-size-large)] font-bold">
            ${portfolioSummary.totalValue.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-[var(--text-color)] text-[var(--font-size-small)]">
          <span>ROI: {portfolioSummary.totalRoi}%</span>
          <span>{portfolioSummary.activeInvestments} Active</span>
        </div>
      </div>

      {/* Portfolio Summary - Desktop */}
      <div className="hidden md:block bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-[var(--spacing-large)] mb-[var(--spacing-large)] shadow-[var(--box-shadow)]">
        <h1 className="text-[var(--text-color)] text-[var(--font-size-xlarge)] font-bold mb-[var(--spacing-medium)]">
          Investment Portfolio
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--detail-item-bg-color)] p-4 rounded-[var(--border-radius)]">
            <h3 className="text-[var(--text-color)] text-[var(--font-size-small)]">Total Invested</h3>
            <p className="text-[var(--text-color)] text-[var(--font-size-large)] font-bold">
              ${portfolioSummary.totalInvested.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-[var(--detail-item-bg-color)] p-4 rounded-[var(--border-radius)]">
            <h3 className="text-[var(--text-color)] text-[var(--font-size-small)]">Current Value</h3>
            <p className="text-[var(--text-color)] text-[var(--font-size-large)] font-bold">
              ${portfolioSummary.totalValue.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-[var(--detail-item-bg-color)] p-4 rounded-[var(--border-radius)]">
            <h3 className="text-[var(--text-color)] text-[var(--font-size-small)]">Total ROI</h3>
            <p className="text-[var(--text-color)] text-[var(--font-size-large)] font-bold">
              {portfolioSummary.totalRoi}%
            </p>
          </div>
          
          <div className="bg-[var(--detail-item-bg-color)] p-4 rounded-[var(--border-radius)]">
            <h3 className="text-[var(--text-color)] text-[var(--font-size-small)]">Active Investments</h3>
            <p className="text-[var(--text-color)] text-[var(--font-size-large)] font-bold">
              {portfolioSummary.activeInvestments}
            </p>
          </div>
        </div>
      </div>

      {/* Investment Tracker - Toggle between Condensed and Full */}
      <div className="md:hidden">
        <InvestmentTrackerCondensed tracking={sampleInvestment.tracking} />
      </div>
      <div className="hidden md:block">
        <InvestmentTracker tracking={sampleInvestment.tracking} />
      </div>

      {/* Investment Distribution - Condensed for Mobile */}
      <div className="bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-4 my-4 shadow-[var(--box-shadow)] md:hidden">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[var(--text-color)] text-[var(--font-size-small)]">Equity</span>
            <p className="text-[var(--text-color)] font-bold">{portfolioSummary.equityInvestments}</p>
          </div>
          <div className="text-right">
            <span className="text-[var(--text-color)] text-[var(--font-size-small)]">Debt</span>
            <p className="text-[var(--text-color)] font-bold">{portfolioSummary.debtInvestments}</p>
          </div>
        </div>
      </div>

      {/* Investment Distribution - Desktop */}
      <div className="hidden md:block bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-[var(--spacing-large)] my-[var(--spacing-large)] shadow-[var(--box-shadow)]">
        <h2 className="text-[var(--text-color)] text-[var(--font-size-large)] font-bold mb-[var(--spacing-medium)]">
          Investment Distribution
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--detail-item-bg-color)] p-4 rounded-[var(--border-radius)]">
            <h3 className="text-[var(--text-color)] text-[var(--font-size-small)]">Equity Investments</h3>
            <p className="text-[var(--text-color)] text-[var(--font-size-medium)]">
              {portfolioSummary.equityInvestments} investments
            </p>
          </div>
          
          <div className="bg-[var(--detail-item-bg-color)] p-4 rounded-[var(--border-radius)]">
            <h3 className="text-[var(--text-color)] text-[var(--font-size-small)]">Debt Investments</h3>
            <p className="text-[var(--text-color)] text-[var(--font-size-medium)]">
              {portfolioSummary.debtInvestments} investments
            </p>
          </div>
        </div>
      </div>

      {/* Regulatory Information - Mobile Accordion */}
      <div className="md:hidden">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-4 mb-4 text-left shadow-[var(--box-shadow)] flex justify-between items-center"
        >
          <span className="text-[var(--text-color)] font-bold">Regulatory Info</span>
          <span>{showDetails ? '▼' : '▶'}</span>
        </button>
        {showDetails && (
          <div className="bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-4 mb-4 shadow-[var(--box-shadow)]">
            <p className="text-[var(--text-color)] text-[var(--font-size-small)]">
              Compliant with NI 45-110. Investment limits apply based on status.
            </p>
          </div>
        )}
      </div>

      {/* Regulatory Information - Desktop */}
      <div className="hidden md:block bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-[var(--spacing-large)] mb-[var(--spacing-large)] shadow-[var(--box-shadow)]">
        <h2 className="text-[var(--text-color)] text-[var(--font-size-large)] font-bold mb-[var(--spacing-medium)]">
          Regulatory Information
        </h2>
        
        <div className="bg-[var(--detail-item-bg-color)] p-4 rounded-[var(--border-radius)]">
          <p className="text-[var(--text-color)] text-[var(--font-size-small)] mb-2">
            All investments are made in accordance with National Instrument 45-110 - Start-up Crowdfunding Registration and Prospectus Exemptions.
          </p>
          <p className="text-[var(--text-color)] text-[var(--font-size-small)]">
            Investment limits and restrictions apply based on your investor status. Please ensure you understand the risks and limitations before making investment decisions.
          </p>
        </div>
      </div>

      {/* Empty State with Explore CTA */}
      <div className="bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-4 md:p-[var(--spacing-large)] text-center">
        <h2 className="text-[var(--text-color)] text-[var(--font-size-medium)] md:text-[var(--font-size-large)] font-bold mb-2 md:mb-[var(--spacing-medium)]">
          No Active Investments
        </h2>
        <p className="text-[var(--text-color)] text-[var(--font-size-small)] md:text-[var(--font-size-medium)] mb-4 md:mb-[var(--spacing-large)]">
          Start your investment journey by exploring our curated selection of startups.
        </p>
        <a 
          href="/explore" 
          className="inline-block bg-[var(--primary-color)] text-[var(--button-text-color)] px-6 py-2 rounded-[var(--button-border-radius)] hover:opacity-90 transition-opacity"
        >
          Explore Opportunities
        </a>
      </div>
    </div>
  );
};

export default PortfolioPage;
