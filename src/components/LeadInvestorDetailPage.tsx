import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { LeadInvestor } from '../types';
import '../styles/DetailPage.css';

const LeadInvestorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [investor, setInvestor] = useState<LeadInvestor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestor = async () => {
      try {
        if (!id) {
          throw new Error('Investor ID is required');
        }

        const investorDoc = await getDoc(doc(db, 'leadInvestors', id));
        if (!investorDoc.exists()) {
          throw new Error('Investor not found');
        }

        setInvestor({ id: investorDoc.id, ...investorDoc.data() } as LeadInvestor);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching investor:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchInvestor();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-content">
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-color)' }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !investor) {
    return (
      <div className="detail-page">
        <div className="detail-content">
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-color)' }}>{error || 'Investor not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="detail-content">
        <button
          onClick={handleBack}
          style={{ 
            color: 'var(--text-color)',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.875rem',
            marginBottom: 'var(--spacing-large)'
          }}
        >
          <svg
            style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-large)' }}>
          <div style={{ 
            width: '6rem',
            height: '6rem',
            borderRadius: 'var(--border-radius)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 'var(--spacing-large)',
            backgroundColor: 'var(--detail-item-bg-color)'
          }}>
            {investor.photo ? (
              <img
                src={investor.photo}
                alt={investor.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ 
                fontSize: '2.25rem',
                color: 'var(--text-color)'
              }}>
                {investor.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h1 style={{ 
              color: 'var(--text-color)',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              {investor.name}
            </h1>
            <p style={{ color: 'var(--secondary-color)' }}>{investor.title}</p>
            <p style={{ color: 'var(--secondary-color)' }}>{investor.company}</p>
            {investor.linkedIn && (
              <a
                href={investor.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '0.5rem',
                  color: 'var(--link-color)',
                  textDecoration: 'none'
                }}
              >
                <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn Profile
              </a>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-large)' }}>
          {investor.bio && (
            <div>
              <h2 style={{ 
                color: 'var(--text-color)',
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: 'var(--spacing-small)'
              }}>
                About
              </h2>
              <p style={{ color: 'var(--text-color)' }}>
                {investor.bio}
              </p>
            </div>
          )}

          {investor.areasOfExpertise && investor.areasOfExpertise.length > 0 && (
            <div>
              <h2 style={{ 
                color: 'var(--text-color)',
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: 'var(--spacing-small)'
              }}>
                Areas of Expertise
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {investor.areasOfExpertise.map((area, index) => (
                  <div
                    key={index}
                    style={{ 
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--border-radius)',
                      backgroundColor: 'var(--detail-item-bg-color)',
                      color: 'var(--text-color)'
                    }}
                  >
                    {area}
                  </div>
                ))}
              </div>
            </div>
          )}

          {investor.credentials && investor.credentials.length > 0 && (
            <div>
              <h2 style={{ 
                color: 'var(--text-color)',
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: 'var(--spacing-small)'
              }}>
                Credentials
              </h2>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 'var(--spacing-medium)'
              }}>
                {investor.credentials.map((credential, index) => (
                  <div
                    key={index}
                    style={{ 
                      padding: 'var(--spacing-medium)',
                      borderRadius: 'var(--border-radius)',
                      backgroundColor: 'var(--detail-item-bg-color)',
                      color: 'var(--text-color)'
                    }}
                  >
                    {credential}
                  </div>
                ))}
              </div>
            </div>
          )}

          {investor.investmentHistory && investor.investmentHistory.length > 0 && (
            <div>
              <h2 style={{ 
                color: 'var(--text-color)',
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: 'var(--spacing-small)'
              }}>
                Investment History
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-small)' }}>
                {investor.investmentHistory.map((investment, index) => (
                  <div
                    key={index}
                    style={{ 
                      padding: 'var(--spacing-medium)',
                      borderRadius: 'var(--border-radius)',
                      backgroundColor: 'var(--detail-item-bg-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <p style={{ color: 'var(--text-color)' }}>{investment.companyName}</p>
                    <p style={{ 
                      color: 'var(--success-color)',
                      fontWeight: '600'
                    }}>
                      ${investment.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadInvestorDetailPage;
