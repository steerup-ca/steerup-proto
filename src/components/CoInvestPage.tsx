import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { StartupsSelection, Campaign, Startup } from '../types';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const CoInvestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [selection, setSelection] = useState<StartupsSelection | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        // Fetch selection
        const selectionRef = doc(db, 'startupsSelections', id);
        const selectionSnap = await getDoc(selectionRef);
        if (selectionSnap.exists()) {
          const selectionData = { id: selectionSnap.id, ...selectionSnap.data() } as StartupsSelection;
          setSelection(selectionData);

          // Fetch campaigns
          const campaignsQuery = query(collection(db, 'campaigns'), where('id', 'in', selectionData.campaigns));
          const campaignsSnap = await getDocs(campaignsQuery);
          const campaignsData = campaignsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Campaign);
          setCampaigns(campaignsData);

          // Fetch startups
          const startupPromises = campaignsData.map(campaign => 
            getDoc(doc(db, 'startups', campaign.startupId))
          );
          const startupSnaps = await Promise.all(startupPromises);
          const startupsData = startupSnaps.map(snap => ({ id: snap.id, ...snap.data() }) as Startup);
          setStartups(startupsData);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-color">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-color"></div>
      </div>
    );
  }

  if (!selection) {
    return <div className="text-center text-2xl mt-10 text-text-color">Selection not found</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the investment data to your backend
    console.log(`Investment of $${investmentAmount} submitted for selection ${id}`);
    // Navigate back to the main page or a confirmation page
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-background-color text-text-color">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary-color">{selection.title}</h1>
      
      <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary-color">Investment Summary</h2>
          <p className="mb-4">You are about to co-invest in a selection of promising startups curated by expert investors. This investment represents equity in the following companies:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {startups.map((startup, index) => (
              <div key={index} className="bg-detail-item-bg-color p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{startup.name}</h3>
                <p className="text-sm">{startup.description}</p>
              </div>
            ))}
          </div>
          <p className="mb-4">By co-investing, you'll receive equity proportional to your investment amount in each of these startups.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-detail-item-bg-color p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-1">Current Total Raised</h4>
              <p className="text-2xl font-bold">${selection.currentAmount.toLocaleString()}</p>
            </div>
            <div className="bg-detail-item-bg-color p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-1">Number of Backers</h4>
              <p className="text-2xl font-bold">{selection.backersCount}</p>
            </div>
            <div className="bg-detail-item-bg-color p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-1">Days Left in Campaign</h4>
              <p className="text-2xl font-bold">{selection.daysLeft}</p>
            </div>
          </div>
          <div className="mb-4">
            <Link to={`/prospectus/${id}`} className="text-link-color hover:text-primary-color underline">
              View Full Prospectus
            </Link>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary-color">Make Your Investment</h2>
          <div className="mb-4">
            <label htmlFor="investmentAmount" className="block text-sm font-medium mb-2">
              Investment Amount ($)
            </label>
            <input
              type="number"
              id="investmentAmount"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              className="w-full px-3 py-2 bg-detail-item-bg-color border border-secondary-color rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color text-text-color"
              required
              min="1"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-color text-button-text-color py-2 px-4 rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-opacity-50 transition duration-200"
          >
            Confirm Co-investment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CoInvestPage;
