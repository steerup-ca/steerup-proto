import React from 'react';
import Button from './Button';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <section className="hero">
        <h1>Invest in Canada's Most Promising Startups</h1>
        <p>Expert-curated selections across various industries</p>
        <Button>Get Started</Button>
      </section>

      <section className="features">
        <h2>Why Choose SteerUp</h2>
        <div className="feature-grid">
          <div className="feature">
            <h3>Expert-Led</h3>
            <p>Selections curated by industry leaders</p>
          </div>
          <div className="feature">
            <h3>Growth Potential</h3>
            <p>Access to high-growth Canadian startups</p>
          </div>
          <div className="feature">
            <h3>Secure Platform</h3>
            <p>Fully compliant with Canadian regulations</p>
          </div>
          <div className="feature">
            <h3>Diverse Opportunities</h3>
            <p>Invest across various sectors and stages</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Steer Your Investments Up?</h2>
        <p>Join SteerUp today and be part of Canada's startup success stories.</p>
        <Button>Create an Account</Button>
      </section>

      <footer>
        © 2024 SteerUp. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;