import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KYCStatus } from '../types';

interface NavbarProps {
  kycStatus?: KYCStatus;
}

const Navbar: React.FC<NavbarProps> = ({ kycStatus = KYCStatus.NotVerified }) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
    if (isAdminMenuOpen) setIsAdminMenuOpen(false);
  };

  const toggleAdminMenu = () => {
    setIsAdminMenuOpen(!isAdminMenuOpen);
  };

  const getKYCStatusColor = () => {
    switch (kycStatus) {
      case KYCStatus.Verified:
        return 'bg-green-500';
      case KYCStatus.Pending:
        return 'bg-yellow-500';
      case KYCStatus.NeedsReview:
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--card-bg-color)',
        boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.2)',
        zIndex: 40,
        height: '4.5rem',
        display: 'none', // Hidden by default, shown via media query
      }} className="mobile-nav">
        <ul style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '100%',
          margin: 0,
          padding: '0 1rem',
          backgroundColor: 'var(--card-bg-color)'
        }}>
          <li>
            <Link to="/home" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'var(--text-color)',
              textDecoration: 'none',
              fontSize: 'var(--font-size-xsmall)',
              padding: '0.5rem'
            }}>
              <span className="material-icons" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>home</span>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/explore" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'var(--text-color)',
              textDecoration: 'none',
              fontSize: 'var(--font-size-xsmall)',
              padding: '0.5rem'
            }}>
              <span className="material-icons" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>explore</span>
              <span>Explore</span>
            </Link>
          </li>
          <li>
            <Link to="/portfolio" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'var(--text-color)',
              textDecoration: 'none',
              fontSize: 'var(--font-size-xsmall)',
              padding: '0.5rem'
            }}>
              <span className="material-icons" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>account_balance</span>
              <span>Portfolio</span>
            </Link>
          </li>
          <li>
            <button onClick={toggleSideMenu} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'var(--text-color)',
              background: 'none',
              border: 'none',
              fontSize: 'var(--font-size-xsmall)',
              padding: '0.5rem'
            }}>
              <span className="material-icons" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>menu</span>
              <span>Menu</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Desktop Navigation */}
      <nav style={{
        backgroundColor: 'var(--card-bg-color)',
        display: 'none'
      }} className="desktop-nav">
        <ul className="flex items-center h-16 px-4">
          <li className="mr-6"><Link to="/home" className="text-white">Home</Link></li>
          <li className="mr-6"><Link to="/explore" className="text-white">Explore</Link></li>
          <li className="mr-6"><Link to="/portfolio" className="text-white">Portfolio</Link></li>
          <li className="mr-6">
            <Link to="/kyc" className="text-white flex items-center">
              KYC
              <span className={`ml-2 w-2 h-2 rounded-full ${getKYCStatusColor()}`} />
            </Link>
          </li>
          <li className="mr-6"><Link to="/profile" className="text-white">Profile</Link></li>
          <li className="relative">
            <button onClick={toggleAdminMenu} className="text-white">Admin</button>
            {isAdminMenuOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-card-bg rounded-md shadow-lg py-1 z-50">
                <li><Link to="/admin/add-lead-investor" className="block px-4 py-2 text-sm text-white hover:bg-primary">Add Lead Investor</Link></li>
                <li><Link to="/admin/add-startup" className="block px-4 py-2 text-sm text-white hover:bg-primary">Add Startup</Link></li>
                <li><Link to="/admin/add-startups-selection" className="block px-4 py-2 text-sm text-white hover:bg-primary">Add Startups Selection</Link></li>
                <li><Link to="/admin/add-campaign" className="block px-4 py-2 text-sm text-white hover:bg-primary">Add Campaign</Link></li>
                <li><Link to="/admin/add-additional-funding-entity" className="block px-4 py-2 text-sm text-white hover:bg-primary">Add Additional Funding Entity</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Side Menu */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100%',
        width: '16rem',
        backgroundColor: 'var(--card-bg-color)',
        transform: isSideMenuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 50,
        boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ color: 'var(--text-color)', fontSize: '1.125rem', fontWeight: 600 }}>Menu</h2>
          <button onClick={toggleSideMenu} style={{ color: 'var(--text-color)', background: 'none', border: 'none' }}>
            <span className="material-icons">close</span>
          </button>
        </div>
        <ul style={{ padding: '1rem 0' }}>
          <li>
            <Link to="/profile" style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              color: 'var(--text-color)',
              textDecoration: 'none'
            }} onClick={toggleSideMenu}>
              <span className="material-icons" style={{ marginRight: '0.5rem' }}>person</span>
              Profile
            </Link>
          </li>
          <li>
            <Link to="/kyc" style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              color: 'var(--text-color)',
              textDecoration: 'none'
            }} onClick={toggleSideMenu}>
              <span className="material-icons" style={{ marginRight: '0.5rem' }}>verified_user</span>
              KYC
              <span className={`ml-2 w-2 h-2 rounded-full ${getKYCStatusColor()}`} />
            </Link>
          </li>
          <li>
            <button onClick={toggleAdminMenu} style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0.75rem 1rem',
              color: 'var(--text-color)',
              background: 'none',
              border: 'none',
              textAlign: 'left'
            }}>
              <span className="material-icons" style={{ marginRight: '0.5rem' }}>admin_panel_settings</span>
              Admin
              <span className="material-icons" style={{ marginLeft: 'auto' }}>{isAdminMenuOpen ? 'expand_less' : 'expand_more'}</span>
            </button>
            {isAdminMenuOpen && (
              <ul style={{ marginLeft: '2rem' }}>
                <li><Link to="/admin/add-lead-investor" style={{ display: 'block', padding: '0.5rem 0', color: 'var(--text-color)', textDecoration: 'none', fontSize: 'var(--font-size-small)' }} onClick={toggleSideMenu}>Add Lead Investor</Link></li>
                <li><Link to="/admin/add-startup" style={{ display: 'block', padding: '0.5rem 0', color: 'var(--text-color)', textDecoration: 'none', fontSize: 'var(--font-size-small)' }} onClick={toggleSideMenu}>Add Startup</Link></li>
                <li><Link to="/admin/add-startups-selection" style={{ display: 'block', padding: '0.5rem 0', color: 'var(--text-color)', textDecoration: 'none', fontSize: 'var(--font-size-small)' }} onClick={toggleSideMenu}>Add Startups Selection</Link></li>
                <li><Link to="/admin/add-campaign" style={{ display: 'block', padding: '0.5rem 0', color: 'var(--text-color)', textDecoration: 'none', fontSize: 'var(--font-size-small)' }} onClick={toggleSideMenu}>Add Campaign</Link></li>
                <li><Link to="/admin/add-additional-funding-entity" style={{ display: 'block', padding: '0.5rem 0', color: 'var(--text-color)', textDecoration: 'none', fontSize: 'var(--font-size-small)' }} onClick={toggleSideMenu}>Add Additional Funding Entity</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {isSideMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 40
          }}
          onClick={toggleSideMenu}
        />
      )}

      <style>
        {`
          @media (max-width: 768px) {
            .mobile-nav {
              display: block !important;
            }
            .desktop-nav {
              display: none !important;
            }
          }
          @media (min-width: 769px) {
            .mobile-nav {
              display: none !important;
            }
            .desktop-nav {
              display: block !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
