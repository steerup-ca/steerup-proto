import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { StartupsSelection, LeadInvestor, Startup, Campaign, InvestmentType } from '../types';
import StartupsSelectionCard from './StartupsSelectionCard';
import { mockSelections, mockLeadInvestors, mockStartups, mockCampaigns } from '../mockData';


// Helper function to convert object to array
const objectToArray = (obj: any) => {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return Object.entries(obj).map(([key, value]) => value);
};

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

        // Fetch startups selections from Firebase
        const selectionsQuery = query(collection(db, 'startupsSelections'), orderBy('daysLeft'));
        const selectionsSnapshot = await getDocs(selectionsQuery);
        const selectionsData = selectionsSnapshot.docs.map(doc => {
          const data = doc.data();
          // Convert object fields to arrays if needed
          const campaignsArray = objectToArray(data.campaigns);
          const additionalFundingArray = objectToArray(data.additionalFunding);
          const startupProportionsArray = objectToArray(data.startupProportions);
          
          return {
            id: doc.id,
            ...data,
            campaigns: campaignsArray,
            startupProportions: startupProportionsArray,
            additionalFunding: additionalFundingArray,
            investmentType: data.investmentType || InvestmentType.EQUITY,
            title: data.title || '',
            description: data.description || '',
            selectionLead: data.selectionLead || '',
            goal: data.goal || 0,
            currentAmount: data.currentAmount || 0,
            daysLeft: data.daysLeft || 0,
            backersCount: data.backersCount || 0
          } as StartupsSelection;
        });
        console.log('Fetched selections:', selectionsData);
        setStartupsSelections(selectionsData);

        // Fetch lead investors
        const leadInvestorsSnapshot = await getDocs(collection(db, 'leadInvestors'));
        const leadInvestorsData = leadInvestorsSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() } as LeadInvestor;
          return acc;
        }, {} as { [id: string]: LeadInvestor });
        console.log('Fetched lead investors:', leadInvestorsData);
        setLeadInvestors(leadInvestorsData);

        // Fetch startups
        const startupsSnapshot = await getDocs(collection(db, 'startups'));
        const startupsData = startupsSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() } as Startup;
          return acc;
        }, {} as { [id: string]: Startup });
        console.log('Fetched startups:', startupsData);
        setStartups(startupsData);

        // Fetch campaigns
        const campaignsSnapshot = await getDocs(collection(db, 'campaigns'));
        const campaignsData = campaignsSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() } as Campaign;
          return acc;
        }, {} as { [id: string]: Campaign });
        console.log('Fetched campaigns:', campaignsData);
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
      <div className="container mx-auto px-2">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Explore Startups Selections</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {startupsSelections.length === 0 ? (
            <p className="col-span-full text-center text-gray-400 bg-gray-800 p-6 rounded-lg shadow-md">No startups selections available.</p>
          ) : (
            startupsSelections.map(selection => {
              // Skip if selection doesn't have required data
              if (!selection || !selection.selectionLead) {
                console.warn('Selection missing required data:', selection);
                return null;
              }

              const selectionLeadInvestor = leadInvestors[selection.selectionLead];
              if (!selectionLeadInvestor) {
                console.warn('Lead investor not found for selection:', selection.id);
                return null;
              }

              // Get valid campaigns
              const selectionCampaigns = selection.campaigns
                .filter(id => id && campaigns[id])
                .map(id => campaigns[id])
                .filter(Boolean) as Campaign[];

              // Get startups from valid campaigns
              const selectionStartups = selectionCampaigns
                .filter(campaign => campaign && campaign.startupId && startups[campaign.startupId])
                .map(campaign => startups[campaign.startupId])
                .filter(Boolean) as Startup[];

              // Only require at least one startup
              if (selectionStartups.length === 0) {
                console.warn('No valid startups found for selection:', selection.id);
                return null;
              }

              return (
                <StartupsSelectionCard
                  key={selection.id}
                  selection={{
                    ...selection,
                    additionalFunding: Array.isArray(selection.additionalFunding) 
                      ? selection.additionalFunding 
                      : objectToArray(selection.additionalFunding)
                  }}
                  leadInvestor={selectionLeadInvestor}
                  startups={selectionStartups}
                  campaigns={selectionCampaigns}
                />
              );
            }).filter(Boolean)
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
