import React, { useState, useEffect } from 'react';
import Button from './Button';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { Campaign, LeadInvestor, Startup } from '../types';
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
  });

  const [leadInvestors, setLeadInvestors] = useState<LeadInvestor[]>([]);
  const [availableStartups, setAvailableStartups] = useState<Startup[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchLeadInvestors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'leadInvestors'));
        const investors = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeadInvestor));
        setLeadInvestors(investors);
      } catch (error) {
        console.error('Error fetching lead investors:', error);
      }
    };

    const fetchStartups = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'startups'));
        const startups = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Startup));
        setAvailableStartups(startups);
      } catch (error) {
        console.error('Error fetching startups:', error);
      }
    };

    fetchLeadInvestors();
    fetchStartups();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted. Attempting to add campaign to Firestore...');
    setSuccessMessage('');
    setErrorMessage('');

    try {
      console.log('Connecting to Firestore...');
      const docRef = await addDoc(collection(db, 'campaigns'), campaign);
      console.log('Document written with ID: ', docRef.id);
      setSuccessMessage('Campaign added successfully!');
      // Reset form fields
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
      });
      // Clear success message after 3 seconds
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

      <Button type="submit" className="submit-btn">Add Campaign</Button>
    </form>
  );
};

export default AddCampaignForm;