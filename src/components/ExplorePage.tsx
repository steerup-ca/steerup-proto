import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { StartupsSelection, LeadInvestor, Startup } from '../types';
import StartupsSelectionCard from './StartupsSelectionCard';
import './ExplorePage.css';

const ExplorePage: React.FC = () => {
  const [startupsSelections, setStartupsSelections] = useState<StartupsSelection[]>([]);
  const [leadInvestors, setLeadInvestors] = useState<{ [id: string]: LeadInvestor }>({});
  const [startups, setStartups] = useState<{ [id: string]: Startup }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch startups selections
        const selectionsQuery = query(collection(db, 'startupsSelections'), orderBy('daysLeft'));
        const selectionsSnapshot = await getDocs(selectionsQuery);
        const selectionsData = selectionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StartupsSelection));
        setStartupsSelections(selectionsData);
        console.log('Fetched startups selections:', selectionsData);

        // Fetch lead investors
        const leadInvestorsSnapshot = await getDocs(collection(db, 'leadInvestors'));
        const leadInvestorsData = leadInvestorsSnapshot.docs.reduce((acc, doc) => {
          const investorData = { id: doc.id, ...doc.data() } as LeadInvestor;
          acc[doc.id] = investorData;
          console.log(`Lead Investor ${doc.id}:`, JSON.stringify(investorData, null, 2));
          if (!investorData.photo) {
            console.warn(`Missing photo for lead investor ${doc.id}`);
          }
          return acc;
        }, {} as { [id: string]: LeadInvestor });
        setLeadInvestors(leadInvestorsData);
        console.log('Fetched lead investors:', leadInvestorsData);

        // Fetch startups
        const startupsSnapshot = await getDocs(collection(db, 'startups'));
        const startupsData = startupsSnapshot.docs.reduce((acc, doc) => {
          const startupData = { id: doc.id, ...doc.data() } as Startup;
          acc[doc.id] = startupData;
          console.log(`Startup ${doc.id}:`, JSON.stringify(startupData, null, 2));
          if (!startupData.imageUrl) {
            console.warn(`Missing imageUrl for startup ${doc.id}`);
          }
          return acc;
        }, {} as { [id: string]: Startup });
        setStartups(startupsData);
        console.log('Fetched startups:', startupsData);

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
    return <div className="explore-page"><h1>Loading...</h1></div>;
  }

  if (error) {
    return <div className="explore-page"><h1>Error: {error}</h1></div>;
  }

  return (
    <div className="explore-page">
      <h1 className="explore-title">Explore Startups Selections</h1>
      <div className="startups-selections-list">
        {startupsSelections.length === 0 ? (
          <p className="no-selections">No startups selections available.</p>
        ) : (
          startupsSelections.map(selection => {
            const selectionLeadInvestor = leadInvestors[selection.selectionLead];
            const selectionStartups = selection.startups
              .map(id => startups[id])
              .filter(Boolean) as Startup[];

            console.log(`Rendering selection ${selection.id}:`);
            console.log('Lead Investor:', JSON.stringify(selectionLeadInvestor, null, 2));
            console.log('Startups:', JSON.stringify(selectionStartups, null, 2));

            if (!selectionLeadInvestor || selectionStartups.length === 0) {
              console.warn(`Incomplete data for selection ${selection.id}`);
              return null;
            }

            return (
              <StartupsSelectionCard
                key={selection.id}
                selection={selection}
                leadInvestor={selectionLeadInvestor}
                startups={selectionStartups}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ExplorePage;