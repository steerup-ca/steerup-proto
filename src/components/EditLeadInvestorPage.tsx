import React from 'react';
import EditLeadInvestorForm from './EditLeadInvestorForm';
import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';

const EditLeadInvestorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <EditLeadInvestorForm onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default EditLeadInvestorPage;
