import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LeadInvestor } from '../types';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Button from './Button';
import '../styles/DetailPage.css';
import './LeadInvestorDetailsPage.css';

const LeadInvestorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [leadInvestor, setLeadInvestor] = useState<LeadInvestor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeadInvestor = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'leadInvestors', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLeadInvestor({ id: docSnap.id, ...docSnap.data() } as LeadInvestor);
        } else {
          setError('Lead investor not found');
        }
      } catch (error) {
        setError('Error fetching lead investor details');
        console.error('Error fetching lead investor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadInvestor();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="detail-page">Loading...</div>;
  }

  if (error) {
    return <div className="detail-page">Error: {error}</div>;
  }

  if (!leadInvestor) {
    return <div className="detail-page">Lead investor not found</div>;
  }

  return (
    <div className="detail-page lead-investor-details-page max-width-800">
      <Button onClick={handleBack} className="back-button">← Back</Button>
      <div className="detail-card lead-investor-card">
        <div className="detail-header">
          <img src={leadInvestor.photo} alt={leadInvestor.name} className="detail-image lead-investor-image" />
          <div className="detail-info">
            <h1 className="detail-name">{leadInvestor.name}</h1>
            <p className="detail-subtitle lead-investor-title">{leadInvestor.title}</p>
            <p className="detail-subtitle lead-investor-company">{leadInvestor.company}</p>
          </div>
        </div>
        <div className="detail-description lead-investor-bio">
          <p>{leadInvestor.bio}</p>
        </div>
        {leadInvestor.credentials && leadInvestor.credentials.length > 0 && (
          <div className="detail-section credentials-section">
            <h2 className="section-title">Credentials</h2>
            <ul className="detail-list">
              {leadInvestor.credentials.map((credential, index) => (
                <li key={index} className="detail-list-item">{credential}</li>
              ))}
            </ul>
          </div>
        )}
        {leadInvestor.areasOfExpertise && leadInvestor.areasOfExpertise.length > 0 && (
          <div className="detail-section expertise-section">
            <h2 className="section-title">Areas of Expertise</h2>
            <ul className="detail-list">
              {leadInvestor.areasOfExpertise.map((area, index) => (
                <li key={index} className="detail-list-item">{area}</li>
              ))}
            </ul>
          </div>
        )}
        {leadInvestor.investmentHistory && leadInvestor.investmentHistory.length > 0 && (
          <div className="detail-section investment-history-section">
            <h2 className="section-title">Investment History</h2>
            <ul className="detail-list">
              {leadInvestor.investmentHistory.map((investment, index) => (
                <li key={index} className="detail-list-item investment-item">
                  <span className="investment-company">{investment.companyName}</span>
                  <span className="investment-amount">${investment.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadInvestorDetailsPage;