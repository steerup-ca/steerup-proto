import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Founder } from '../types';
import '../styles/theme.css';

interface AddFounderFormProps {
  onSubmit?: (founder: Omit<Founder, 'id'>) => void;
  onCancel?: () => void;
}

type FounderFormData = Omit<Founder, 'id'> & {
  speakingEngagements: string[];
  patents: string[];
  publications: string[];
};

export const AddFounderForm: React.FC<AddFounderFormProps> = ({ onSubmit, onCancel }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<FounderFormData>({
    name: '',
    photo: '',
    title: '',
    bio: '',
    linkedIn: '',
    twitter: '',
    education: [{
      institution: '',
      degree: '',
      field: '',
      yearCompleted: ''
    }],
    previousStartups: [{
      name: '',
      role: '',
      yearStarted: '',
      yearEnded: '',
      description: ''
    }],
    areasOfExpertise: [''],
    yearsOfExperience: 0,
    achievements: [''],
    speakingEngagements: [],
    patents: [],
    publications: []
  });

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
    setSuccessMessage('');
    setErrorMessage('');

    try {
      if (onSubmit) {
        // If used as a sub-component, let parent handle the submission
        onSubmit(formData);
      } else {
        // Standalone usage - handle Firestore directly
        await addDoc(collection(db, 'founders'), formData);
        setSuccessMessage('Founder added successfully!');
        // Reset form
        setFormData({
          name: '',
          photo: '',
          title: '',
          bio: '',
          linkedIn: '',
          twitter: '',
          education: [{
            institution: '',
            degree: '',
            field: '',
            yearCompleted: ''
          }],
          previousStartups: [{
            name: '',
            role: '',
            yearStarted: '',
            yearEnded: '',
            description: ''
          }],
          areasOfExpertise: [''],
          yearsOfExperience: 0,
          achievements: [''],
          speakingEngagements: [],
          patents: [],
          publications: []
        });
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error adding document: ', error);
      if (error instanceof Error) {
        setErrorMessage(`Error adding Founder: ${error.message}`);
      } else {
        setErrorMessage('An unknown error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="steerup-form">
        <h2 className="form-title">Add Founder</h2>
        
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        
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
          <button type="submit" className="btn-primary">
            Add Founder
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddFounderForm;
