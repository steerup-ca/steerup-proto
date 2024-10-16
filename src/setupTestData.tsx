import React from 'react';
import { setupTestUser } from './utils/setupTestData';

const SetupTestData: React.FC = () => {
  const handleSetupTestUser = async () => {
    await setupTestUser();
    alert('Test user data has been added to Firestore.');
  };

  return (
    <div>
      <h1>Setup Test Data</h1>
      <button onClick={handleSetupTestUser}>Add Test User to Firestore</button>
    </div>
  );
};

export default SetupTestData;
