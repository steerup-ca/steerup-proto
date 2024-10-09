import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StartupsSelection, LeadInvestor, Startup } from '../types';
import Button from './Button';
import './StartupsSelectionCard.css';

// Fallback image as a data URI
const fallbackImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANASURBVHgB7d3NbhMxEAfwsRMqRA+99MIj8AYV4k3gDXgTHqG3qgfEA/AGPAE3qh54g/YGCMG1H7G7iZNs7Vk7djIz/59UVZUg8czueOyxEwIAAAAAAAAAAAAAAADAeGbqBGvtnaqqbur6Iq7X9f+/mJyKZ3POvVfnmJQh1BHXsixfxu2qrh/qEKbJxXNSSu+cc5+VEtWJjYgbY57Fx/xeV6OO8qEsy1eqk5AhMTMexg9/rWKGPLTW3nfOfdX/QTLkUYz6Cx3PrLX2eHV6hlAncZzQiZxzH6y1d/UxZMjpZEjOWRJzxDnnv8f9P+oQMuR0UoZQZqgOIUNOZ3KGkGTIYKr/ZchQZAgRMmQwMoQIGTIYGUKEDBmMDCFChgxGhhAhQwYjQ4iQIYORIUTIkMHIECJkyGBkCBEyZDAyhAgZMhgZQoQMGYwMIUKGDEaGEDmXDKGZITTTOJAhRMiQwcgQImTIYGQIETJkMDKECBkyGBlChAwZjAwhQoYMRoYQIUMGI0OIkCGDkSFEyJDByBAiZMhgZAgRMmQwMoQIGTIYGUKEDBmMDCFChgxGhhAhQwYjQ4iQIYORIUTIkMHIECJkyGBkCBEyZDAyhAgZMhgZQoQMGYwMIUKGDEaGECFDBiNDiJAhg5EhRMiQwcgQImTIYGQIETJkMDKECBkyGBlChAwZjAwhQoYMRoYQIUMGI0OIkCGDkSFEyJDByBAiZMhgZAgRMmQwMoQIGTIYGUKEDBmMDCFChgxGhhAhQwYjQ4iQIYORIUTIkMHIECJkyGBkCBEyZDAyhAgZMhgZQoQMGYwMIUKGDEaGECFDBiNDiJAhg5EhRMiQwcgQImTIYGQIETJkMDKECBkyGBlChAwZjAwhQoYMRoYQIUMGI0OIkCGDkSFEyJDByBAiZMhgZAiRc8mQVVVVT1QHrFarT865L/oIMoTIuWTI7+12+0h1wGaz+VhV1Xd9BBky3PNYz1VCxpgXRVF81UeQIcN5n/HaGPNUJRTH9Gq73T7Ux5AhA8Ux/Jq2qfcqsRj9D4qieKePIUOGe7Zer+/FjHmsEopj+lYcz2/1MQAAAAAAAAAAAAAAAACQ+QvS6KAf0XKnEwAAAABJRU5ErkJggg==';

interface StartupsSelectionCardProps {
  selection: StartupsSelection;
  leadInvestor?: LeadInvestor;
  startups: Startup[];
}

const StartupsSelectionCard: React.FC<StartupsSelectionCardProps> = ({ selection, leadInvestor, startups }) => {
  const progressPercentage = (selection.currentAmount / selection.goal) * 100;
  const navigate = useNavigate();

  useEffect(() => {
    console.log('StartupsSelectionCard rendered');
    console.log('Lead Investor:', JSON.stringify(leadInvestor, null, 2));
    console.log('Startups:', JSON.stringify(startups, null, 2));
  }, [leadInvestor, startups]);

  const getLeadInvestorImage = () => {
    if (leadInvestor && leadInvestor.photo) {
      console.log('Lead Investor Photo:', leadInvestor.photo);
      return leadInvestor.photo;
    }
    console.log('Using fallback image for Lead Investor');
    return fallbackImage;
  };

  const handleStartupClick = (startupId: string) => {
    navigate(`/startup/${startupId}`);
  };

  const handleLeadInvestorClick = () => {
    if (leadInvestor && leadInvestor.id) {
      navigate(`/lead-investor/${leadInvestor.id}`);
    }
  };

  return (
    <div className="card">
      <h2 className="title">{selection.title}</h2>

      <div className="section">
        <h3 className="section-title">SELECTION LEAD</h3>
        <div className="lead-investor-section" onClick={handleLeadInvestorClick}>
          {leadInvestor ? (
            <>
              <img 
                className="lead-investor-image" 
                src={getLeadInvestorImage()} 
                alt={leadInvestor.name || 'Lead Investor'} 
                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
                onError={(e) => {
                  console.error('Error loading lead investor image:', e);
                  e.currentTarget.src = fallbackImage;
                }}
              />
              <div className="lead-investor-info">
                <h4>{leadInvestor.name || 'Unknown Investor'}</h4>
                <p>{leadInvestor.title || 'No title'}</p>
              </div>
            </>
          ) : (
            <p>No lead investor information available</p>
          )}
          <div className="lead-investment">
            <p>Lead Investment:</p>
            <p className="investment-amount">${selection.currentAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">STARTUPS</h3>
        <div className="startups-list">
          {startups.map((startup) => (
            <div 
              key={startup.id} 
              className="startup-item" 
              onClick={() => handleStartupClick(startup.id)}
            >
              <div className="startup-banner" style={{ backgroundImage: `url(${startup.imageUrl || fallbackImage})` }}>
                <div className="startup-info">
                  <h4>{startup.name}</h4>
                  <p>{startup.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="campaign-progress">
        <div className="goal-amount">
          <span>Goal: ${selection.goal.toLocaleString()}</span>
          <span className="current-amount">${selection.currentAmount.toLocaleString()}</span>
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="progress-info">
          <span>{progressPercentage.toFixed(0)}%</span>
          <span>{selection.daysLeft} DAYS LEFT • {selection.backersCount} BACKERS</span>
        </div>
      </div>

      <Button className="contribute-button">Contribute</Button>

      <div className="section">
        <h3 className="section-title">ADDITIONAL FUNDING</h3>
        <div className="additional-funding">
          {selection.additionalFunding.map((funding, index) => (
            <div key={index} className="funding-item">
              <p>{funding.name}</p>
              <p className="funding-amount">${funding.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartupsSelectionCard;