import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { LeadInvestor } from '../types';
import '../styles/theme.css';
import { useNavigate } from 'react-router-dom';

interface EditLeadInvestorFormProps {
  onCancel?: () => void;
}

type LeadInvestorFormData = Omit<LeadInvestor, 'id'>;

export const EditLeadInvestorForm: React.FC<EditLeadInvestorFormProps> = ({ onCancel }) => {
  const navigate = useNavigate();
  const [leadInvestors, setLeadInvestors] = useState<LeadInvestor[]>([]);
  const [selectedLeadInvestorId, setSelectedLeadInvestorId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [formData, setFormData] = useState<LeadInvestorFormData>({
    name: '',
    photo: '',
    title: '',
    bio: '',
    linkedIn: '',
    credentials: [],
    areasOfExpertise: [],
    company: '',
    investmentHistory: []
  });

  useEffect(() => {
    const fetchLeadInvestors = async () => {
      try {
        const leadInvestorsSnapshot = await getDocs(collection(db, 'leadInvestors'));
        const leadInvestorsData = leadInvestorsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as LeadInvestor[];
        setLeadInvestors(leadInvestorsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch lead investors');
        setLoading(false);
      }
    };

    fetchLeadInvestors();
  }, []);

  const handleLeadInvestorSelect = (leadInvestorId: string) => {
    const selectedLeadInvestor = leadInvestors.find(li => li.id === leadInvestorId);
    if (selectedLeadInvestor) {
      setSelectedLeadInvestorId(leadInvestorId);
      setFormData({
        name: selectedLeadInvestor.name,
        photo: selectedLeadInvestor.photo,
        title: selectedLeadInvestor.title,
        bio: selectedLeadInvestor.bio,
        linkedIn: selectedLeadInvestor.linkedIn || '',
        credentials: selectedLeadInvestor.credentials,
        areasOfExpertise: selectedLeadInvestor.areasOfExpertise,
        company: selectedLeadInvestor.company,
        investmentHistory: selectedLeadInvestor.investmentHistory
      });
    }
  };

  const handleInputChange = (field: keyof LeadInvestorFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: keyof LeadInvestorFormData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: keyof LeadInvestorFormData, defaultValue: any = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), defaultValue]
    }));
  };

  const removeArrayItem = (field: keyof LeadInvestorFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }));
  };

  const handleInvestmentHistoryChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      investmentHistory: prev.investmentHistory.map((investment, i) => 
        i === index ? { ...investment, [field]: value } : investment
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadInvestorId) {
      setError('Please select a lead investor to edit');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const leadInvestorRef = doc(db, 'leadInvestors', selectedLeadInvestorId);
      await updateDoc(leadInvestorRef, formData);
      setSaving(false);
      setSuccessMessage('Lead investor updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        if (onCancel) {
          onCancel();
        } else {
          navigate(-1);
        }
      }, 2000);
    } catch (err) {
      setError('Failed to update lead investor');
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
    return <div className="loading">Loading lead investors...</div>;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="steerup-form">
        <h2 className="form-title">Edit Lead Investor</h2>
        
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Lead Investor Selection */}
        <div className="form-section">
          <div className="form-group">
            <label>Select Lead Investor *</label>
            <select
              value={selectedLeadInvestorId}
              onChange={(e) => handleLeadInvestorSelect(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select a lead investor</option>
              {leadInvestors.map(leadInvestor => (
                <option key={leadInvestor.id} value={leadInvestor.id}>
                  {leadInvestor.name} - {leadInvestor.company}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedLeadInvestorId && (
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
                <label>Photo URL</label>
                <input
                  type="url"
                  value={formData.photo}
                  onChange={(e) => handleInputChange('photo', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Bio *</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  required
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedIn}
                  onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Credentials and Expertise */}
            <div className="form-section">
              <h3>Credentials and Expertise</h3>
              
              <div className="form-group">
                <label>Credentials *</label>
                {formData.credentials.map((credential, index) => (
                  <div key={index} className="array-input-group">
                    <input
                      type="text"
                      value={credential}
                      onChange={(e) => handleArrayInputChange('credentials', index, e.target.value)}
                      required
                      className="form-input"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('credentials', index)}
                        className="btn-secondary"
                      >
                        Remove
                      </button>
                    )}
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

              <div className="form-group">
                <label>Areas of Expertise *</label>
                {formData.areasOfExpertise.map((area, index) => (
                  <div key={index} className="array-input-group">
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => handleArrayInputChange('areasOfExpertise', index, e.target.value)}
                      required
                      className="form-input"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('areasOfExpertise', index)}
                        className="btn-secondary"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('areasOfExpertise')}
                  className="btn-secondary"
                >
                  Add Area of Expertise
                </button>
              </div>
            </div>

            {/* Investment History */}
            <div className="form-section">
              <h3>Investment History</h3>
              {formData.investmentHistory.map((investment, index) => (
                <div key={index} className="form-subsection">
                  <div className="form-group">
                    <label>Company Name *</label>
                    <input
                      type="text"
                      value={investment.companyName}
                      onChange={(e) => handleInvestmentHistoryChange(index, 'companyName', e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Amount ($) *</label>
                    <input
                      type="number"
                      value={investment.amount}
                      onChange={(e) => handleInvestmentHistoryChange(index, 'amount', Number(e.target.value))}
                      required
                      min="0"
                      className="form-input"
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('investmentHistory', index)}
                      className="btn-secondary"
                    >
                      Remove Investment
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('investmentHistory', {
                  companyName: '',
                  amount: 0
                })}
                className="btn-secondary"
              >
                Add Investment
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

export default EditLeadInvestorForm;
