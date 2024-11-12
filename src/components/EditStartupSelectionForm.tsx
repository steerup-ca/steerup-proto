import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { StartupsSelection, StartupProportion, CampaignAdditionalFunding, InvestmentType, AdditionalFundingEntity, DebtTerms } from '../types';
import '../styles/theme.css';
import { useNavigate } from 'react-router-dom';

interface EditStartupSelectionFormProps {
  onCancel?: () => void;
}

type StartupSelectionFormData = Omit<StartupsSelection, 'id'>;

const defaultFormData: StartupSelectionFormData = {
  title: '',
  description: '',
  selectionLead: '',
  campaigns: [],
  startupProportions: [],
  goal: 0,
  currentAmount: 0,
  daysLeft: 0,
  backersCount: 0,
  additionalFunding: [],
  investmentType: InvestmentType.EQUITY,
  debtTerms: undefined
};

const defaultDebtTerms: DebtTerms = {
  interestRate: 0,
  maturityMonths: 0,
  paymentSchedule: 'monthly'
};

// Helper function to remove undefined values from an object
const removeUndefined = (obj: any): any => {
  const newObj: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        newObj[key] = removeUndefined(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }
  });
  return newObj;
};

export const EditStartupSelectionForm: React.FC<EditStartupSelectionFormProps> = ({ onCancel }) => {
  const navigate = useNavigate();
  const [selections, setSelections] = useState<StartupsSelection[]>([]);
  const [fundingEntities, setFundingEntities] = useState<AdditionalFundingEntity[]>([]);
  const [selectedSelectionId, setSelectedSelectionId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [formData, setFormData] = useState<StartupSelectionFormData>(defaultFormData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch selections
        const selectionsSnapshot = await getDocs(collection(db, 'startupsSelections'));
        const selectionsData = selectionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          campaigns: doc.data().campaigns || [],
          startupProportions: doc.data().startupProportions || [],
          additionalFunding: doc.data().additionalFunding || []
        })) as StartupsSelection[];

        setSelections(selectionsData);

        // Fetch additional funding entities
        const entitiesSnapshot = await getDocs(collection(db, 'additionalFundingEntities'));
        const entitiesData = entitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AdditionalFundingEntity[];

        setFundingEntities(entitiesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectionSelect = async (selectionId: string) => {
    try {
      if (!selectionId) {
        setFormData(defaultFormData);
        setSelectedSelectionId('');
        return;
      }

      setLoading(true);
      setError(null);

      const selectionRef = doc(db, 'startupsSelections', selectionId);
      const selectionDoc = await getDoc(selectionRef);

      if (!selectionDoc.exists()) {
        throw new Error('Selected startup selection not found');
      }

      const data = selectionDoc.data() as Omit<StartupsSelection, 'id'>;
      
      // Ensure all arrays are initialized even if undefined in the data
      const formattedData: StartupSelectionFormData = {
        title: data.title || '',
        description: data.description || '',
        selectionLead: data.selectionLead || '',
        campaigns: data.campaigns || [],
        startupProportions: data.startupProportions || [],
        goal: data.goal || 0,
        currentAmount: data.currentAmount || 0,
        daysLeft: data.daysLeft || 0,
        backersCount: data.backersCount || 0,
        additionalFunding: data.additionalFunding || [],
        investmentType: data.investmentType || InvestmentType.EQUITY,
        debtTerms: data.investmentType === InvestmentType.DEBT 
          ? { ...defaultDebtTerms, ...data.debtTerms }
          : undefined
      };

      setSelectedSelectionId(selectionId);
      setFormData(formattedData);
    } catch (err) {
      console.error('Error selecting startup selection:', err);
      setError('Failed to load startup selection details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof StartupSelectionFormData, value: any) => {
    setFormData(prev => {
      if (field === 'investmentType') {
        // When switching to equity, remove debtTerms
        if (value === InvestmentType.EQUITY) {
          return {
            ...prev,
            [field]: value,
            debtTerms: undefined
          };
        }
        // When switching to debt, initialize debtTerms with defaults
        if (value === InvestmentType.DEBT) {
          return {
            ...prev,
            [field]: value,
            debtTerms: defaultDebtTerms
          };
        }
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleStartupProportionChange = (index: number, field: keyof StartupProportion, value: any) => {
    setFormData(prev => ({
      ...prev,
      startupProportions: (prev.startupProportions || []).map((prop, i) => 
        i === index ? { ...prop, [field]: value } : prop
      )
    }));
  };

  const handleAdditionalFundingChange = (index: number, field: keyof CampaignAdditionalFunding, value: any) => {
    setFormData(prev => ({
      ...prev,
      additionalFunding: (prev.additionalFunding || []).map((funding, i) => 
        i === index ? { ...funding, [field]: value } : funding
      )
    }));
  };

  const addStartupProportion = () => {
    setFormData(prev => ({
      ...prev,
      startupProportions: [...(prev.startupProportions || []), { campaignId: '', proportion: 0 }]
    }));
  };

  const removeStartupProportion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      startupProportions: (prev.startupProportions || []).filter((_, i) => i !== index)
    }));
  };

  const addAdditionalFunding = () => {
    setFormData(prev => ({
      ...prev,
      additionalFunding: [...(prev.additionalFunding || []), { entityId: '', amount: 0, isLocked: false }]
    }));
  };

  const removeAdditionalFunding = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalFunding: (prev.additionalFunding || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSelectionId) {
      setError('Please select a startup selection to edit');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const selectionRef = doc(db, 'startupsSelections', selectedSelectionId);
      
      // Clean up the data before sending to Firebase
      const cleanData = {
        ...formData,
        campaigns: formData.campaigns || [],
        startupProportions: formData.startupProportions || [],
        additionalFunding: formData.additionalFunding || [],
        // Only include debtTerms if it's debt type
        ...(formData.investmentType === InvestmentType.DEBT && formData.debtTerms
          ? { debtTerms: formData.debtTerms }
          : { debtTerms: null }) // Explicitly set to null if not debt type
      };

      // Remove any remaining undefined values
      const finalData = removeUndefined(cleanData);

      await updateDoc(selectionRef, finalData);
      setSaving(false);
      setSuccessMessage('Startup selection updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        if (onCancel) {
          onCancel();
        } else {
          navigate(-1);
        }
      }, 2000);
    } catch (err) {
      console.error('Error updating startup selection:', err);
      setError('Failed to update startup selection. Please try again.');
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
    return <div className="loading">Loading...</div>;
  }

  if (error && !selections.length) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="steerup-form">
        <h2 className="form-title">Edit Startup Selection</h2>
        
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Selection Dropdown */}
        <div className="form-section">
          <div className="form-group">
            <label>Select Startup Selection *</label>
            <select
              value={selectedSelectionId}
              onChange={(e) => handleSelectionSelect(e.target.value)}
              required
              className="form-select"
              disabled={loading}
            >
              <option value="">Select a startup selection</option>
              {selections.map(selection => (
                <option key={selection.id} value={selection.id}>
                  {selection.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedSelectionId && !loading && (
          <>
            {/* Basic Information */}
            <div className="form-section">
              <h3>Basic Information</h3>
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
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Selection Lead *</label>
                <input
                  type="text"
                  value={formData.selectionLead}
                  onChange={(e) => handleInputChange('selectionLead', e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Investment Type *</label>
                <select
                  value={formData.investmentType}
                  onChange={(e) => handleInputChange('investmentType', e.target.value as InvestmentType)}
                  required
                  className="form-select"
                >
                  <option value={InvestmentType.EQUITY}>Equity</option>
                  <option value={InvestmentType.DEBT}>Debt</option>
                </select>
              </div>

              {formData.investmentType === InvestmentType.DEBT && (
                <div className="form-subsection">
                  <h4>Debt Terms</h4>
                  <div className="form-group">
                    <label>Interest Rate (%)</label>
                    <input
                      type="number"
                      value={formData.debtTerms?.interestRate || 0}
                      onChange={(e) => handleInputChange('debtTerms', {
                        ...formData.debtTerms,
                        interestRate: Number(e.target.value)
                      })}
                      step="0.01"
                      min="0"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Maturity (Months)</label>
                    <input
                      type="number"
                      value={formData.debtTerms?.maturityMonths || 0}
                      onChange={(e) => handleInputChange('debtTerms', {
                        ...formData.debtTerms,
                        maturityMonths: Number(e.target.value)
                      })}
                      min="1"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Schedule</label>
                    <select
                      value={formData.debtTerms?.paymentSchedule || 'monthly'}
                      onChange={(e) => handleInputChange('debtTerms', {
                        ...formData.debtTerms,
                        paymentSchedule: e.target.value as 'monthly' | 'quarterly' | 'annually'
                      })}
                      className="form-select"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Funding Information */}
            <div className="form-section">
              <h3>Funding Information</h3>
              <div className="form-group">
                <label>Goal Amount ($) *</label>
                <input
                  type="number"
                  value={formData.goal}
                  onChange={(e) => handleInputChange('goal', Number(e.target.value))}
                  required
                  min="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Current Amount ($) *</label>
                <input
                  type="number"
                  value={formData.currentAmount}
                  onChange={(e) => handleInputChange('currentAmount', Number(e.target.value))}
                  required
                  min="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Days Left *</label>
                <input
                  type="number"
                  value={formData.daysLeft}
                  onChange={(e) => handleInputChange('daysLeft', Number(e.target.value))}
                  required
                  min="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Backers Count *</label>
                <input
                  type="number"
                  value={formData.backersCount}
                  onChange={(e) => handleInputChange('backersCount', Number(e.target.value))}
                  required
                  min="0"
                  className="form-input"
                />
              </div>
            </div>

            {/* Startup Proportions */}
            <div className="form-section">
              <h3>Startup Proportions</h3>
              {(formData.startupProportions || []).map((proportion, index) => (
                <div key={index} className="form-subsection">
                  <div className="form-group">
                    <label>Campaign ID *</label>
                    <input
                      type="text"
                      value={proportion.campaignId}
                      onChange={(e) => handleStartupProportionChange(index, 'campaignId', e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Proportion *</label>
                    <input
                      type="number"
                      value={proportion.proportion}
                      onChange={(e) => handleStartupProportionChange(index, 'proportion', Number(e.target.value))}
                      required
                      step="0.01"
                      min="0"
                      max="1"
                      className="form-input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStartupProportion(index)}
                    className="btn-secondary"
                  >
                    Remove Proportion
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addStartupProportion}
                className="btn-secondary"
              >
                Add Startup Proportion
              </button>
            </div>

            {/* Additional Funding */}
            <div className="form-section">
              <h3>Additional Funding</h3>
              {(formData.additionalFunding || []).map((funding, index) => (
                <div key={index} className="form-subsection">
                  <div className="form-group">
                    <label>Additional Funding Entity *</label>
                    <select
                      value={funding.entityId}
                      onChange={(e) => handleAdditionalFundingChange(index, 'entityId', e.target.value)}
                      required
                      className="form-select"
                    >
                      <option value="">Select an entity</option>
                      {fundingEntities.map(entity => (
                        <option key={entity.id} value={entity.id}>
                          {entity.name} - {entity.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Amount ($) *</label>
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
                    <label>
                      <input
                        type="checkbox"
                        checked={funding.isLocked}
                        onChange={(e) => handleAdditionalFundingChange(index, 'isLocked', e.target.checked)}
                        className="form-checkbox"
                      />
                      Locked
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAdditionalFunding(index)}
                    className="btn-secondary"
                  >
                    Remove Additional Funding
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

export default EditStartupSelectionForm;
