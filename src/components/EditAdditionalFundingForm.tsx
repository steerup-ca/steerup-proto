import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AdditionalFundingEntity } from '../types';
import '../styles/theme.css';
import { useNavigate } from 'react-router-dom';

interface EditAdditionalFundingFormProps {
  onCancel?: () => void;
}

type AdditionalFundingFormData = {
  name: string;
  description: string;
  label: string;
  iconUrl: string;
  type: 'organization' | 'individual';
  credentials: string[];
  website: string;
};

export const EditAdditionalFundingForm: React.FC<EditAdditionalFundingFormProps> = ({ onCancel }) => {
  const navigate = useNavigate();
  const [entities, setEntities] = useState<AdditionalFundingEntity[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [formData, setFormData] = useState<AdditionalFundingFormData>({
    name: '',
    description: '',
    label: '',
    iconUrl: '',
    type: 'organization',
    credentials: [],
    website: ''
  });

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const entitiesSnapshot = await getDocs(collection(db, 'additionalFundingEntities'));
        const entitiesData = entitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AdditionalFundingEntity[];
        setEntities(entitiesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch additional funding entities');
        setLoading(false);
      }
    };

    fetchEntities();
  }, []);

  const handleEntitySelect = (entityId: string) => {
    const selectedEntity = entities.find(e => e.id === entityId);
    if (selectedEntity) {
      setSelectedEntityId(entityId);
      setFormData({
        name: selectedEntity.name,
        description: selectedEntity.description,
        label: selectedEntity.label,
        iconUrl: selectedEntity.iconUrl || '',
        type: selectedEntity.type,
        credentials: selectedEntity.credentials || [],
        website: selectedEntity.website || ''
      });
    }
  };

  const handleInputChange = (field: keyof AdditionalFundingFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: keyof AdditionalFundingFormData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: keyof AdditionalFundingFormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: keyof AdditionalFundingFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntityId) {
      setError('Please select an entity to edit');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const entityRef = doc(db, 'additionalFundingEntities', selectedEntityId);
      await updateDoc(entityRef, formData);
      setSaving(false);
      setSuccessMessage('Additional funding entity updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        if (onCancel) {
          onCancel();
        } else {
          navigate(-1);
        }
      }, 2000);
    } catch (err) {
      setError('Failed to update additional funding entity');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return <div className="loading">Loading additional funding entities...</div>;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="steerup-form">
        <h2 className="form-title">Edit Additional Funding Entity</h2>
        
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Entity Selection */}
        <div className="form-section">
          <div className="form-group">
            <label>Select Entity *</label>
            <select
              value={selectedEntityId}
              onChange={(e) => handleEntitySelect(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select an entity</option>
              {entities.map(entity => (
                <option key={entity.id} value={entity.id}>
                  {entity.name} - {entity.type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedEntityId && (
          <>
            {/* Basic Information */}
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Label *</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => handleInputChange('label', e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Icon URL</label>
                <input
                  type="url"
                  value={formData.iconUrl}
                  onChange={(e) => handleInputChange('iconUrl', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value as 'organization' | 'individual')}
                  required
                  className="form-select"
                >
                  <option value="organization">Organization</option>
                  <option value="individual">Individual</option>
                </select>
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Credentials */}
            <div className="form-section">
              <h3>Credentials</h3>
              {formData.credentials.map((credential, index) => (
                <div key={index} className="array-input-group">
                  <input
                    type="text"
                    value={credential}
                    onChange={(e) => handleArrayInputChange('credentials', index, e.target.value)}
                    className="form-input"
                    placeholder="Enter credential"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('credentials', index)}
                    className="btn-secondary"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('credentials')}
                className="btn-secondary"
              >
                Add Credential
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary" disabled={saving}>
                Cancel
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default EditAdditionalFundingForm;
