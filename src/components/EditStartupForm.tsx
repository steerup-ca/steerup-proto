import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Startup, TeamMember, Metric, FundingRound } from '../types';
import '../styles/theme.css';
import { useNavigate } from 'react-router-dom';

interface EditStartupFormProps {
  onCancel?: () => void;
}

type StartupFormData = Omit<Startup, 'id'>;

export const EditStartupForm: React.FC<EditStartupFormProps> = ({ onCancel }) => {
  const navigate = useNavigate();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [selectedStartupId, setSelectedStartupId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [formData, setFormData] = useState<StartupFormData>({
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

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const startupsSnapshot = await getDocs(collection(db, 'startups'));
        const startupsData = startupsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Startup[];
        setStartups(startupsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch startups');
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const handleStartupSelect = (startupId: string) => {
    const selectedStartup = startups.find(s => s.id === startupId);
    if (selectedStartup) {
      setSelectedStartupId(startupId);
      setFormData({
        name: selectedStartup.name,
        imageUrl: selectedStartup.imageUrl,
        description: selectedStartup.description,
        foundedYear: selectedStartup.foundedYear,
        location: selectedStartup.location,
        founders: selectedStartup.founders,
        team: selectedStartup.team,
        metrics: selectedStartup.metrics,
        fundingHistory: selectedStartup.fundingHistory,
        industry: selectedStartup.industry,
        fundingStage: selectedStartup.fundingStage,
        fundingAmount: selectedStartup.fundingAmount,
        teamSize: selectedStartup.teamSize,
        website: selectedStartup.website
      });
    }
  };

  const handleInputChange = (field: keyof StartupFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const handleMetricChange = (index: number, field: keyof Metric, value: string) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.map((metric, i) => 
        i === index ? { ...metric, [field]: value } : metric
      )
    }));
  };

  const handleFundingRoundChange = (index: number, field: keyof FundingRound, value: string) => {
    setFormData(prev => ({
      ...prev,
      fundingHistory: prev.fundingHistory.map((round, i) => 
        i === index ? { ...round, [field]: value } : round
      )
    }));
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      team: [...prev.team, { name: '', role: '' }]
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index)
    }));
  };

  const addMetric = () => {
    setFormData(prev => ({
      ...prev,
      metrics: [...prev.metrics, { label: '', value: '' }]
    }));
  };

  const removeMetric = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index)
    }));
  };

  const addFundingRound = () => {
    setFormData(prev => ({
      ...prev,
      fundingHistory: [...prev.fundingHistory, { round: '', amount: '', date: '' }]
    }));
  };

  const removeFundingRound = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fundingHistory: prev.fundingHistory.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStartupId) {
      setError('Please select a startup to edit');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const startupRef = doc(db, 'startups', selectedStartupId);
      await updateDoc(startupRef, formData);
      setSaving(false);
      setSuccessMessage('Startup updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        if (onCancel) {
          onCancel();
        } else {
          navigate(-1);
        }
      }, 2000);
    } catch (err) {
      setError('Failed to update startup');
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
    return <div className="loading">Loading startups...</div>;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="steerup-form">
        <h2 className="form-title">Edit Startup</h2>
        
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Startup Selection */}
        <div className="form-section">
          <div className="form-group">
            <label>Select Startup *</label>
            <select
              value={selectedStartupId}
              onChange={(e) => handleStartupSelect(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select a startup</option>
              {startups.map(startup => (
                <option key={startup.id} value={startup.id}>
                  {startup.name} - {startup.industry}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedStartupId && (
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
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
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
                <label>Founded Year *</label>
                <input
                  type="text"
                  value={formData.foundedYear}
                  onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Website *</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Team Members */}
            <div className="form-section">
              <h3>Team Members</h3>
              {formData.team.map((member, index) => (
                <div key={index} className="form-subsection">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Role *</label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="btn-secondary"
                    >
                      Remove Team Member
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTeamMember}
                className="btn-secondary"
              >
                Add Team Member
              </button>
            </div>

            {/* Metrics */}
            <div className="form-section">
              <h3>Metrics</h3>
              {formData.metrics.map((metric, index) => (
                <div key={index} className="form-subsection">
                  <div className="form-group">
                    <label>Label *</label>
                    <input
                      type="text"
                      value={metric.label}
                      onChange={(e) => handleMetricChange(index, 'label', e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Value *</label>
                    <input
                      type="text"
                      value={metric.value}
                      onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeMetric(index)}
                      className="btn-secondary"
                    >
                      Remove Metric
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addMetric}
                className="btn-secondary"
              >
                Add Metric
              </button>
            </div>

            {/* Funding History */}
            <div className="form-section">
              <h3>Funding History</h3>
              {formData.fundingHistory.map((round, index) => (
                <div key={index} className="form-subsection">
                  <div className="form-group">
                    <label>Round *</label>
                    <input
                      type="text"
                      value={round.round}
                      onChange={(e) => handleFundingRoundChange(index, 'round', e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Amount *</label>
                    <input
                      type="text"
                      value={round.amount}
                      onChange={(e) => handleFundingRoundChange(index, 'amount', e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="text"
                      value={round.date}
                      onChange={(e) => handleFundingRoundChange(index, 'date', e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeFundingRound(index)}
                      className="btn-secondary"
                    >
                      Remove Funding Round
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFundingRound}
                className="btn-secondary"
              >
                Add Funding Round
              </button>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h3>Additional Information</h3>
              <div className="form-group">
                <label>Industry *</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Funding Stage *</label>
                <input
                  type="text"
                  value={formData.fundingStage}
                  onChange={(e) => handleInputChange('fundingStage', e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Funding Amount *</label>
                <input
                  type="number"
                  value={formData.fundingAmount}
                  onChange={(e) => handleInputChange('fundingAmount', Number(e.target.value))}
                  required
                  min="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Team Size *</label>
                <input
                  type="number"
                  value={formData.teamSize}
                  onChange={(e) => handleInputChange('teamSize', Number(e.target.value))}
                  required
                  min="1"
                  className="form-input"
                />
              </div>
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

export default EditStartupForm;
