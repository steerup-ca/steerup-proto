import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Founder } from '../types';
import '../styles/theme.css';

interface EditFounderFormProps {
  onCancel: () => void;
}

type FounderFormData = Omit<Founder, 'id'> & {
  speakingEngagements: string[];
  patents: string[];
  publications: string[];
};

export const EditFounderForm: React.FC<EditFounderFormProps> = ({ onCancel }) => {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [selectedFounderId, setSelectedFounderId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FounderFormData>({
    name: '',
    photo: '',
    title: '',
    bio: '',
    linkedIn: '',
    twitter: '',
    education: [],
    previousStartups: [],
    areasOfExpertise: [],
    yearsOfExperience: 0,
    achievements: [],
    speakingEngagements: [],
    patents: [],
    publications: []
  });

  // Fetch founders from Firestore
  useEffect(() => {
    const fetchFounders = async () => {
      try {
        const foundersSnapshot = await getDocs(collection(db, 'founders'));
        const foundersData = foundersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Founder[];
        setFounders(foundersData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch founders');
        setLoading(false);
      }
    };

    fetchFounders();
  }, []);

  // Update form data when founder is selected
  const handleFounderSelect = (founderId: string) => {
    const selectedFounder = founders.find(f => f.id === founderId);
    if (selectedFounder) {
      setSelectedFounderId(founderId);
      setFormData({
        name: selectedFounder.name,
        photo: selectedFounder.photo,
        title: selectedFounder.title,
        bio: selectedFounder.bio,
        linkedIn: selectedFounder.linkedIn || '',
        twitter: selectedFounder.twitter || '',
        education: selectedFounder.education,
        previousStartups: selectedFounder.previousStartups,
        areasOfExpertise: selectedFounder.areasOfExpertise,
        yearsOfExperience: selectedFounder.yearsOfExperience,
        achievements: selectedFounder.achievements,
        speakingEngagements: selectedFounder.speakingEngagements || [],
        patents: selectedFounder.patents || [],
        publications: selectedFounder.publications || []
      });
    }
  };

  const handleInputChange = (field: keyof FounderFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: keyof FounderFormData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: keyof FounderFormData, defaultValue: any = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), defaultValue]
    }));
  };

  const removeArrayItem = (field: keyof FounderFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handlePreviousStartupChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      previousStartups: prev.previousStartups.map((startup, i) => 
        i === index ? { ...startup, [field]: value } : startup
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFounderId) {
      setError('Please select a founder to edit');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const founderRef = doc(db, 'founders', selectedFounderId);
      await updateDoc(founderRef, formData);
      setSaving(false);
      onCancel(); // Close form after successful save
    } catch (err) {
      setError('Failed to update founder');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading founders...</div>;
  }

  return (
    <div className="modal-overlay" style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'var(--card-bg-color)',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        marginTop: '20px'
      }}>
        <form onSubmit={handleSubmit} className="form-container">
          <h2>Edit Founder</h2>
          
          {error && <div className="error-message">{error}</div>}

          {/* Founder Selection */}
          <div className="form-section">
            <div className="form-group">
              <label>Select Founder *</label>
              <select
                value={selectedFounderId}
                onChange={(e) => handleFounderSelect(e.target.value)}
                required
                className="form-select"
                style={{
                  backgroundColor: 'var(--input-bg-color)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)',
                  padding: '8px',
                  borderRadius: '4px',
                  width: '100%'
                }}
              >
                <option value="">Select a founder</option>
                {founders.map(founder => (
                  <option key={founder.id} value={founder.id}>
                    {founder.name} - {founder.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedFounderId && (
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

                <div className="form-group">
                  <label>Twitter Handle</label>
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Education */}
              <div className="form-section">
                <h3>Education</h3>
                {formData.education.map((edu, index) => (
                  <div key={index} className="form-subsection">
                    <div className="form-group">
                      <label>Institution *</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Degree *</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Field *</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Year Completed *</label>
                      <input
                        type="text"
                        value={edu.yearCompleted}
                        onChange={(e) => handleEducationChange(index, 'yearCompleted', e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('education', index)}
                        className="btn-secondary"
                      >
                        Remove Education
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('education', {
                    institution: '',
                    degree: '',
                    field: '',
                    yearCompleted: ''
                  })}
                  className="btn-secondary"
                >
                  Add Education
                </button>
              </div>

              {/* Previous Startups */}
              <div className="form-section">
                <h3>Previous Startups</h3>
                {formData.previousStartups.map((startup, index) => (
                  <div key={index} className="form-subsection">
                    <div className="form-group">
                      <label>Company Name *</label>
                      <input
                        type="text"
                        value={startup.name}
                        onChange={(e) => handlePreviousStartupChange(index, 'name', e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Role *</label>
                      <input
                        type="text"
                        value={startup.role}
                        onChange={(e) => handlePreviousStartupChange(index, 'role', e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Year Started *</label>
                      <input
                        type="text"
                        value={startup.yearStarted}
                        onChange={(e) => handlePreviousStartupChange(index, 'yearStarted', e.target.value)}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Year Ended</label>
                      <input
                        type="text"
                        value={startup.yearEnded || ''}
                        onChange={(e) => handlePreviousStartupChange(index, 'yearEnded', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Exit Type</label>
                      <select
                        value={startup.exitType || ''}
                        onChange={(e) => handlePreviousStartupChange(index, 'exitType', e.target.value)}
                        className="form-select"
                        style={{
                          backgroundColor: 'var(--input-bg-color)',
                          color: 'var(--text-color)',
                          border: '1px solid var(--border-color)',
                          padding: '8px',
                          borderRadius: '4px',
                          width: '100%'
                        }}
                      >
                        <option value="">Select Exit Type</option>
                        <option value="acquisition">Acquisition</option>
                        <option value="ipo">IPO</option>
                        <option value="shutdown">Shutdown</option>
                        <option value="ongoing">Ongoing</option>
                      </select>
                    </div>
                    {startup.exitType === 'acquisition' || startup.exitType === 'ipo' ? (
                      <div className="form-group">
                        <label>Exit Value ($)</label>
                        <input
                          type="number"
                          value={startup.exitValue || ''}
                          onChange={(e) => handlePreviousStartupChange(index, 'exitValue', Number(e.target.value))}
                          className="form-input"
                        />
                      </div>
                    ) : null}
                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        value={startup.description}
                        onChange={(e) => handlePreviousStartupChange(index, 'description', e.target.value)}
                        required
                        className="form-textarea"
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('previousStartups', index)}
                        className="btn-secondary"
                      >
                        Remove Startup
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('previousStartups', {
                    name: '',
                    role: '',
                    yearStarted: '',
                    yearEnded: '',
                    description: ''
                  })}
                  className="btn-secondary"
                >
                  Add Previous Startup
                </button>
              </div>

              {/* Expertise and Achievements */}
              <div className="form-section">
                <h3>Expertise and Achievements</h3>
                
                <div className="form-group">
                  <label>Years of Experience *</label>
                  <input
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => handleInputChange('yearsOfExperience', Number(e.target.value))}
                    required
                    min="0"
                    className="form-input"
                  />
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

                <div className="form-group">
                  <label>Achievements *</label>
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="array-input-group">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => handleArrayInputChange('achievements', index, e.target.value)}
                        required
                        className="form-input"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('achievements', index)}
                          className="btn-secondary"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('achievements')}
                    className="btn-secondary"
                  >
                    Add Achievement
                  </button>
                </div>

                {/* Optional Arrays */}
                <div className="form-group">
                  <label>Speaking Engagements</label>
                  {formData.speakingEngagements.map((engagement, index) => (
                    <div key={index} className="array-input-group">
                      <input
                        type="text"
                        value={engagement}
                        onChange={(e) => handleArrayInputChange('speakingEngagements', index, e.target.value)}
                        className="form-input"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('speakingEngagements', index)}
                        className="btn-secondary"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('speakingEngagements')}
                    className="btn-secondary"
                  >
                    Add Speaking Engagement
                  </button>
                </div>

                <div className="form-group">
                  <label>Patents</label>
                  {formData.patents.map((patent, index) => (
                    <div key={index} className="array-input-group">
                      <input
                        type="text"
                        value={patent}
                        onChange={(e) => handleArrayInputChange('patents', index, e.target.value)}
                        className="form-input"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('patents', index)}
                        className="btn-secondary"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('patents')}
                    className="btn-secondary"
                  >
                    Add Patent
                  </button>
                </div>

                <div className="form-group">
                  <label>Publications</label>
                  {formData.publications.map((publication, index) => (
                    <div key={index} className="array-input-group">
                      <input
                        type="text"
                        value={publication}
                        onChange={(e) => handleArrayInputChange('publications', index, e.target.value)}
                        className="form-input"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('publications', index)}
                        className="btn-secondary"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('publications')}
                    className="btn-secondary"
                  >
                    Add Publication
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={onCancel} className="btn-secondary" disabled={saving}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditFounderForm;
