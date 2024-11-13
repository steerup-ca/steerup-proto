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
  AccreditationStatus,
  InvestmentType
} from '../types';
import { doc, getDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import InvestmentModal from './InvestmentModal';
import InvestmentAllocationModal from './InvestmentAllocationModal';
import InvestmentAllocationChart from './InvestmentAllocationChart';
import FeaturedStartups from './shared/FeaturedStartups';
import SelectionLead from './shared/SelectionLead';
import AdditionalFunding from './shared/AdditionalFunding';
import InvestmentSummary from './shared/InvestmentSummary';
import InvestmentForm from './shared/InvestmentForm';
import '../styles/DetailPage.css';
import '../styles/theme.css';

// Helper function to convert object to array
const objectToArray = (obj: any) => {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return Object.values(obj);
};

const CoLendPage: React.FC = () => {
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
      if (!id) {
        setError('Invalid selection ID');
        setLoading(false);
        return;
      }

      try {
        // Fetch selection
        const selectionRef = doc(db, 'startupsSelections', id);
        const selectionSnap = await getDoc(selectionRef);
        
        if (!selectionSnap.exists()) {
          setError('Selection not found');
          setLoading(false);
          return;
        }

        const selectionData = selectionSnap.data();

        // Convert campaigns object to array
        const campaignIds = objectToArray(selectionData.campaigns);
        if (!campaignIds || campaignIds.length === 0) {
          setError('Invalid selection data: missing campaigns array');
          setLoading(false);
          return;
        }

        // Fetch campaigns
        const campaignPromises = campaignIds.map(async campaignId => {
          const campaignRef = doc(db, 'campaigns', campaignId);
          const campaignSnap = await getDoc(campaignRef);
          if (!campaignSnap.exists()) return null;
          return { id: campaignSnap.id, ...campaignSnap.data() } as Campaign;
        });

        const campaignsData = (await Promise.all(campaignPromises)).filter((campaign): campaign is Campaign => 
          campaign !== null && 
          campaign.startupId !== undefined && 
          campaign.offeringDetails !== undefined
        );

        if (campaignsData.length === 0) {
          setError('No valid campaigns found for this selection');
          setLoading(false);
          return;
        }

        setCampaigns(campaignsData);

        // Format selection data
        const formattedSelection: StartupsSelection = {
          id: selectionSnap.id,
          title: selectionData.title || '',
          description: selectionData.description || '',
          selectionLead: selectionData.selectionLead || '',
          campaigns: campaignsData.map(c => c.id),
          startupProportions: objectToArray(selectionData.startupProportions),
          additionalFunding: objectToArray(selectionData.additionalFunding),
          goal: selectionData.goal || 0,
          currentAmount: selectionData.currentAmount || 0,
          daysLeft: selectionData.daysLeft || 0,
          backersCount: selectionData.backersCount || 0,
          investmentType: InvestmentType.DEBT,
          debtTerms: selectionData.debtTerms || {
            interestRate: 0,
            maturityMonths: 0,
            paymentSchedule: 'monthly'
          }
        };

        setSelection(formattedSelection);

        // Fetch startups
        const startupIds = campaignsData.map(campaign => campaign.startupId);
        const startupPromises = startupIds.map(async startupId => {
          const startupRef = doc(db, 'startups', startupId);
          const startupSnap = await getDoc(startupRef);
          if (!startupSnap.exists()) return null;
          return { id: startupSnap.id, ...startupSnap.data() } as Startup;
        });

        const startupsData = (await Promise.all(startupPromises)).filter((startup): startup is Startup => startup !== null);

        if (startupsData.length === 0) {
          setError('No valid startups found for this selection');
          setLoading(false);
          return;
        }

        setStartups(startupsData);

        // Fetch selection lead
        if (formattedSelection.selectionLead) {
          const leadRef = doc(db, 'leadInvestors', formattedSelection.selectionLead);
          const leadSnap = await getDoc(leadRef);
          if (leadSnap.exists()) {
            setSelectionLead({ id: leadSnap.id, ...leadSnap.data() } as LeadInvestor);
          }
        }

        // Fetch additional funding entities
        const entityIds = formattedSelection.additionalFunding.map(f => f.entityId);
        const entities: Record<string, AdditionalFundingEntity> = {};
        
        for (const entityId of entityIds) {
          const entityDoc = await getDoc(doc(db, 'additionalFundingEntities', entityId));
          if (entityDoc.exists()) {
            entities[entityId] = { id: entityDoc.id, ...entityDoc.data() } as AdditionalFundingEntity;
          }
        }
        setFundingEntities(entities);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
        setLoading(false);
      }
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
    return (
      <div className="text-center text-2xl mt-10 text-text-color">
        <div>{error}</div>
        <button 
          onClick={() => navigate('/explore')}
          className="mt-4 px-6 py-2 bg-primary-color text-white rounded-lg hover:opacity-90"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  if (!selection) {
    return (
      <div className="text-center text-2xl mt-10 text-text-color">
        <div>Selection not found</div>
        <button 
          onClick={() => navigate('/explore')}
          className="mt-4 px-6 py-2 bg-primary-color text-white rounded-lg hover:opacity-90"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background-color text-text-color">
      <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: 'var(--text-color)' }}>
        {selection.title}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <InvestmentForm
            selection={selection}
            investmentType="debt"
            onInvestClick={() => setIsAllocationModalOpen(true)}
          />

          <InvestmentSummary
            selection={selection}
            investmentType="debt"
          />

          <AdditionalFunding
            entities={fundingEntities}
            funding={selection.additionalFunding}
            investmentType="debt"
          />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <FeaturedStartups
            startups={startups}
            investmentType="debt"
          />

          {selectionLead && (
            <SelectionLead
              lead={selectionLead}
              investmentType="debt"
            />
          )}
        </div>
      </div>

      {/* Prospectus Link */}
      <div className="mt-8 text-center">
        <Link 
          to={`/prospectus/${id}`} 
          className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: 'var(--debt-accent-color)',
            color: 'var(--button-text-color)',
            borderRadius: 'var(--button-border-radius)',
            boxShadow: 'var(--box-shadow)'
          }}
        >
          View Full Prospectus
        </Link>
      </div>

      {/* Modals */}
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

      <InvestmentModal
        isOpen={isInvestmentModalOpen}
        onClose={() => setIsInvestmentModalOpen(false)}
        status={modalStatus}
        amount={investmentAmount}
      />
    </div>
  );
};

export default CoLendPage;
