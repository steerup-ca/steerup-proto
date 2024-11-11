import React from 'react';
import '../styles/PricingPage.css';

const PricingPage: React.FC = () => {
  return (
    <div className="pricing-container">
      <h1 className="pricing-title">Membership Tiers</h1>
      
      <div className="pricing-cards">
        {/* Member Tier */}
        <div className="pricing-card">
          <h2>Steerup Member</h2>
          <div className="price-range">
            <span className="investment-range">$100 - $1,000</span>
            <span className="per-year">per year</span>
          </div>
          <div className="annual-fee">
            <span className="fee-amount">$10</span>
            <span className="fee-type">Annual Fixed Fee</span>
          </div>
          <ul className="features-list">
            <li>Investment platform access</li>
            <li>Startup selection participation</li>
            <li>Basic portfolio tracking</li>
            <li>Standard reporting</li>
          </ul>
        </div>

        {/* Amplifier Tier */}
        <div className="pricing-card featured">
          <div className="featured-label">Popular Choice</div>
          <h2>Steerup Amplifier</h2>
          <div className="price-range">
            <span className="investment-range">$1,000 - $4,000</span>
            <span className="per-year">per year</span>
          </div>
          <div className="annual-fee">
            <span className="fee-amount">$20</span>
            <span className="fee-type">Annual Fixed Fee</span>
          </div>
          <ul className="features-list">
            <li>All Member features</li>
            <li>Enhanced analytics</li>
            <li>Priority support</li>
            <li>Ability to sell investments to Steerup Accredited</li>
          </ul>
        </div>

        {/* Accredited Tier */}
        <div className="pricing-card">
          <h2>Steerup Accredited</h2>
          <div className="price-range">
            <span className="investment-range">$4,000+</span>
            <span className="per-year">per year</span>
          </div>
          <div className="annual-fee">
            <span className="fee-amount">$80</span>
            <span className="fee-type">Base Annual Fee</span>
            <div className="additional-fees">
              <p>+ 0.5% of invested amount ($4,000-$50,000)</p>
              <p>+ 0.2% of invested amount (above $50,000)</p>
            </div>
          </div>
          <ul className="features-list">
            <li>All Amplifier features</li>
            <li>Ability to buy and sell other investors investments</li>
            <li>Advanced portfolio management</li>
            <li>Premium support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
