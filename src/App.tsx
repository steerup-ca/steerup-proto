import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/theme.css';  // Import theme.css first
import './App.css';  // Then import App.css
import Header from './components/Header';
import AddLeadInvestorForm from './components/AddLeadInvestorForm';
import AddStartupForm from './components/AddStartupForm';
import AddStartupsSelectionForm from './components/AddStartupsSelectionForm';
import AddCampaignForm from './components/AddCampaignForm';
import AddAdditionalFundingEntityForm from './components/AddAdditionalFundingEntityForm';
import { AddFounderForm } from './components/AddFounderForm';
import EditFounderPage from './components/EditFounderPage';
import EditLeadInvestorPage from './components/EditLeadInvestorPage';
import EditStartupPage from './components/EditStartupPage';
import EditStartupSelectionPage from './components/EditStartupSelectionPage';
import EditAdditionalFundingPage from './components/EditAdditionalFundingPage';
import EditCampaignPage from './components/EditCampaignPage';
import ExplorePage from './components/ExplorePage';
import StartupDetailPage from './components/StartupDetailPage';
import LeadInvestorDetailPage from './components/LeadInvestorDetailPage';
import AdditionalFundingDetailPage from './components/AdditionalFundingDetailPage';
import LandingPage from './components/LandingPage';
import CoInvestPage from './components/CoInvestPage';
import CoLendPage from './components/CoLendPage';
import ProfilePage from './components/ProfilePage';
import PortfolioPage from './components/PortfolioPage';
import KYCFlow from './components/KYC/KYCFlow';
import KYCSuccess from './components/KYC/KYCSuccess';
import PricingPage from './components/PricingPage';

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/startup/:id" element={<StartupDetailPage />} />
          <Route path="/lead-investor/:id" element={<LeadInvestorDetailPage />} />
          <Route path="/additional-funding/:id" element={<AdditionalFundingDetailPage />} />
          <Route path="/co-invest/:id" element={<CoInvestPage />} />
          <Route path="/co-lend/:id" element={<CoLendPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/kyc" element={<KYCFlow />} />
          <Route path="/kyc/success" element={<KYCSuccess />} />
          <Route path="/admin/add-lead-investor" element={<AddLeadInvestorForm />} />
          <Route path="/admin/add-startup" element={<AddStartupForm />} />
          <Route path="/admin/add-startups-selection" element={<AddStartupsSelectionForm />} />
          <Route path="/admin/edit-startups-selection" element={<EditStartupSelectionPage />} />
          <Route path="/admin/add-campaign" element={<AddCampaignForm />} />
          <Route path="/admin/add-additional-funding-entity" element={<AddAdditionalFundingEntityForm />} />
          <Route path="/admin/add-founder" element={<AddFounderForm />} />
          <Route path="/admin/edit-founder" element={<EditFounderPage />} />
          <Route path="/admin/edit-lead-investor" element={<EditLeadInvestorPage />} />
          <Route path="/admin/edit-startup" element={<EditStartupPage />} />
          <Route path="/admin/edit-additional-funding" element={<EditAdditionalFundingPage />} />
          <Route path="/admin/edit-campaign" element={<EditCampaignPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
