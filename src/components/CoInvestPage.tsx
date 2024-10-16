import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { StartupsSelection, Campaign, Startup, LeadInvestor, Investment } from '../types';
import { doc, getDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import InvestmentModal from './InvestmentModal';

const CoInvestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [selection, setSelection] = useState<StartupsSelection | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [selectionLead, setSelectionLead] = useState<LeadInvestor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<'processing' | 'completed' | 'failed'>('processing');

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          // Fetch selection, campaigns, startups, and selection lead
          const selectionRef = doc(db, 'startupsSelections', id);
          const selectionSnap = await getDoc(selectionRef);
          if (selectionSnap.exists()) {
            const selectionData = { id: selectionSnap.id, ...selectionSnap.data() } as StartupsSelection;
            setSelection(selectionData);

            const campaignPromises = selectionData.campaigns.map(campaignId => 
              getDoc(doc(db, 'campaigns', campaignId))
            );
            const campaignSnaps = await Promise.all(campaignPromises);
            const campaignsData = campaignSnaps
              .filter(snap => snap.exists())
              .map(snap => ({ id: snap.id, ...snap.data() }) as Campaign);
            setCampaigns(campaignsData);

            const startupIds = campaignsData.map(campaign => campaign.startupId);
            const startupPromises = startupIds.map(startupId => 
              getDoc(doc(db, 'startups', startupId))
            );
            const startupSnaps = await Promise.all(startupPromises);
            const startupsData = startupSnaps
              .filter(snap => snap.exists())
              .map(snap => ({ id: snap.id, ...snap.data() }) as Startup);
            setStartups(startupsData);

            if (selectionData.selectionLead) {
              const leadRef = doc(db, 'leadInvestors', selectionData.selectionLead);
              const leadSnap = await getDoc(leadRef);
              if (leadSnap.exists()) {
                setSelectionLead({ id: leadSnap.id, ...leadSnap.data() } as LeadInvestor);
              }
            }
          } else {
            setError('Selection not found');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Error fetching data. Please try again.');
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setInvestmentAmount(value);
    }
  };

  const handlePresetAmount = (amount: number) => {
    setInvestmentAmount(amount.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
    setModalStatus('processing');

    try {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (id && selection) {
        const amount = parseInt(investmentAmount);
        
        // Add the investment to the database
        const newInvestment: Omit<Investment, 'id'> = {
          date: Timestamp.now(),
          amount: amount,
          selectionId: id,
          userId: 'current-user-id', // Replace with actual user ID when authentication is implemented
          status: 'completed'
        };

        const docRef = await addDoc(collection(db, 'investments'), newInvestment);

        // Update the local state to reflect the investment
        setSelection(prevSelection => {
          if (prevSelection) {
            return {
              ...prevSelection,
              currentAmount: prevSelection.currentAmount + amount,
              backersCount: prevSelection.backersCount + 1
            };
          }
          return prevSelection;
        });

        setModalStatus('completed');
      } else {
        throw new Error('Invalid selection or ID');
      }
    } catch (error) {
      console.error('Error processing investment:', error);
      setModalStatus('failed');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (modalStatus === 'completed') {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-color">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-color"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-2xl mt-10 text-text-color">{error}</div>;
  }

  if (!selection) {
    return <div className="text-center text-2xl mt-10 text-text-color">Selection not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background-color text-text-color">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary-color">{selection.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Investment Form, Summary, and Additional Funding */}
        <div className="space-y-8">
          {/* Investment Form */}
          <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary-color">Make Your Investment</h2>
              <p className="mb-4">By co-investing, you'll receive equity proportional to your investment amount in these startups.</p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="investmentAmount" className="block text-sm font-medium mb-2">
                    Investment Amount ($)
                  </label>
                  <input
                    type="text"
                    id="investmentAmount"
                    value={investmentAmount}
                    onChange={handleInvestmentChange}
                    className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-color"
                    required
                    pattern="\d*"
                    inputMode="numeric"
                    placeholder="Enter amount"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: '1px solid #4a5568',
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[500, 1000, 5000, 10000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handlePresetAmount(amount)}
                      className="bg-secondary-color text-button-text-color py-1 px-3 rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-opacity-50 transition duration-200"
                    >
                      ${amount.toLocaleString()}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-color text-button-text-color py-2 px-4 rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-opacity-50 transition duration-200"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    color: 'var(--button-text-color)',
                    borderRadius: 'var(--button-border-radius)',
                  }}
                >
                  Confirm Co-investment
                </button>
              </form>
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary-color">Investment Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-detail-item-bg-color p-4 rounded-lg text-center">
                  <h4 className="text-sm font-semibold mb-1">Total Raised</h4>
                  <p className="text-2xl font-bold text-primary-color">${selection.currentAmount.toLocaleString()}</p>
                </div>
                <div className="bg-detail-item-bg-color p-4 rounded-lg text-center">
                  <h4 className="text-sm font-semibold mb-1">Backers</h4>
                  <p className="text-2xl font-bold text-primary-color">{selection.backersCount}</p>
                </div>
                <div className="bg-detail-item-bg-color p-4 rounded-lg text-center">
                  <h4 className="text-sm font-semibold mb-1">Days Left</h4>
                  <p className="text-2xl font-bold text-primary-color">{selection.daysLeft}</p>
                </div>
                <div className="bg-detail-item-bg-color p-4 rounded-lg text-center">
                  <h4 className="text-sm font-semibold mb-1">Goal</h4>
                  <p className="text-2xl font-bold text-primary-color">${selection.goal.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Funding Section */}
          <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary-color">Additional Funding</h2>
              <ul className="space-y-2">
                {selection.additionalFunding.map((funding, index) => (
                  <li key={index} className="bg-detail-item-bg-color p-3 rounded-lg">
                    <span className="font-semibold">{funding.name}</span>: {funding.description}
                    <span className="block mt-1 text-primary-color font-bold">${funding.amount.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Startups and Selection Lead */}
        <div className="space-y-8">
          {/* Startups Section */}
          <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary-color">Featured Startups</h2>
              <div className="space-y-4">
                {startups.map((startup) => (
                  <div key={startup.id} className="bg-detail-item-bg-color p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-1">{startup.name}</h3>
                    <p className="text-sm mb-2">{startup.description}</p>
                    <p className="text-xs">Founded: {startup.foundedYear} | {startup.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selection Lead Section */}
          {selectionLead && (
            <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary-color">Selection Lead</h2>
                <div className="flex items-center mb-4">
                  <img src={selectionLead.photo} alt={selectionLead.name} className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold text-lg">{selectionLead.name}</p>
                    <p className="text-sm">{selectionLead.title} at {selectionLead.company}</p>
                  </div>
                </div>
                <p className="text-sm mb-4">{selectionLead.bio}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prospectus Link */}
      <div className="mt-8 text-center">
        <Link to={`/prospectus/${id}`} className="text-link-color hover:text-primary-color underline">
          View Full Prospectus
        </Link>
      </div>

      {/* Investment Modal */}
      <InvestmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        status={modalStatus}
        amount={parseInt(investmentAmount) || 0}
      />
    </div>
  );
};

export default CoInvestPage;
