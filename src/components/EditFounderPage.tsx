import React from 'react';
import EditFounderForm from './EditFounderForm';
import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';

const EditFounderPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <EditFounderForm onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default EditFounderPage;
