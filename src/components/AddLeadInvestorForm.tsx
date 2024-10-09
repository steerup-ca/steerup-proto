import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { LeadInvestor, InvestmentHistoryItem } from '../types';
import Button from './Button';
import '../styles/forms.css';

const AddLeadInvestorForm: React.FC = () => {
  const [leadInvestor, setLeadInvestor] = useState<Omit<LeadInvestor, 'id'>>({
    name: '',
    photo: '',
    title: '',
    bio: '',
    credentials: [],
    areasOfExpertise: [],
    company: '',
    investmentHistory: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newInvestment, setNewInvestment] = useState<InvestmentHistoryItem>({ companyName: '', amount: 0 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLeadInvestor(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'credentials' | 'areasOfExpertise') => {
    const values = e.target.value.split(',').map(item => item.trim());
    setLeadInvestor(prev => ({ ...prev, [field]: values }));
  };

  const handleNewInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewInvestment(prev => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const addInvestmentHistory = () => {
    if (newInvestment.companyName && newInvestment.amount > 0) {
      setLeadInvestor(prev => ({
        ...prev,
        investmentHistory: [...prev.investmentHistory, newInvestment],
      }));
      setNewInvestment({ companyName: '', amount: 0 });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const leadInvestorData: Omit<LeadInvestor, 'id'> = {
        ...leadInvestor,
      };

      await addDoc(collection(db, 'leadInvestors'), leadInvestorData);
      setSuccessMessage('Lead investor added successfully!');
      setLeadInvestor({
        name: '',
        photo: '',
        title: '',
        bio: '',
        credentials: [],
        areasOfExpertise: [],
        company: '',
        investmentHistory: [],
      });
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setErrorMessage('Error adding lead investor. Please try again.');
      console.error('Error adding lead investor:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="steerup-form">
      <h2 className="form-title">Add Lead Investor</h2>
      
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={leadInvestor.name}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="photo">Photo URL</label>
        <input
          type="url"
          id="photo"
          name="photo"
          value={leadInvestor.photo}
          onChange={handleInputChange}
          placeholder="Enter photo URL"
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={leadInvestor.title}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          value={leadInvestor.company}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={leadInvestor.bio}
          onChange={handleInputChange}
          required
          className="form-input"
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="credentials">Credentials (comma-separated)</label>
        <input
          type="text"
          id="credentials"
          name="credentials"
          value={leadInvestor.credentials.join(', ')}
          onChange={(e) => handleArrayInputChange(e, 'credentials')}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="areasOfExpertise">Areas of Expertise (comma-separated)</label>
        <input
          type="text"
          id="areasOfExpertise"
          name="areasOfExpertise"
          value={leadInvestor.areasOfExpertise.join(', ')}
          onChange={(e) => handleArrayInputChange(e, 'areasOfExpertise')}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <h3>Investment History</h3>
        <p className="form-instruction">Add the investor's previous investments</p>
        {leadInvestor.investmentHistory.map((investment, index) => (
          <div key={index} className="investment-item">
            <span>{investment.companyName}: ${investment.amount.toLocaleString()}</span>
          </div>
        ))}
        <div className="add-investment">
          <input
            type="text"
            name="companyName"
            value={newInvestment.companyName}
            onChange={handleNewInvestmentChange}
            placeholder="Company Name"
            className="form-input"
          />
          <input
            type="number"
            name="amount"
            value={newInvestment.amount}
            onChange={handleNewInvestmentChange}
            placeholder="Amount"
            className="form-input"
          />
          <Button onClick={addInvestmentHistory} className="add-btn">Add Investment</Button>
        </div>
      </div>

      <Button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Lead Investor'}
      </Button>
    </form>
  );
};

export default AddLeadInvestorForm;