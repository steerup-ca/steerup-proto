import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StartupsSelection, LeadInvestor, Startup, Campaign } from '../types';

interface StartupsSelectionCardProps {
  selection: StartupsSelection;
  leadInvestor?: LeadInvestor;
  startups: Startup[];
  campaigns: Campaign[];
}

const StartupsSelectionCard: React.FC<StartupsSelectionCardProps> = ({ selection, leadInvestor, startups, campaigns }) => {
  const navigate = useNavigate();
  const totalGoal = campaigns.reduce((sum, campaign) => sum + campaign.steerup_amount, 0);
  const progressPercentage = (selection.currentAmount / totalGoal) * 100;

  const handleCoInvest = () => {
    navigate(`/co-invest/${selection.id}`);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{selection.title}</h2>
            <p className="text-sm text-gray-400">Immersive Gaming Experience</p>
          </div>
        </div>

        {leadInvestor && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white mb-2">SELECTION LEAD</h3>
            <Link to={`/lead-investor/${leadInvestor.id}`} className="block hover:bg-gray-700 rounded-lg transition duration-300">
              <div className="flex items-center p-2">
                <img src={leadInvestor.photo} alt={leadInvestor.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="text-white font-semibold">{leadInvestor.name}</p>
                  <p className="text-sm text-gray-400">{leadInvestor.bio}</p>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="space-y-4 mb-4">
          {startups.map(startup => (
            <Link key={startup.id} to={`/startup/${startup.id}`} className="block hover:opacity-90 transition duration-300">
              <div className="relative h-32 rounded-lg overflow-hidden">
                <img src={startup.imageUrl} alt={startup.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <h4 className="text-white font-semibold text-shadow">{startup.name}</h4>
                  <p className="text-sm text-gray-200 text-shadow">{startup.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-white mb-1">
            <span>Goal: ${totalGoal.toLocaleString()}</span>
            <span>${selection.currentAmount.toLocaleString()}</span>
          </div>
          <div className="bg-gray-700 rounded-full h-2 mb-1">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{progressPercentage.toFixed(0)}%</span>
            <span>{selection.daysLeft} DAYS LEFT • {selection.backersCount} BACKERS</span>
          </div>
        </div>

        <button 
          onClick={handleCoInvest}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          Co-invest
        </button>

        {selection.additionalFunding.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-white mb-2">ADDITIONAL FUNDING</h3>
            <div className="space-y-2">
              {selection.additionalFunding.map((funding, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-700 rounded p-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-600 rounded-full mr-2"></div>
                    <span className="text-white">{funding.name}</span>
                  </div>
                  <span className="text-green-500 font-semibold">${funding.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupsSelectionCard;
