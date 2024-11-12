import React from 'react';
import EditFounderForm from './EditFounderForm';
import { useNavigate } from 'react-router-dom';

const EditFounderPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <EditFounderForm onCancel={handleCancel} />
    </div>
  );
};

export default EditFounderPage;
