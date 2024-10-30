import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  StartupsSelection, 
  Campaign, 
  Startup, 
  LeadInvestor, 
  Investment, 
  AdditionalFundingEntity, 
  User,
  KYCStatus,
  AccreditationStatus
} from '../types';
import { doc, getDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import InvestmentModal from './InvestmentModal';
import InvestmentAllocationModal from './InvestmentAllocationModal';
import InvestmentAllocationChart from './InvestmentAllocationChart';
import '../styles/DetailPage.css';

const CoInvestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selection, setSelection] = useState<StartupsSelection | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [selectionLead, setSelectionLead] = useState<LeadInvestor | null>(null);
  const [fundingEntities, setFundingEntities] = useState<Record<string, AdditionalFundingEntity>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState<boolean>(false);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState<boolean>(false);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [modalStatus, setModalStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  
  // Mock user data
  const mockUser: User = {
    id: 'mock-user-id',
    userId: 'mock-user-id',
    email: 'mock@example.com',
    name: 'Mock User',
    address: {
      street: '123 Mock St',
      city: 'Mock City',
      provinceState: 'Mock State',
      postalCodeZip: '12345',
      country: 'Mock Country'
    },
    kycStatus: KYCStatus.Verified,
    memberSince: Timestamp.now(),
    accreditationStatus: AccreditationStatus.NotAccredited,
    yearlyInvestmentLimit: 100000,
    investedThisYear: 0,
    totalInvestments: 0,
    bankAccounts: [],
    primaryBankAccountId: null
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          // Fetch selection
          const selectionRef = doc(db, 'startupsSelections', id);
          const selectionSnap = await getDoc(selectionRef);
          if (selectionSnap.exists()) {
            const selectionData = { id: selectionSnap.id, ...selectionSnap.data() } as StartupsSelection;
            setSelection(selectionData);

            // Fetch campaigns
            const campaignPromises = selectionData.campaigns.map(campaignId => 
              getDoc(doc(db, 'campaigns', campaignId))
            );
            const campaignSnaps = await Promise.all(campaignPromises);
            const campaignsData = campaignSnaps
              .filter(snap => snap.exists())
              .map(snap => ({ id: snap.id, ...snap.data() }) as Campaign);
            setCampaigns(campaignsData);

            // Fetch startups
            const startupIds = campaignsData.map(campaign => campaign.startupId);
            const startupPromises = startupIds.map(startupId => 
              getDoc(doc(db, 'startups', startupId))
            );
            const startupSnaps = await Promise.all(startupPromises);
            const startupsData = startupSnaps
              .filter(snap => snap.exists())
              .map(snap => ({ id: snap.id, ...snap.data() }) as Startup);
            setStartups(startupsData);

            // Fetch selection lead
            if (selectionData.selectionLead) {
              const leadRef = doc(db, 'leadInvestors', selectionData.selectionLead);
              const leadSnap = await getDoc(leadRef);
              if (leadSnap.exists()) {
                setSelectionLead({ id: leadSnap.id, ...leadSnap.data() } as LeadInvestor);
              }
            }

            // Fetch additional funding entities
            const entityIds = selectionData.additionalFunding.map(f => f.entityId);
            const entities: Record<string, AdditionalFundingEntity> = {};
            
            for (const entityId of entityIds) {
              const entityDoc = await getDoc(doc(db, 'additionalFundingEntities', entityId));
              if (entityDoc.exists()) {
                entities[entityId] = { id: entityDoc.id, ...entityDoc.data() } as AdditionalFundingEntity;
              }
            }
            
            setFundingEntities(entities);
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

  const handleInvestmentSubmit = async (amount: number) => {
    setInvestmentAmount(amount);
    setIsAllocationModalOpen(false);
    setIsInvestmentModalOpen(true);
    setModalStatus('processing');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (id && selection) {
        const newInvestment: Omit<Investment, 'id'> = {
          date: Timestamp.now(),
          amount: amount,
          selectionId: id,
          userId: mockUser.id,
          status: 'completed'
        };

        const docRef = await addDoc(collection(db, 'investments'), newInvestment);

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
        {/* Left Column: Investment Summary and Additional Funding */}
        <div className="space-y-8">
          {/* Investment Form */}
          <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary-color">Make Your Investment</h2>
              <p className="mb-4">By co-investing, you'll receive equity proportional to your investment amount in these startups.</p>
              <button
                onClick={() => setIsAllocationModalOpen(true)}
                className="w-full bg-primary-color text-button-text-color py-3 px-6 rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-opacity-50 transition duration-200 text-lg font-semibold"
                style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--button-text-color)',
                  borderRadius: 'var(--button-border-radius)',
                }}
              >
                Start Co-investment
              </button>
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="mb-6">
                <div className="grid grid-cols-4 text-center mb-1">
                  <div className="text-sm opacity-60">Total Raised</div>
                  <div className="text-sm opacity-60">Goal</div>
                  <div className="text-sm opacity-60">Backers</div>
                  <div className="text-sm opacity-60">Days Left</div>
                </div>
                <div className="grid grid-cols-4 text-center">
                  <div className="text-primary-color font-bold text-lg">${selection.currentAmount.toLocaleString()}</div>
                  <div className="text-primary-color font-bold text-lg">${selection.goal.toLocaleString()}</div>
                  <div className="text-primary-color font-bold text-lg">{selection.backersCount}</div>
                  <div className="text-primary-color font-bold text-lg">{selection.daysLeft}</div>
                </div>
              </div>

              {/* Allocation Chart */}
              {selection.startupProportions && (
                <div className="mt-4">
                  <InvestmentAllocationChart
                    startups={startups}
                    proportions={selection.startupProportions}
                    campaigns={campaigns}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional Funding Section */}
          <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-primary-color">Additional Funding</h2>
              <ul className="space-y-2">
                {selection.additionalFunding.map((funding) => {
                  const entity = fundingEntities[funding.entityId];
                  return entity ? (
                    <li key={funding.entityId} className="bg-detail-item-bg-color p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        {entity.iconUrl && (
                          <img src={entity.iconUrl} alt={entity.name} className="w-6 h-6 rounded-full mr-2" />
                        )}
                        <div>
                          <span className="font-semibold">{entity.name}</span>
                          <span className="text-sm text-gray-400 block">{entity.label}</span>
                        </div>
                      </div>
                      <p className="text-sm">{entity.description}</p>
                      <span className="block mt-1 text-primary-color font-bold">
                        ${funding.amount.toLocaleString()}
                      </span>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Startups and Selection Lead */}
        <div className="space-y-8">
          {/* Startups Section */}
          <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-primary-color">Featured Startups</h2>
              <div className="space-y-6">
                {startups.map((startup) => (
                  <div key={startup.id} className="bg-detail-item-bg-color rounded-lg overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center mb-3">
                        {startup.imageUrl && (
                          <img 
                            src={startup.imageUrl} 
                            alt={startup.name} 
                            className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-primary-color"
                          />
                        )}
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{startup.name}</h3>
                          <div className="flex items-center text-sm text-gray-400">
                            <span className="mr-3">Founded: {startup.foundedYear}</span>
                            <span>{startup.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-4">{startup.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-card-bg-color p-2 rounded">
                          <span className="block text-gray-400">Industry</span>
                          <span className="font-semibold">{startup.industry}</span>
                        </div>
                        <div className="bg-card-bg-color p-2 rounded">
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

          {/* Selection Lead Section */}
          {selectionLead && (
            <div className="bg-card-bg-color shadow-xl rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary-color">Selection Lead</h2>
                <div className="flex items-center mb-4">
                  <img src={selectionLead.photo} alt={selectionLead.name} className="w-16 h-16 rounded-full mr-4 border-2 border-primary-color" />
                  <div>
                    <p className="font-semibold text-lg">{selectionLead.name}</p>
                    <p className="text-sm text-gray-400">{selectionLead.title} at {selectionLead.company}</p>
                  </div>
                </div>
                <p className="text-sm mb-4 leading-relaxed">{selectionLead.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {selectionLead.areasOfExpertise.map((area, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: 'var(--primary-color)',
                        opacity: 0.8,
                        color: 'var(--button-text-color)'
                      }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prospectus Link */}
      <div className="mt-8 text-center">
        <Link 
          to={`/prospectus/${id}`} 
          className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: 'var(--primary-color)',
            color: 'var(--button-text-color)',
            boxShadow: '0 4px 6px rgba(142, 68, 173, 0.2)'
          }}
        >
          View Full Prospectus
        </Link>
      </div>

      {/* Investment Allocation Modal */}
      {selection && (
        <InvestmentAllocationModal
          isOpen={isAllocationModalOpen}
          onClose={() => setIsAllocationModalOpen(false)}
          onProceed={handleInvestmentSubmit}
          user={mockUser}
          selection={selection}
          campaigns={campaigns}
          startups={startups}
        />
      )}

      {/* Investment Processing Modal */}
      <InvestmentModal
        isOpen={isInvestmentModalOpen}
        onClose={() => setIsInvestmentModalOpen(false)}
        status={modalStatus}
        amount={investmentAmount}
      />
    </div>
  );
};

export default CoInvestPage;
