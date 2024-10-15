import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StartupsSelection, LeadInvestor, Startup, Investment, Campaign } from '../types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface StartupsSelectionCardProps {
  selection: StartupsSelection;
  leadInvestor: LeadInvestor;
  startups: Startup[];
  campaigns: Campaign[];
}

const StartupsSelectionCard: React.FC<StartupsSelectionCardProps> = ({ selection, leadInvestor, startups, campaigns }) => {
  const [totalRaised, setTotalRaised] = useState<number>(0);
  const [backersCount, setBackersCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvestmentData = async () => {
      try {
        const investmentsQuery = query(collection(db, 'investments'), where('selectionId', '==', selection.id));
        const investmentsSnap = await getDocs(investmentsQuery);
        const investments = investmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Investment);

        const total = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const uniqueBackers = new Set(investments.map(inv => inv.userId)).size;

        setTotalRaised(total);
        setBackersCount(uniqueBackers);
      } catch (error) {
        console.error('Error fetching investment data:', error);
      }
    };

    fetchInvestmentData();
  }, [selection.id]);

  const progressPercentage = (totalRaised / selection.goal) * 100;

  const handleCoInvest = () => {
    navigate(`/co-invest/${selection.id}`);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg" style={{
      background: 'linear-gradient(to bottom, #3a4a5c, #1f2937)'
    }}>
      <div className="p-6 relative">
        <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">{selection.title}</h2>
        
        <div className="mb-6">
          <h3 className="text-base font-semibold mb-2 text-gray-300">SELECTION LEAD</h3>
          <Link to={`/lead-investor/${leadInvestor.id}`} className="flex items-center">
            <img src={leadInvestor.photo} alt={leadInvestor.name} className="w-12 h-12 rounded-full mr-4" />
            <div>
              <p className="font-semibold text-white">{leadInvestor.name}</p>
              <p className="text-sm text-gray-300">{leadInvestor.bio}</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {startups.map((startup) => (
            <Link key={startup.id} to={`/startup/${startup.id}`} className="relative overflow-hidden rounded-lg" style={{ height: '160px' }}>
              <img src={startup.imageUrl} alt={startup.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h4 className="font-semibold text-white text-lg mb-1">{startup.name}</h4>
                  <p className="text-xs text-gray-300 line-clamp-2">{startup.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2 text-white">
            <span>Goal: ${selection.goal.toLocaleString()}</span>
            <span>${totalRaised.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm mt-2 text-gray-300">
            <span>{progressPercentage.toFixed(0)}%</span>
            <span>{backersCount} BACKERS • {selection.daysLeft} DAYS LEFT</span>
          </div>
        </div>

        <button 
          onClick={handleCoInvest}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold mb-6 hover:bg-purple-700 transition-colors duration-200 text-lg"
        >
          Co-invest
        </button>

        <div>
          <h3 className="text-base font-semibold mb-2 text-gray-300">ADDITIONAL FUNDING</h3>
          {selection.additionalFunding.map((funding, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-3 flex justify-between items-center mb-2">
              <span className="text-white">{funding.name}</span>
              <span className="text-green-500">${funding.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartupsSelectionCard;
