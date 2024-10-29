import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/theme.css';  // Import theme.css first
import './App.css';  // Then import App.css
import Header from './components/Header';
import AddLeadInvestorForm from './components/AddLeadInvestorForm';
import AddStartupForm from './components/AddStartupForm';
import AddStartupsSelectionForm from './components/AddStartupsSelectionForm';
import AddCampaignForm from './components/AddCampaignForm';
import ExplorePage from './components/ExplorePage';
import StartupDetailsPage from './components/StartupDetailsPage';
import LeadInvestorDetailsPage from './components/LeadInvestorDetailsPage';
import LandingPage from './components/LandingPage';
import CoInvestPage from './components/CoInvestPage';
import ProfilePage from './components/ProfilePage';
import PortfolioPage from './components/PortfolioPage';
import KYCFlow from './components/KYC/KYCFlow';
import KYCSuccess from './components/KYC/KYCSuccess';

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/startup/:id" element={<StartupDetailsPage />} />
          <Route path="/lead-investor/:id" element={<LeadInvestorDetailsPage />} />
          <Route path="/co-invest/:id" element={<CoInvestPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/kyc" element={<KYCFlow />} />
          <Route path="/kyc/success" element={<KYCSuccess />} />
          <Route path="/admin/add-lead-investor" element={<AddLeadInvestorForm />} />
          <Route path="/admin/add-startup" element={<AddStartupForm />} />
          <Route path="/admin/add-startups-selection" element={<AddStartupsSelectionForm />} />
          <Route path="/admin/add-campaign" element={<AddCampaignForm />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
