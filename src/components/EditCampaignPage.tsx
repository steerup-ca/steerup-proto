import React from 'react';
import EditCampaignForm from './EditCampaignForm';
import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';

const EditCampaignPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <EditCampaignForm onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default EditCampaignPage;
