import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Startup, Founder, TeamMember, Metric, FundingRound } from '../types';
import { AddFounderForm } from './AddFounderForm';
import '../styles/theme.css';

interface AddStartupFormProps {
  onSubmit?: (startup: Startup) => void;
  onCancel?: () => void;
}

export const AddStartupForm: React.FC<AddStartupFormProps> = ({ onSubmit, onCancel }) => {
  const [startup, setStartup] = useState<Omit<Startup, 'id'>>({
    name: '',
    imageUrl: '',
    description: '',
    foundedYear: '',
    location: '',
    founders: [],
    team: [],
    metrics: [],
    fundingHistory: [],
    industry: '',
    fundingStage: '',
    fundingAmount: 0,
    teamSize: 0,
    website: ''
  });

  const [availableFounders, setAvailableFounders] = useState<{ [key: string]: Founder }>({});
  const [showFounderForm, setShowFounderForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchFounders = async () => {
      try {
        const foundersSnapshot = await getDocs(collection(db, 'founders'));
        const foundersData = foundersSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() } as Founder;
          return acc;
        }, {} as { [key: string]: Founder });
        setAvailableFounders(foundersData);
      } catch (error) {
        console.error('Error fetching founders:', error);
        setErrorMessage('Failed to load founders');
      }
    };

    fetchFounders();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStartup(prev => ({
      ...prev,
      [name]: name === 'fundingAmount' || name === 'teamSize' ? Number(value) : value
    }));
  };

  const handleFoundersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFounderIds = Array.from(e.target.selectedOptions, option => option.value);
    setStartup(prev => ({
      ...prev,
      founders: selectedFounderIds
    }));
  };

  const handleAddFounder = async (founderData: Omit<Founder, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'founders'), founderData);
      const newFounder = { id: docRef.id, ...founderData };
      setAvailableFounders(prev => ({
        ...prev,
        [docRef.id]: newFounder
      }));
      setStartup(prev => ({
        ...prev,
        founders: [...prev.founders, docRef.id]
      }));
      setShowFounderForm(false);
      setSuccessMessage('Founder added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding founder:', error);
      setErrorMessage('Failed to add founder');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'startups'), startup);
      setSuccessMessage('Startup added successfully!');
      if (onSubmit) {
        onSubmit({ id: docRef.id, ...startup });
      }
      // Reset form
      setStartup({
        name: '',
        imageUrl: '',
        description: '',
        foundedYear: '',
        location: '',
        founders: [],
        team: [],
        metrics: [],
        fundingHistory: [],
        industry: '',
        fundingStage: '',
        fundingAmount: 0,
        teamSize: 0,
        website: ''
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding startup:', error);
      setErrorMessage('Failed to add startup');
    }
  };

  return (
    <div className="form-container">
      {showFounderForm ? (
        <AddFounderForm
          onSubmit={handleAddFounder}
          onCancel={() => setShowFounderForm(false)}
        />
      ) : (
        <form onSubmit={handleSubmit} className="steerup-form">
          <h2 className="form-title">Add Startup</h2>

          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label htmlFor="name">Startup Name *</label>
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
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={startup.imageUrl}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={startup.description}
                onChange={handleInputChange}
                required
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label htmlFor="foundedYear">Founded Year *</label>
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
              <label htmlFor="location">Location *</label>
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
          </div>

          <div className="form-section">
            <h3>Founders</h3>
            <div className="form-group">
              <label>Select Founders *</label>
              <div className="array-input-group">
                <select
                  multiple
                  value={startup.founders}
                  onChange={handleFoundersChange}
                  className="form-input"
                  required
                >
                  {Object.values(availableFounders).map((founder) => (
                    <option key={founder.id} value={founder.id}>
                      {founder.name} - {founder.title}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowFounderForm(true)}
                  className="btn-secondary"
                >
                  Add New Founder
                </button>
              </div>
              <p className="form-instruction">Hold Ctrl (Windows) or Cmd (Mac) to select multiple founders</p>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>
            <div className="form-group">
              <label htmlFor="industry">Industry *</label>
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
              <label htmlFor="fundingStage">Funding Stage *</label>
              <select
                id="fundingStage"
                name="fundingStage"
                value={startup.fundingStage}
                onChange={handleInputChange}
                required
                className="form-input"
              >
                <option value="">Select Funding Stage</option>
                <option value="Pre-seed">Pre-seed</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
                <option value="Series C">Series C</option>
                <option value="Series D+">Series D+</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fundingAmount">Funding Amount ($) *</label>
              <input
                type="number"
                id="fundingAmount"
                name="fundingAmount"
                value={startup.fundingAmount}
                onChange={handleInputChange}
                required
                min="0"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="teamSize">Team Size *</label>
              <input
                type="number"
                id="teamSize"
                name="teamSize"
                value={startup.teamSize}
                onChange={handleInputChange}
                required
                min="1"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Website *</label>
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
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Add Startup
            </button>
            {onCancel && (
              <button type="button" onClick={onCancel} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default AddStartupForm;
