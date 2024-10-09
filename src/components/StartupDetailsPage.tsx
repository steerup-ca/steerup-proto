import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Startup } from '../types';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Button from './Button';
import './StartupDetailsPage.css';

const StartupDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [startup, setStartup] = React.useState<Startup | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchStartup = async () => {
      if (id) {
        try {
          const startupDoc = doc(db, 'startups', id);
          const startupSnapshot = await getDoc(startupDoc);
          if (startupSnapshot.exists()) {
            setStartup({ id: startupSnapshot.id, ...startupSnapshot.data() } as Startup);
          } else {
            setError('Startup not found');
          }
        } catch (err) {
          setError('Error fetching startup details');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStartup();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="startup-details-page">Loading...</div>;
  }

  if (error) {
    return <div className="startup-details-page">Error: {error}</div>;
  }

  if (!startup) {
    return <div className="startup-details-page">Startup not found</div>;
  }

  return (
    <div className="startup-details-page max-width-800">
      <Button onClick={handleBack} className="back-button">← Back</Button>
      <div className="startup-details card">
        <img src={startup.imageUrl} alt={startup.name} className="startup-image" />
        <h1 className="startup-name">{startup.name}</h1>
        <p className="description">{startup.description}</p>
        <div className="details-grid grid-auto-fit">
          <div className="detail-item">
            <strong>Industry:</strong> {startup.industry}
          </div>
          <div className="detail-item">
            <strong>Funding Stage:</strong> {startup.fundingStage}
          </div>
          <div className="detail-item">
            <strong>Funding Amount:</strong> ${startup.fundingAmount?.toLocaleString()}
          </div>
          <div className="detail-item">
            <strong>Location:</strong> {startup.location}
          </div>
          <div className="detail-item">
            <strong>Founded:</strong> {startup.foundedYear}
          </div>
          <div className="detail-item">
            <strong>Team Size:</strong> {startup.teamSize}
          </div>
        </div>
        <div className="website">
          <strong>Website:</strong> <a href={startup.website} target="_blank" rel="noopener noreferrer" className="link">{startup.website}</a>
        </div>
        {startup.team && startup.team.length > 0 && (
          <div className="team-section">
            <h2 className="section-title">Team</h2>
            <ul className="grid-auto-fit">
              {startup.team.map((member, index) => (
                <li key={index} className="card">{member.name} - {member.role}</li>
              ))}
            </ul>
          </div>
        )}
        {startup.metrics && startup.metrics.length > 0 && (
          <div className="metrics-section">
            <h2 className="section-title">Metrics</h2>
            <ul className="grid-auto-fit">
              {startup.metrics.map((metric, index) => (
                <li key={index} className="card">{metric.label}: {metric.value}</li>
              ))}
            </ul>
          </div>
        )}
        {startup.fundingHistory && startup.fundingHistory.length > 0 && (
          <div className="funding-history-section">
            <h2 className="section-title">Funding History</h2>
            <ul>
              {startup.fundingHistory.map((round, index) => (
                <li key={index} className="card">{round.round}: ${round.amount} ({round.date})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupDetailsPage;