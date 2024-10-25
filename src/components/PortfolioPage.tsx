import React from 'react';
import { PortfolioInvestment, PortfolioSummary } from '../types';

const PortfolioPage: React.FC = () => {
  // This would typically come from your data store
  const portfolioSummary: PortfolioSummary = {
    totalInvested: 0,
    totalValue: 0,
    totalRoi: 0,
    investmentCount: 0,
    equityInvestments: 0,
    debtInvestments: 0,
    activeInvestments: 0,
    exitedInvestments: 0
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Portfolio Summary */}
      <div className="bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-[var(--spacing-large)] mb-[var(--spacing-large)] shadow-[var(--box-shadow)]">
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

      {/* Investment Type Distribution */}
      <div className="bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-[var(--spacing-large)] mb-[var(--spacing-large)] shadow-[var(--box-shadow)]">
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

      {/* Regulatory Information */}
      <div className="bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-[var(--spacing-large)] mb-[var(--spacing-large)] shadow-[var(--box-shadow)]">
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

      {/* Empty State */}
      <div className="bg-[var(--card-bg-color)] rounded-[var(--border-radius)] p-[var(--spacing-large)] text-center">
        <h2 className="text-[var(--text-color)] text-[var(--font-size-large)] font-bold mb-[var(--spacing-medium)]">
          No Active Investments
        </h2>
        <p className="text-[var(--text-color)] text-[var(--font-size-medium)] mb-[var(--spacing-large)]">
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
