import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { AdditionalFundingEntity } from '../types';
import '../styles/theme.css';

const AddAdditionalFundingEntityForm: React.FC = () => {
  const [fundingEntity, setFundingEntity] = useState<Omit<AdditionalFundingEntity, 'id'>>({
    name: '',
    description: '',
    label: '',
    iconUrl: '',
    type: 'organization',
    credentials: [],
    website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFundingEntity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const values = e.target.value.split(',').map(item => item.trim());
    setFundingEntity(prev => ({ ...prev, credentials: values }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const fundingData: Omit<AdditionalFundingEntity, 'id'> = {
        ...fundingEntity
      };

      await addDoc(collection(db, 'additionalFundingEntities'), fundingData);
      setSuccessMessage('Additional funding entity added successfully!');
      setFundingEntity({
        name: '',
        description: '',
        label: '',
        iconUrl: '',
        type: 'organization',
        credentials: [],
        website: ''
      });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setErrorMessage('Error adding additional funding entity. Please try again.');
      console.error('Error adding additional funding entity:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="steerup-form">
        <h2 className="form-title">Add Additional Funding Entity</h2>
        
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={fundingEntity.name}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="Organization or Individual name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="label">Label *</label>
            <input
              type="text"
              id="label"
              name="label"
              value={fundingEntity.label}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="e.g., Government Investment Bank, Private Investment Fund"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <select
              id="type"
              name="type"
              value={fundingEntity.type}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="organization">Organization</option>
              <option value="individual">Individual</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={fundingEntity.description}
              onChange={handleInputChange}
              required
              className="form-textarea"
              rows={4}
              placeholder="Brief description of the funding entity"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Details</h3>
          <div className="form-group">
            <label htmlFor="iconUrl">Icon URL</label>
            <input
              type="url"
              id="iconUrl"
              name="iconUrl"
              value={fundingEntity.iconUrl}
              onChange={handleInputChange}
              className="form-input"
              placeholder="URL for organization/individual icon (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={fundingEntity.website}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Website URL (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="credentials">Credentials</label>
            <input
              type="text"
              id="credentials"
              name="credentials"
              value={fundingEntity.credentials?.join(', ')}
              onChange={handleArrayInputChange}
              className="form-input"
              placeholder="Relevant credentials, separated by commas (optional)"
            />
            <p className="form-instruction">Enter credentials separated by commas</p>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Additional Funding Entity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdditionalFundingEntityForm;
