import React from 'react';
import EditStartupForm from './EditStartupForm';
import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';

const EditStartupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <EditStartupForm onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default EditStartupPage;
