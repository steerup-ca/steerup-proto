import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center text-2xl mt-10 text-text-color">
      <div>{message}</div>
      <button 
        onClick={() => navigate('/explore')}
        className="mt-4 px-6 py-2 bg-primary-color text-white rounded-lg hover:opacity-90"
      >
        Back to Explore
      </button>
    </div>
  );
};

export default ErrorDisplay;
