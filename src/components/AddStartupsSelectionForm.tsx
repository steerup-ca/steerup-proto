import React, { useState, useEffect } from 'react';
import Button from './Button';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { StartupsSelection, LeadInvestor, Startup } from '../types';
import '../styles/forms.css';

const AddStartupsSelectionForm: React.FC = () => {
  const [startupsSelection, setStartupsSelection] = useState<Omit<StartupsSelection, 'id'>>({
    title: '',
    selectionLead: '',
    startups: [],
    goal: 0,
    currentAmount: 0,
    daysLeft: 0,
    backersCount: 0,
    additionalFunding: [],
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStartupsSelection(prev => ({
      ...prev,
      [name]: name === 'goal' || name === 'currentAmount' || name === 'daysLeft' || name === 'backersCount'
        ? Number(value)
        : value,
    }));
  };

  const handleStartupsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStartupIds = Array.from(e.target.selectedOptions, option => option.value);
    setStartupsSelection(prev => ({
      ...prev,
      startups: selectedStartupIds,
    }));
  };

  const handleAdditionalFundingChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStartupsSelection(prev => {
      const newAdditionalFunding = [...prev.additionalFunding];
      newAdditionalFunding[index] = { 
        ...newAdditionalFunding[index], 
        [name]: name === 'amount' ? Number(value) : value 
      };
      return { ...prev, additionalFunding: newAdditionalFunding };
    });
  };

  const addAdditionalFunding = () => {
    setStartupsSelection(prev => ({
      ...prev,
      additionalFunding: [...prev.additionalFunding, { name: '', description: '', amount: 0 }],
    }));
  };

  const removeAdditionalFunding = (index: number) => {
    setStartupsSelection(prev => ({
      ...prev,
      additionalFunding: prev.additionalFunding.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted. Attempting to add startups selection to Firestore...');
    setSuccessMessage('');
    setErrorMessage('');

    try {
      console.log('Connecting to Firestore...');
      const docRef = await addDoc(collection(db, 'startupsSelections'), startupsSelection);
      console.log('Document written with ID: ', docRef.id);
      setSuccessMessage('Startups Selection added successfully!');
      // Reset form fields
      setStartupsSelection({
        title: '',
        selectionLead: '',
        startups: [],
        goal: 0,
        currentAmount: 0,
        daysLeft: 0,
        backersCount: 0,
        additionalFunding: [],
      });
      // Clear success message after 3 seconds
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

  return (
    <form onSubmit={handleSubmit} className="steerup-form">
      <h2 className="form-title">Add Startups Selection</h2>
      
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="form-group">
        <label htmlFor="title">Title</label>
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
        <label htmlFor="selectionLead">Selection Lead</label>
        <select
          id="selectionLead"
          name="selectionLead"
          value={startupsSelection.selectionLead}
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
        <label htmlFor="startups">Startups</label>
        <p className="form-instruction">Hold Ctrl (Windows) or Cmd (Mac) to select multiple startups</p>
        <select
          id="startups"
          name="startups"
          multiple
          value={startupsSelection.startups}
          onChange={handleStartupsChange}
          required
          className="form-input"
        >
          {availableStartups.map((startup) => (
            <option key={startup.id} value={startup.id}>
              {startup.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="goal">Goal</label>
        <input
          type="number"
          id="goal"
          name="goal"
          value={startupsSelection.goal}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="currentAmount">Current Amount</label>
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
        <label htmlFor="daysLeft">Days Left</label>
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
        <label htmlFor="backersCount">Backers Count</label>
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

      <div className="form-group">
        <h3>Additional Funding</h3>
        {startupsSelection.additionalFunding.map((funding, index) => (
          <div key={index} className="additional-funding-item">
            <input
              type="text"
              name="name"
              value={funding.name}
              onChange={(e) => handleAdditionalFundingChange(index, e)}
              placeholder="Funding Name"
              required
              className="form-input"
            />
            <input
              type="text"
              name="description"
              value={funding.description}
              onChange={(e) => handleAdditionalFundingChange(index, e)}
              placeholder="Description"
              required
              className="form-input"
            />
            <input
              type="number"
              name="amount"
              value={funding.amount}
              onChange={(e) => handleAdditionalFundingChange(index, e)}
              placeholder="Amount"
              required
              className="form-input"
            />
            <Button onClick={() => removeAdditionalFunding(index)} className="remove-btn">Remove Funding</Button>
          </div>
        ))}
        <Button onClick={addAdditionalFunding} className="add-btn">Add Additional Funding</Button>
      </div>

      <Button type="submit" className="submit-btn">Add Startups Selection</Button>
    </form>
  );
};

export default AddStartupsSelectionForm;