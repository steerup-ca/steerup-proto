import React from 'react';
import { Startup } from '../../types';
import '../../styles/theme.css';

interface FeaturedStartupsProps {
  startups: Startup[];
  investmentType: 'equity' | 'debt';
}

const FeaturedStartups: React.FC<FeaturedStartupsProps> = ({ startups, investmentType }) => {
  const accentColor = investmentType === 'equity' ? 'var(--equity-accent-color)' : 'var(--debt-accent-color)';

  return (
    <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="heading-large" style={{ color: accentColor }}>Featured Startups</h2>
        <div className="space-y-6">
          {startups.map((startup) => (
            <div key={startup.id} className="bg-detail-item-bg-color rounded-lg overflow-hidden">
              <div className="p-5">
                <div className="flex items-center mb-3">
                  {startup.imageUrl && (
                    <img 
                      src={startup.imageUrl} 
                      alt={startup.name} 
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                      style={{ borderColor: accentColor, borderWidth: 'var(--border-width)' }}
                    />
                  )}
                  <div>
                    <h3 className="text-large">{startup.name}</h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-3">Founded: {startup.foundedYear}</span>
                      <span>{startup.location}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm mb-4">{startup.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-card-bg-color p-2 rounded" style={{ borderRadius: 'var(--border-radius)' }}>
                    <span className="block text-gray-400">Industry</span>
                    <span className="font-semibold">{startup.industry}</span>
                  </div>
                  <div className="bg-card-bg-color p-2 rounded" style={{ borderRadius: 'var(--border-radius)' }}>
                    <span className="block text-gray-400">Team Size</span>
                    <span className="font-semibold">{startup.teamSize} members</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedStartups;
