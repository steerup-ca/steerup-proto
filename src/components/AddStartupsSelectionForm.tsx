import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { StartupsSelection, LeadInvestor, Campaign, Startup, AdditionalFundingEntity, CampaignAdditionalFunding, StartupProportion, InvestmentType, DebtTerms } from '../types';
import '../styles/theme.css';

const AddStartupsSelectionForm: React.FC = () => {
  const [startupsSelection, setStartupsSelection] = useState<Omit<StartupsSelection, 'id'>>({
    title: '',
    selectionLead: '',
    campaigns: [],
    startupProportions: [],
    goal: 0,
    currentAmount: 0,
    daysLeft: 0,
    backersCount: 0,
    additionalFunding: [],
    investmentType: InvestmentType.EQUITY,
    debtTerms: undefined
  });

  const [leadInvestors, setLeadInvestors] = useState<{ [id: string]: LeadInvestor }>({});
  const [availableCampaigns, setAvailableCampaigns] = useState<Campaign[]>([]);
  const [startups, setStartups] = useState<{ [id: string]: Startup }>({});
  const [additionalFundingEntities, setAdditionalFundingEntities] = useState<AdditionalFundingEntity[]>([]);
  const [newFunding, setNewFunding] = useState<CampaignAdditionalFunding>({
    entityId: '',
    amount: 0
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch lead investors
        const leadInvestorsSnapshot = await getDocs(collection(db, 'leadInvestors'));
        const leadInvestorsData = leadInvestorsSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() } as LeadInvestor;
          return acc;
        }, {} as { [id: string]: LeadInvestor });
        setLeadInvestors(leadInvestorsData);

        // Fetch campaigns
        const campaignsSnapshot = await getDocs(collection(db, 'campaigns'));
        const campaignsData = campaignsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            creation_date: data.creation_date,
          } as Campaign;
        });
        setAvailableCampaigns(campaignsData);

        // Fetch startups
        const startupsSnapshot = await getDocs(collection(db, 'startups'));
        const startupsData = startupsSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() } as Startup;
          return acc;
        }, {} as { [id: string]: Startup });
        setStartups(startupsData);

        // Fetch additional funding entities
        const fundingSnapshot = await getDocs(collection(db, 'additionalFundingEntities'));
        const fundingEntities = fundingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdditionalFundingEntity));
        setAdditionalFundingEntities(fundingEntities);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'investmentType') {
      const newType = value as InvestmentType;
      setStartupsSelection(prev => ({
        ...prev,
        investmentType: newType,
        debtTerms: newType === InvestmentType.DEBT ? {
          interestRate: 0,
          maturityMonths: 0,
          paymentSchedule: 'monthly'
        } : undefined
      }));
      return;
    }

    if (name.startsWith('debtTerms.')) {
      const field = name.split('.')[1];
      setStartupsSelection(prev => ({
        ...prev,
        debtTerms: {
          ...prev.debtTerms!,
          [field]: field === 'interestRate' || field === 'maturityMonths' ? Number(value) : value
        }
      }));
      return;
    }

    setStartupsSelection(prev => ({
      ...prev,
      [name]: name === 'currentAmount' || name === 'daysLeft' || name === 'backersCount'
        ? Number(value)
        : value,
    }));
  };

  const handleCampaignsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCampaignIds = Array.from(e.target.selectedOptions, option => option.value);
    const selectedCampaigns = availableCampaigns.filter(campaign => selectedCampaignIds.includes(campaign.id));
    
    const totalAmount = selectedCampaigns.reduce((sum, campaign) => sum + campaign.steerup_amount, 0);
    
    const newProportions: StartupProportion[] = selectedCampaigns.map(campaign => ({
      campaignId: campaign.id,
      proportion: (campaign.steerup_amount / totalAmount) * 100
    }));

    setStartupsSelection(prev => ({
      ...prev,
      campaigns: selectedCampaignIds,
      startupProportions: newProportions,
      goal: totalAmount,
    }));
  };

  const handleNewFundingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewFunding(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleAddFunding = () => {
    if (newFunding.entityId && newFunding.amount > 0) {
      setStartupsSelection(prev => ({
        ...prev,
        additionalFunding: [...prev.additionalFunding, newFunding]
      }));
      setNewFunding({ entityId: '', amount: 0 });
    }
  };

  const handleRemoveFunding = (entityId: string) => {
    setStartupsSelection(prev => ({
      ...prev,
      additionalFunding: prev.additionalFunding.filter(f => f.entityId !== entityId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const docRef = await addDoc(collection(db, 'startupsSelections'), startupsSelection);
      setSuccessMessage('Startups Selection added successfully!');
      setStartupsSelection({
        title: '',
        selectionLead: '',
        campaigns: [],
        startupProportions: [],
        goal: 0,
        currentAmount: 0,
        daysLeft: 0,
        backersCount: 0,
        additionalFunding: [],
        investmentType: InvestmentType.EQUITY,
        debtTerms: undefined
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding document: ', error);
      if (error instanceof Error) {
        setErrorMessage(`Error adding Startups Selection: ${error.message}`);
      } else {
        setErrorMessage('An unknown error occurred. Please try again.');
      }
    }
  };

  const formatCampaignOption = (campaign: Campaign) => {
    const startup = startups[campaign.startupId];
    const leadInvestor = leadInvestors[campaign.leadInvestorId];
    const date = campaign.creation_date.toDate().toLocaleDateString();
    return `${startup?.name || 'Unknown Startup'} - ${leadInvestor?.name || 'Unknown Investor'} - ${date} - $${campaign.steerup_amount}`;
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="steerup-form">
        <h2 className="form-title">Add Startups Selection</h2>
        
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={startupsSelection.title}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="investmentType">Investment Type *</label>
            <select
              id="investmentType"
              name="investmentType"
              value={startupsSelection.investmentType}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value={InvestmentType.EQUITY}>Equity</option>
              <option value={InvestmentType.DEBT}>Debt</option>
            </select>
          </div>

          {startupsSelection.investmentType === InvestmentType.DEBT && (
            <div className="form-subsection">
              <h3>Debt Terms</h3>
              <div className="form-group">
                <label htmlFor="debtTerms.interestRate">Interest Rate (% APR) *</label>
                <input
                  type="number"
                  id="debtTerms.interestRate"
                  name="debtTerms.interestRate"
                  value={startupsSelection.debtTerms?.interestRate || 0}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="debtTerms.maturityMonths">Term Length (Months) *</label>
                <input
                  type="number"
                  id="debtTerms.maturityMonths"
                  name="debtTerms.maturityMonths"
                  value={startupsSelection.debtTerms?.maturityMonths || 0}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="debtTerms.paymentSchedule">Payment Schedule *</label>
                <select
                  id="debtTerms.paymentSchedule"
                  name="debtTerms.paymentSchedule"
                  value={startupsSelection.debtTerms?.paymentSchedule || 'monthly'}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Selection Details</h3>
          <div className="form-group">
            <label htmlFor="selectionLead">Selection Lead *</label>
            <select
              id="selectionLead"
              name="selectionLead"
              value={startupsSelection.selectionLead}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="">Select a Lead Investor</option>
              {Object.values(leadInvestors).map((investor) => (
                <option key={investor.id} value={investor.id}>
                  {investor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="campaigns">Campaigns *</label>
            <p className="form-instruction">Hold Ctrl (Windows) or Cmd (Mac) to select multiple campaigns</p>
            <select
              id="campaigns"
              name="campaigns"
              multiple
              value={startupsSelection.campaigns}
              onChange={handleCampaignsChange}
              required
              className="form-input"
            >
              {availableCampaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {formatCampaignOption(campaign)}
                </option>
              ))}
            </select>
          </div>

          {startupsSelection.campaigns.length > 0 && (
            <div className="form-group">
              <label>Investment Proportions</label>
              <p className="form-instruction">These proportions are automatically calculated based on each campaign's funding amount</p>
              {startupsSelection.startupProportions.map((proportion) => {
                const campaign = availableCampaigns.find(c => c.id === proportion.campaignId);
                const startup = campaign ? startups[campaign.startupId] : null;
                return (
                  <div key={proportion.campaignId} className="form-subsection">
                    <div>{startup?.name || 'Unknown Startup'}</div>
                    <div>Proportion: {proportion.proportion.toFixed(2)}%</div>
                    <div>Amount: ${campaign?.steerup_amount.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Funding Information</h3>
          <div className="form-group">
            <label>Goal Amount (Computed)</label>
            <div className="form-input">${startupsSelection.goal.toLocaleString()}</div>
          </div>

          <div className="form-group">
            <label htmlFor="currentAmount">Current Amount *</label>
            <input
              type="number"
              id="currentAmount"
              name="currentAmount"
              value={startupsSelection.currentAmount}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="daysLeft">Days Left *</label>
            <input
              type="number"
              id="daysLeft"
              name="daysLeft"
              value={startupsSelection.daysLeft}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="backersCount">Backers Count *</label>
            <input
              type="number"
              id="backersCount"
              name="backersCount"
              value={startupsSelection.backersCount}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Funding</h3>
          {startupsSelection.additionalFunding.map((funding) => {
            const entity = additionalFundingEntities.find(e => e.id === funding.entityId);
            return entity ? (
              <div key={funding.entityId} className="form-subsection">
                <div>{entity.name}: ${funding.amount.toLocaleString()}</div>
                <button 
                  type="button"
                  onClick={() => handleRemoveFunding(funding.entityId)}
                  className="btn-secondary"
                >
                  Remove
                </button>
              </div>
            ) : null;
          })}
          
          <div className="array-input-group">
            <select
              name="entityId"
              value={newFunding.entityId}
              onChange={handleNewFundingChange}
              className="form-input"
            >
              <option value="">Select Additional Funding Entity</option>
              {additionalFundingEntities.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="amount"
              value={newFunding.amount}
              onChange={handleNewFundingChange}
              placeholder="Amount"
              className="form-input"
            />
            <button 
              type="button"
              onClick={handleAddFunding}
              className="btn-secondary"
            >
              Add Funding
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Add Startups Selection
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStartupsSelectionForm;
