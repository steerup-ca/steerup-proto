import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AdditionalFundingEntity } from '../types';
import '../styles/DetailPage.css';

const AdditionalFundingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entity, setEntity] = useState<AdditionalFundingEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntity = async () => {
      try {
        if (!id) {
          throw new Error('Entity ID is required');
        }

        const entityDoc = await getDoc(doc(db, 'additionalFundingEntities', id));
        if (!entityDoc.exists()) {
          throw new Error('Entity not found');
        }

        setEntity({ id: entityDoc.id, ...entityDoc.data() } as AdditionalFundingEntity);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching entity:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchEntity();
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

  if (error || !entity) {
    return (
      <div className="detail-page">
        <div className="detail-content">
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-color)' }}>{error || 'Entity not found'}</p>
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
          {entity.iconUrl && (
            <div style={{ 
              width: '4rem',
              height: '4rem',
              borderRadius: 'var(--border-radius)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 'var(--spacing-medium)',
              backgroundColor: 'var(--detail-item-bg-color)'
            }}>
              <img
                src={entity.iconUrl}
                alt={entity.name}
                style={{ 
                  width: '3.5rem',
                  height: '3.5rem',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
          <div>
            <h1 style={{ 
              color: 'var(--text-color)',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              {entity.name}
            </h1>
            <p style={{ color: 'var(--secondary-color)' }}>{entity.label}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-large)' }}>
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
              {entity.description}
            </p>
          </div>

          {entity.credentials && entity.credentials.length > 0 && (
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
                {entity.credentials.map((credential, index) => (
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

          {entity.website && (
            <div>
              <h2 style={{ 
                color: 'var(--text-color)',
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: 'var(--spacing-small)'
              }}>
                Website
              </h2>
              <a
                href={entity.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  color: 'var(--link-color)',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                {entity.website}
              </a>
            </div>
          )}

          <div>
            <h2 style={{ 
              color: 'var(--text-color)',
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: 'var(--spacing-small)'
            }}>
              Type
            </h2>
            <div style={{ 
              display: 'inline-block',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--border-radius)',
              backgroundColor: 'var(--detail-item-bg-color)',
              color: 'var(--text-color)'
            }}>
              {entity.type === 'organization' ? 'Organization' : 'Individual'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalFundingDetailPage;
