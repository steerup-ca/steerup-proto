import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Startup, Founder } from '../types';
import '../styles/DetailPage.css';

const StartupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [founders, setFounders] = useState<{ [key: string]: Founder }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        if (!id) {
          throw new Error('Startup ID is required');
        }

        const startupDoc = await getDoc(doc(db, 'startups', id));
        if (!startupDoc.exists()) {
          throw new Error('Startup not found');
        }

        const startupData = { id: startupDoc.id, ...startupDoc.data() } as Startup;
        setStartup(startupData);

        // Fetch founders if they exist
        if (startupData.founders && startupData.founders.length > 0) {
          const foundersData: { [key: string]: Founder } = {};
          for (const founderId of startupData.founders) {
            try {
              const founderDoc = await getDoc(doc(db, 'founders', founderId));
              if (founderDoc.exists()) {
                foundersData[founderId] = { id: founderDoc.id, ...founderDoc.data() } as Founder;
              }
            } catch (founderErr) {
              console.error(`Error fetching founder ${founderId}:`, founderErr);
              // Continue with other founders even if one fails
            }
          }
          setFounders(foundersData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching startup:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchStartup();
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

  if (error || !startup) {
    return (
      <div className="detail-page">
        <div className="detail-content" style={{ backgroundColor: 'var(--card-bg-color)' }}>
          <div className="text-center">
            <p style={{ color: 'var(--text-color)' }}>{error || 'Startup not found'}</p>
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
          <div 
            className="w-24 h-24 rounded-lg overflow-hidden flex items-center justify-center mr-6"
            style={{ backgroundColor: 'var(--detail-item-bg-color)' }}
          >
            <img
              src={startup.imageUrl}
              alt={startup.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
              {startup.name}
            </h1>
            <p style={{ color: 'var(--secondary-color)' }}>Founded in {startup.foundedYear}</p>
            <p style={{ color: 'var(--secondary-color)' }}>{startup.location}</p>
          </div>
        </div>

        <div className="space-y-8">
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
              {startup.description}
            </p>
          </div>

          <div>
            <h2 
              className="text-lg font-semibold mb-3"
              style={{ color: 'var(--text-color)' }}
            >
              Founders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {startup.founders && startup.founders.length > 0 ? (
                startup.founders.map((founderId) => {
                  const founder = founders[founderId];
                  if (!founder) return null;
                  
                  return (
                    <div
                      key={founderId}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: 'var(--detail-item-bg-color)' }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                          <img
                            src={founder.photo || 'https://via.placeholder.com/150'}
                            alt={founder.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 style={{ color: 'var(--text-color)' }} className="font-semibold">
                            {founder.name}
                          </h3>
                          <p style={{ color: 'var(--secondary-color)' }}>{founder.title}</p>
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-color)' }} className="mb-3">
                        {founder.bio}
                      </p>
                      <div className="space-y-2">
                        {founder.education && founder.education.length > 0 && (
                          <div>
                            <p style={{ color: 'var(--secondary-color)' }} className="text-sm">Education:</p>
                            <ul className="list-disc list-inside">
                              {founder.education.map((edu, index) => (
                                <li key={index} style={{ color: 'var(--text-color)' }}>
                                  {edu.degree} in {edu.field} from {edu.institution} ({edu.yearCompleted})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {founder.previousStartups && founder.previousStartups.length > 0 && (
                          <div>
                            <p style={{ color: 'var(--secondary-color)' }} className="text-sm">Previous Startups:</p>
                            <ul className="list-disc list-inside">
                              {founder.previousStartups.map((startup, index) => (
                                <li key={index} style={{ color: 'var(--text-color)' }}>
                                  {startup.name} - {startup.role} ({startup.yearStarted}-{startup.yearEnded || 'Present'})
                                  {startup.exitType && ` • ${startup.exitType.charAt(0).toUpperCase() + startup.exitType.slice(1)}`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {founder.areasOfExpertise && founder.areasOfExpertise.length > 0 && (
                          <div>
                            <p style={{ color: 'var(--secondary-color)' }} className="text-sm">Areas of Expertise:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {founder.areasOfExpertise.map((area, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 rounded-full text-sm"
                                  style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
                                >
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-4 mt-4">
                          {founder.linkedIn && (
                            <a
                              href={founder.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--link-color)' }}
                            >
                              LinkedIn
                            </a>
                          )}
                          {founder.twitter && (
                            <a
                              href={`https://twitter.com/${founder.twitter.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--link-color)' }}
                            >
                              Twitter
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  className="p-4 rounded-lg col-span-2"
                  style={{ backgroundColor: 'var(--detail-item-bg-color)' }}
                >
                  <p style={{ color: 'var(--text-color)', textAlign: 'center' }}>
                    No founders listed
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 
              className="text-lg font-semibold mb-3"
              style={{ color: 'var(--text-color)' }}
            >
              Key Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {startup.metrics.map((metric, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: 'var(--detail-item-bg-color)' }}
                >
                  <p style={{ color: 'var(--secondary-color)' }} className="text-sm mb-1">
                    {metric.label}
                  </p>
                  <p style={{ color: 'var(--text-color)' }} className="font-semibold">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 
              className="text-lg font-semibold mb-3"
              style={{ color: 'var(--text-color)' }}
            >
              Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {startup.team.map((member, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: 'var(--detail-item-bg-color)' }}
                >
                  <p style={{ color: 'var(--text-color)' }} className="font-semibold">
                    {member.name}
                  </p>
                  <p style={{ color: 'var(--secondary-color)' }}>
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 
              className="text-lg font-semibold mb-3"
              style={{ color: 'var(--text-color)' }}
            >
              Funding History
            </h2>
            <div className="space-y-3">
              {startup.fundingHistory.map((round, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg flex justify-between items-center"
                  style={{ backgroundColor: 'var(--detail-item-bg-color)' }}
                >
                  <div>
                    <p style={{ color: 'var(--text-color)' }} className="font-semibold">
                      {round.round}
                    </p>
                    <p style={{ color: 'var(--secondary-color)' }} className="text-sm">
                      {round.date}
                    </p>
                  </div>
                  <p 
                    className="font-semibold"
                    style={{ color: 'var(--success-color)' }}
                  >
                    {round.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 
              className="text-lg font-semibold mb-3"
              style={{ color: 'var(--text-color)' }}
            >
              Company Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'var(--detail-item-bg-color)' }}
              >
                <p style={{ color: 'var(--secondary-color)' }} className="text-sm mb-1">
                  Industry
                </p>
                <p style={{ color: 'var(--text-color)' }}>{startup.industry}</p>
              </div>
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'var(--detail-item-bg-color)' }}
              >
                <p style={{ color: 'var(--secondary-color)' }} className="text-sm mb-1">
                  Team Size
                </p>
                <p style={{ color: 'var(--text-color)' }}>{startup.teamSize} employees</p>
              </div>
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'var(--detail-item-bg-color)' }}
              >
                <p style={{ color: 'var(--secondary-color)' }} className="text-sm mb-1">
                  Funding Stage
                </p>
                <p style={{ color: 'var(--text-color)' }}>{startup.fundingStage}</p>
              </div>
              {startup.website && (
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: 'var(--detail-item-bg-color)' }}
                >
                  <p style={{ color: 'var(--secondary-color)' }} className="text-sm mb-1">
                    Website
                  </p>
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: 'var(--link-color)' }}
                  >
                    {startup.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetailPage;
