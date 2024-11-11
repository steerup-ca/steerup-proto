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
        <div className="detail-content" style={{ backgroundColor: 'var(--card-bg-color)' }}>
          <div className="text-center">
            <p style={{ color: 'var(--text-color)' }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !entity) {
    return (
      <div className="detail-page">
        <div className="detail-content" style={{ backgroundColor: 'var(--card-bg-color)' }}>
          <div className="text-center">
            <p style={{ color: 'var(--text-color)' }}>{error || 'Entity not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="detail-content" style={{ backgroundColor: 'var(--card-bg-color)' }}>
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-sm"
          style={{ color: 'var(--text-color)' }}
        >
          <svg
            className="w-5 h-5 mr-2"
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

        <div className="flex items-center mb-8">
          {entity.iconUrl && (
            <div 
              className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center mr-4"
              style={{ backgroundColor: 'var(--detail-item-bg-color)' }}
            >
              <img
                src={entity.iconUrl}
                alt={entity.name}
                className="w-14 h-14 object-contain"
              />
            </div>
          )}
          <div>
            <h1 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
              {entity.name}
            </h1>
            <p style={{ color: 'var(--secondary-color)' }}>{entity.label}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 
              className="text-lg font-semibold mb-3"
              style={{ color: 'var(--text-color)' }}
            >
              About
            </h2>
            <p 
              className="text-base"
              style={{ color: 'var(--text-color)' }}
            >
              {entity.description}
            </p>
          </div>

          {entity.credentials && entity.credentials.length > 0 && (
            <div>
              <h2 
                className="text-lg font-semibold mb-3"
                style={{ color: 'var(--text-color)' }}
              >
                Credentials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entity.credentials.map((credential, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: 'var(--detail-item-bg-color)' }}
                  >
                    <p style={{ color: 'var(--text-color)' }}>{credential}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {entity.website && (
            <div>
              <h2 
                className="text-lg font-semibold mb-3"
                style={{ color: 'var(--text-color)' }}
              >
                Website
              </h2>
              <a
                href={entity.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base hover:underline"
                style={{ color: 'var(--link-color)' }}
              >
                {entity.website}
              </a>
            </div>
          )}

          <div>
            <h2 
              className="text-lg font-semibold mb-3"
              style={{ color: 'var(--text-color)' }}
            >
              Type
            </h2>
            <div
              className="inline-block px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--detail-item-bg-color)' }}
            >
              <p style={{ color: 'var(--text-color)' }}>
                {entity.type === 'organization' ? 'Organization' : 'Individual'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalFundingDetailPage;
