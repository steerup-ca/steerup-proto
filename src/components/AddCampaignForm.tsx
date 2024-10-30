import React, { useState, useEffect } from 'react';
import Button from './Button';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { Campaign, LeadInvestor, Startup, AdditionalFundingEntity, CampaignAdditionalFunding } from '../types';
import '../styles/forms.css';

const AddCampaignForm: React.FC = () => {
  const [campaign, setCampaign] = useState<Omit<Campaign, 'id'>>({
    startupId: '',
    leadInvestorId: '',
    creation_date: Timestamp.now(),
    steerup_amount: 0,
    offeringDetails: {
      minAmount: 0,
      maxAmount: 0,
      equity: 0,
      valuation: 0,
      offeringDocument: '',
    },
    additionalFunding: []
  });

  const [leadInvestors, setLeadInvestors] = useState<LeadInvestor[]>([]);
  const [availableStartups, setAvailableStartups] = useState<Startup[]>([]);
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
        const investorsSnapshot = await getDocs(collection(db, 'leadInvestors'));
        const investors = investorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeadInvestor));
        setLeadInvestors(investors);

        // Fetch startups
        const startupsSnapshot = await getDocs(collection(db, 'startups'));
        const startups = startupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Startup));
        setAvailableStartups(startups);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name in campaign.offeringDetails) {
      setCampaign(prev => ({
        ...prev,
        offeringDetails: {
          ...prev.offeringDetails,
          [name]: name === 'offeringDocument' ? value : Number(value),
        },
      }));
    } else if (name === 'creation_date') {
      setCampaign(prev => ({
        ...prev,
        [name]: Timestamp.fromDate(new Date(value)),
      }));
    } else if (name === 'steerup_amount') {
      setCampaign(prev => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setCampaign(prev => ({
        ...prev,
        [name]: value,
      }));
    }
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
      setCampaign(prev => ({
        ...prev,
        additionalFunding: [...prev.additionalFunding, newFunding]
      }));
      setNewFunding({ entityId: '', amount: 0 });
    }
  };

  const handleRemoveFunding = (entityId: string) => {
    setCampaign(prev => ({
      ...prev,
      additionalFunding: prev.additionalFunding.filter(f => f.entityId !== entityId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const docRef = await addDoc(collection(db, 'campaigns'), campaign);
      setSuccessMessage('Campaign added successfully!');
      // Reset form
      setCampaign({
        startupId: '',
        leadInvestorId: '',
        creation_date: Timestamp.now(),
        steerup_amount: 0,
        offeringDetails: {
          minAmount: 0,
          maxAmount: 0,
          equity: 0,
          valuation: 0,
          offeringDocument: '',
        },
        additionalFunding: []
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding document: ', error);
      if (error instanceof Error) {
        setErrorMessage(`Error adding Campaign: ${error.message}`);
      } else {
        setErrorMessage('An unknown error occurred. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="steerup-form">
      <h2 className="form-title">Add Campaign</h2>
      
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="form-group">
        <label htmlFor="startupId">Startup</label>
        <select
          id="startupId"
          name="startupId"
          value={campaign.startupId}
          onChange={handleInputChange}
          required
          className="form-input"
        >
          <option value="">Select a Startup</option>
          {availableStartups.map((startup) => (
            <option key={startup.id} value={startup.id}>
              {startup.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="leadInvestorId">Lead Investor</label>
        <select
          id="leadInvestorId"
          name="leadInvestorId"
          value={campaign.leadInvestorId}
          onChange={handleInputChange}
          required
          className="form-input"
        >
          <option value="">Select a Lead Investor</option>
          {leadInvestors.map((investor) => (
            <option key={investor.id} value={investor.id}>
              {investor.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="creation_date">Creation Date</label>
        <input
          type="date"
          id="creation_date"
          name="creation_date"
          value={campaign.creation_date.toDate().toISOString().split('T')[0]}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="steerup_amount">Steerup Amount</label>
        <input
          type="number"
          id="steerup_amount"
          name="steerup_amount"
          value={campaign.steerup_amount}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="minAmount">Minimum Amount</label>
        <input
          type="number"
          id="minAmount"
          name="minAmount"
          value={campaign.offeringDetails.minAmount}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="maxAmount">Maximum Amount</label>
        <input
          type="number"
          id="maxAmount"
          name="maxAmount"
          value={campaign.offeringDetails.maxAmount}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="equity">Equity (%)</label>
        <input
          type="number"
          id="equity"
          name="equity"
          value={campaign.offeringDetails.equity}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="valuation">Valuation</label>
        <input
          type="number"
          id="valuation"
          name="valuation"
          value={campaign.offeringDetails.valuation}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="offeringDocument">Offering Document URL</label>
        <input
          type="text"
          id="offeringDocument"
          name="offeringDocument"
          value={campaign.offeringDetails.offeringDocument}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <h3>Additional Funding</h3>
        {campaign.additionalFunding.map((funding) => {
          const entity = additionalFundingEntities.find(e => e.id === funding.entityId);
          return (
            <div key={funding.entityId} className="funding-item flex items-center mb-2">
              <span>{entity?.name}: ${funding.amount.toLocaleString()}</span>
              <div className="ml-auto">
                <Button 
                  onClick={() => handleRemoveFunding(funding.entityId)}
                  className="remove-btn px-2 py-1"
                >
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
        
        <div className="add-funding flex gap-4 mt-4">
          <select
            name="entityId"
            value={newFunding.entityId}
            onChange={handleNewFundingChange}
            className="form-input flex-grow"
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
            className="form-input w-32"
          />
          <Button onClick={handleAddFunding} className="add-btn w-32">
            Add Funding
          </Button>
        </div>
      </div>

      <Button type="submit" className="submit-btn">Add Campaign</Button>
    </form>
  );
};

export default AddCampaignForm;
