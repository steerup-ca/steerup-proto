import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  StartupsSelection,
  Campaign,
  Startup,
  INVESTMENT_LIMITS,
  LeadInvestor
} from '../types';
import { fetchSelectionData, createInvestment } from '../services/selectionService';
import { getMockUser } from '../services/mockDataService';
import InvestmentModal from './InvestmentModal';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorDisplay from './shared/ErrorDisplay';
import InvestmentInput from './investment/InvestmentInput';
import StartupInvesting from './startup/StartupInvesting';
import '../styles/DetailPage.css';
import '../styles/theme.css';

const CoInvestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selection, setSelection] = useState<StartupsSelection | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [leadInvestor, setLeadInvestor] = useState<LeadInvestor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState<boolean>(false);
  const [investmentAmount, setInvestmentAmount] = useState<number>(INVESTMENT_LIMITS.PLATFORM_MINIMUM);
  const [modalStatus, setModalStatus] = useState<'processing' | 'completed' | 'failed'>('processing');

  const mockUser = getMockUser();
  const maxInvestmentAmount = startups.length * 2500; // $2500 per startup

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError('Invalid selection ID');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchSelectionData(id);
        if (data.selection) {
          setSelection(data.selection);
          setCampaigns(data.campaigns);
          setStartups(data.startups);
          setLeadInvestor(data.selectionLead);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Error fetching data. Please try again.');
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleInvestmentSubmit = async () => {
    setModalStatus('processing');
    setIsInvestmentModalOpen(true);

    try {
      if (!id || !selection) {
        throw new Error('Invalid selection or ID');
      }

      await createInvestment(mockUser.id, id, investmentAmount);

      setSelection(prevSelection => {
        if (prevSelection) {
          return {
            ...prevSelection,
            currentAmount: prevSelection.currentAmount + investmentAmount,
            backersCount: prevSelection.backersCount + 1
          };
        }
      return prevSelection;
      });

      setModalStatus('completed');
    } catch (error) {
      console.error('Error processing investment:', error);
      setModalStatus('failed');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!selection) {
    return <ErrorDisplay message="Selection not found" />;
  }

  // Calculate amounts per startup
  const numStartups = startups.length || 1;
  const startupInvestmentAmount = Math.round(investmentAmount / numStartups);
  const startupRaisedAmount = Math.round(selection.currentAmount / numStartups);
  const startupGoalAmount = Math.round(selection.goal / numStartups);

  return (
    <div className="container mx-auto px-2 py-1">
      <div className="flex items-center justify-center gap-4 mb-6">
        {leadInvestor && (
          <Link to={`/lead-investor/${leadInvestor.id}`}>
            <img 
              src={leadInvestor.photo} 
              alt={leadInvestor.name} 
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/default-avatar.png';
              }}
            />
          </Link>
        )}
        <h1 className="text-xl md:text-4xl font-bold" style={{ color: 'var(--text-color)' }}>
          {selection.title}
        </h1>
      </div>

      {/* Investment Section */}
      <div className="mb-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <InvestmentInput
              investmentAmount={investmentAmount}
              onInvestmentChange={setInvestmentAmount}
              maxAmount={maxInvestmentAmount}
            />
          </div>

          <button
            onClick={handleInvestmentSubmit}
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'var(--button-text-color)',
              padding: '0 1rem',
              borderRadius: '6px',
              transition: 'opacity 0.2s',
              whiteSpace: 'nowrap',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: '500'
            }}
            className="hover:opacity-90"
          >
            Co-Invest Now
          </button>
        </div>
      </div>

      {/* Startups List */}
      <div className="space-y-4">
        {startups.map((startup) => (
          <StartupInvesting
            key={startup.id}
            startup={startup}
            campaign={campaigns.find(c => c.startupId === startup.id)}
            investmentAmount={startupInvestmentAmount}
            currentAmount={selection.currentAmount}
            selection={selection}
            startupRaisedAmount={startupRaisedAmount}
            startupGoalAmount={startupGoalAmount}
          />
        ))}
      </div>

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
