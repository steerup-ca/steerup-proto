import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/theme.css';  // Import theme.css first
import './App.css';  // Then import App.css
import Header from './components/Header';
import MainContent from './components/MainContent';
import AddLeadInvestorForm from './components/AddLeadInvestorForm';
import AddStartupForm from './components/AddStartupForm';
import AddStartupsSelectionForm from './components/AddStartupsSelectionForm';
import ExplorePage from './components/ExplorePage';
import StartupDetailsPage from './components/StartupDetailsPage';
import LeadInvestorDetailsPage from './components/LeadInvestorDetailsPage';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/main" element={<MainContent />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/startup/:id" element={<StartupDetailsPage />} />
        <Route path="/lead-investor/:id" element={<LeadInvestorDetailsPage />} />
        <Route path="/admin/add-lead-investor" element={<AddLeadInvestorForm />} />
        <Route path="/admin/add-startup" element={<AddStartupForm />} />
        <Route path="/admin/add-startups-selection" element={<AddStartupsSelectionForm />} />
      </Routes>
    </div>
  );
}

export default App;
