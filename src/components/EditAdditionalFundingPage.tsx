import React from 'react';
import EditAdditionalFundingForm from './EditAdditionalFundingForm';
import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';

const EditAdditionalFundingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <EditAdditionalFundingForm onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default EditAdditionalFundingPage;
