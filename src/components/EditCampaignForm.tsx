import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Campaign, CampaignAdditionalFunding, Startup } from '../types';
import '../styles/theme.css';
import { useNavigate } from 'react-router-dom';

interface EditCampaignFormProps {
  onCancel?: () => void;
}

type CampaignFormData = Omit<Campaign, 'id' | 'creation_date'> & {
  additionalFunding: CampaignAdditionalFunding[];
};

interface CampaignWithStartup extends Campaign {
  startupName?: string;
}

const EditCampaignForm: React.FC<EditCampaignFormProps> = ({ onCancel }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignWithStartup[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [formData, setFormData] = useState<CampaignFormData>({
    startupId: '',
    leadInvestorId: '',
    steerup_amount: 0,
    offeringDetails: {
      minAmount: 0,
      maxAmount: 0,
      equity: 0,
      valuation: 0,
      offeringDocument: ''
    },
    additionalFunding: []
  });

  useEffect(() => {
    const fetchCampaignsAndStartups = async () => {
      try {
        // Fetch campaigns
        const campaignsSnapshot = await getDocs(collection(db, 'campaigns'));
        const campaignsData = campaignsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CampaignWithStartup[];

        // Fetch startups
        const startupsSnapshot = await getDocs(collection(db, 'startups'));
        const startups = startupsSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data() as Startup;
          return acc;
        }, {} as { [key: string]: Startup });

        // Combine campaign data with startup names
        const campaignsWithStartups = campaignsData.map(campaign => ({
          ...campaign,
          startupName: startups[campaign.startupId]?.name || 'Unknown Startup'
        }));

        setCampaigns(campaignsWithStartups);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch campaigns');
        setLoading(false);
      }
    };

    fetchCampaignsAndStartups();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toISOString().split('T')[0];
  };

  const handleCampaignSelect = (campaignId: string) => {
    const selectedCampaign = campaigns.find(c => c.id === campaignId);
    if (selectedCampaign) {
      setSelectedCampaignId(campaignId);
      setFormData({
        startupId: selectedCampaign.startupId,
        leadInvestorId: selectedCampaign.leadInvestorId,
        steerup_amount: selectedCampaign.steerup_amount,
        offeringDetails: selectedCampaign.offeringDetails,
        additionalFunding: selectedCampaign.additionalFunding || []
      });
    }
  };

  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOfferingDetailsChange = (field: keyof Campaign['offeringDetails'], value: any) => {
    setFormData(prev => ({
      ...prev,
      offeringDetails: {
        ...prev.offeringDetails,
        [field]: value
      }
    }));
  };

  const handleAdditionalFundingChange = (index: number, field: keyof CampaignAdditionalFunding, value: any) => {
    setFormData(prev => ({
      ...prev,
      additionalFunding: prev.additionalFunding.map((funding, i) =>
        i === index ? { ...funding, [field]: value } : funding
      )
    }));
  };

  const addAdditionalFunding = () => {
    setFormData(prev => ({
      ...prev,
      additionalFunding: [...prev.additionalFunding, { entityId: '', amount: 0 }]
    }));
  };

  const removeAdditionalFunding = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalFunding: prev.additionalFunding.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId) {
      setError('Please select a campaign to edit');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const campaignRef = doc(db, 'campaigns', selectedCampaignId);
      await updateDoc(campaignRef, formData);
      setSaving(false);
      setSuccessMessage('Campaign updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        if (onCancel) {
          onCancel();
        } else {
          navigate(-1);
        }
      }, 2000);
    } catch (err) {
      setError('Failed to update campaign');
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
    return <div className="loading">Loading campaigns...</div>;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="steerup-form">
        <h2 className="form-title">Edit Campaign</h2>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Campaign Selection */}
        <div className="form-section">
          <div className="form-group">
            <label>Select Campaign *</label>
            <select
              value={selectedCampaignId}
              onChange={(e) => handleCampaignSelect(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select a campaign</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {`${campaign.startupName}-${formatDate(campaign.creation_date)}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedCampaignId && (
          <>
            {/* Basic Information */}
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-group">
                <label>Startup ID *</label>
                <input
                  type="text"
                  value={formData.startupId}
                  onChange={(e) => handleInputChange('startupId', e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Lead Investor ID *</label>
                <input
                  type="text"
                  value={formData.leadInvestorId}
                  onChange={(e) => handleInputChange('leadInvestorId', e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Steerup Amount *</label>
                <input
                  type="number"
                  value={formData.steerup_amount}
                  onChange={(e) => handleInputChange('steerup_amount', Number(e.target.value))}
                  required
                  min="0"
                  className="form-input"
                />
              </div>
            </div>

            {/* Offering Details */}
            <div className="form-section">
              <h3>Offering Details</h3>
              <div className="form-group">
                <label>Minimum Amount *</label>
                <input
                  type="number"
                  value={formData.offeringDetails.minAmount}
                  onChange={(e) => handleOfferingDetailsChange('minAmount', Number(e.target.value))}
                  required
                  min="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Maximum Amount *</label>
                <input
                  type="number"
                  value={formData.offeringDetails.maxAmount}
                  onChange={(e) => handleOfferingDetailsChange('maxAmount', Number(e.target.value))}
                  required
                  min="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Equity Percentage *</label>
                <input
                  type="number"
                  value={formData.offeringDetails.equity}
                  onChange={(e) => handleOfferingDetailsChange('equity', Number(e.target.value))}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Valuation *</label>
                <input
                  type="number"
                  value={formData.offeringDetails.valuation}
                  onChange={(e) => handleOfferingDetailsChange('valuation', Number(e.target.value))}
                  required
                  min="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Offering Document URL *</label>
                <input
                  type="url"
                  value={formData.offeringDetails.offeringDocument}
                  onChange={(e) => handleOfferingDetailsChange('offeringDocument', e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Additional Funding */}
            <div className="form-section">
              <h3>Additional Funding</h3>
              {formData.additionalFunding.map((funding, index) => (
                <div key={index} className="form-subsection">
                  <div className="form-group">
                    <label>Entity ID *</label>
                    <input
                      type="text"
                      value={funding.entityId}
                      onChange={(e) => handleAdditionalFundingChange(index, 'entityId', e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Amount *</label>
                    <input
                      type="number"
                      value={funding.amount}
                      onChange={(e) => handleAdditionalFundingChange(index, 'amount', Number(e.target.value))}
                      required
                      min="0"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Locked</label>
                    <input
                      type="checkbox"
                      checked={funding.isLocked}
                      onChange={(e) => handleAdditionalFundingChange(index, 'isLocked', e.target.checked)}
                      className="form-input"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeAdditionalFunding(index)}
                    className="btn-secondary"
                  >
                    Remove Funding
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAdditionalFunding}
                className="btn-secondary"
              >
                Add Additional Funding
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

export default EditCampaignForm;
