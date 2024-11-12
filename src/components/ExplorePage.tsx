import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { StartupsSelection, LeadInvestor, Startup, Campaign, InvestmentType } from '../types';
import StartupsSelectionCard from './StartupsSelectionCard';
import { mockSelections, mockLeadInvestors, mockStartups, mockCampaigns } from '../mockData';

// Set to true to use mock data, false to use Firebase
const USE_MOCK_DATA = false;

const ExplorePage: React.FC = () => {
  const [startupsSelections, setStartupsSelections] = useState<StartupsSelection[]>([]);
  const [leadInvestors, setLeadInvestors] = useState<{ [id: string]: LeadInvestor }>({});
  const [startups, setStartups] = useState<{ [id: string]: Startup }>({});
  const [campaigns, setCampaigns] = useState<{ [id: string]: Campaign }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (USE_MOCK_DATA) {
          // Use mock data
          setStartupsSelections(mockSelections);
          setLeadInvestors(mockLeadInvestors);
          setStartups(mockStartups);
          setCampaigns(mockCampaigns);
          setIsLoading(false);
          return;
        }

        // Fetch startups selections from Firebase
        const selectionsQuery = query(collection(db, 'startupsSelections'), orderBy('daysLeft'));
        const selectionsSnapshot = await getDocs(selectionsQuery);
        const selectionsData = selectionsSnapshot.docs.map(doc => {
          const data = doc.data();
          // Ensure investmentType exists, default to EQUITY for existing records
          return {
            id: doc.id,
            ...data,
            investmentType: data.investmentType || InvestmentType.EQUITY
          } as StartupsSelection;
        });
        setStartupsSelections(selectionsData);

        // Fetch lead investors
        const leadInvestorsSnapshot = await getDocs(collection(db, 'leadInvestors'));
        const leadInvestorsData = leadInvestorsSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() } as LeadInvestor;
          return acc;
        }, {} as { [id: string]: LeadInvestor });
        setLeadInvestors(leadInvestorsData);

        // Fetch startups
        const startupsSnapshot = await getDocs(collection(db, 'startups'));
        const startupsData = startupsSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() } as Startup;
          return acc;
        }, {} as { [id: string]: Startup });
        setStartups(startupsData);

        // Fetch campaigns
        const campaignsSnapshot = await getDocs(collection(db, 'campaigns'));
        const campaignsData = campaignsSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() } as Campaign;
          return acc;
        }, {} as { [id: string]: Campaign });
        setCampaigns(campaignsData);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-white">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-500">Error: {error}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Explore Startups Selections</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {startupsSelections.length === 0 ? (
            <p className="col-span-full text-center text-gray-400 bg-gray-800 p-6 rounded-lg shadow-md">No startups selections available.</p>
          ) : (
            startupsSelections.map(selection => {
              const selectionLeadInvestor = leadInvestors[selection.selectionLead];
              const selectionCampaigns = selection.campaigns
                .map(id => campaigns[id])
                .filter(Boolean) as Campaign[];
              const selectionStartups = selectionCampaigns
                .map(campaign => startups[campaign.startupId])
                .filter(Boolean) as Startup[];

              if (!selectionLeadInvestor || selectionStartups.length === 0) {
                return null;
              }

              const isDataComplete = selectionStartups.every(startup => 
                startup.name && startup.description && startup.imageUrl
              );

              if (!isDataComplete) {
                return null;
              }

              return (
                <StartupsSelectionCard
                  key={selection.id}
                  selection={selection}
                  leadInvestor={selectionLeadInvestor}
                  startups={selectionStartups}
                  campaigns={selectionCampaigns}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
