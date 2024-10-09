import React from 'react';
import Button from './Button';

const MainContent: React.FC = () => {
  return (
    <main className="main-content">
      <h1>Invest in Canada's Most Promising Startups</h1>
      <p>Expert-curated selections across various industries</p>
      <Button onClick={() => console.log('Get Started clicked')}>Get Started</Button>
    </main>
  );
};

export default MainContent;