import React, { useState } from 'react';
import Button from './Button';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Startup } from '../types';
import '../styles/forms.css';

const AddStartupForm: React.FC = () => {
  const [startup, setStartup] = useState<Omit<Startup, 'id'>>({
    name: '',
    imageUrl: '',
    description: '',
    foundedYear: '',
    location: '',
    team: [],
    metrics: [],
    fundingHistory: [],
    industry: '',
    fundingStage: '',
    fundingAmount: 0,
    teamSize: 0,
    website: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStartup(prev => ({ ...prev, [name]: name === 'fundingAmount' || name === 'teamSize' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted. Attempting to add startup to Firestore...');
    setSuccessMessage('');
    setErrorMessage('');

    try {
      console.log('Connecting to Firestore...');
      const docRef = await addDoc(collection(db, 'startups'), startup);
      console.log('Document written with ID: ', docRef.id);
      setSuccessMessage('Startup added successfully!');
      // Reset form fields
      setStartup({
        name: '',
        imageUrl: '',
        description: '',
        foundedYear: '',
        location: '',
        team: [],
        metrics: [],
        fundingHistory: [],
        industry: '',
        fundingStage: '',
        fundingAmount: 0,
        teamSize: 0,
        website: '',
      });
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding document: ', error);
      if (error instanceof Error) {
        setErrorMessage(`Error adding Startup: ${error.message}`);
      } else {
        setErrorMessage('An unknown error occurred. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="steerup-form">
      <h2 className="form-title">Add Startup</h2>
      
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={startup.name}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={startup.imageUrl}
          onChange={handleInputChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={startup.description}
          onChange={handleInputChange}
          required
          className="form-input"
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="foundedYear">Founded Year</label>
        <input
          type="text"
          id="foundedYear"
          name="foundedYear"
          value={startup.foundedYear}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={startup.location}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="industry">Industry</label>
        <input
          type="text"
          id="industry"
          name="industry"
          value={startup.industry}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="fundingStage">Funding Stage</label>
        <input
          type="text"
          id="fundingStage"
          name="fundingStage"
          value={startup.fundingStage}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="fundingAmount">Funding Amount</label>
        <input
          type="number"
          id="fundingAmount"
          name="fundingAmount"
          value={startup.fundingAmount}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="teamSize">Team Size</label>
        <input
          type="number"
          id="teamSize"
          name="teamSize"
          value={startup.teamSize}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="website">Website</label>
        <input
          type="url"
          id="website"
          name="website"
          value={startup.website}
          onChange={handleInputChange}
          required
          className="form-input"
        />
      </div>

      <Button type="submit" className="submit-btn">Add Startup</Button>
    </form>
  );
};

export default AddStartupForm;