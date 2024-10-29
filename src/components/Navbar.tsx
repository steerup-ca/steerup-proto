import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KYCStatus } from '../types';

interface NavbarProps {
  kycStatus?: KYCStatus;
}

const Navbar: React.FC<NavbarProps> = ({ kycStatus = KYCStatus.NotVerified }) => {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

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
    <nav className="navbar">
      <ul className="flex items-center">
        <li className="relative mr-4 admin-menu">
          <Link to="#" onClick={toggleAdminMenu} className="text-white">Admin</Link>
          {isAdminMenuOpen && (
            <ul className="absolute left-0 mt-2 w-48 bg-card-bg rounded-md shadow-lg py-1 z-10">
              <li><Link to="/admin/add-lead-investor" className="block px-4 py-2 text-sm text-white hover:bg-primary">Add Lead Investor</Link></li>
              <li><Link to="/admin/add-startup" className="block px-4 py-2 text-sm text-white hover:bg-primary">Add Startup</Link></li>
              <li><Link to="/admin/add-startups-selection" className="block px-4 py-2 text-sm text-white hover:bg-primary">Add Startups Selection</Link></li>
              <li><Link to="/admin/add-campaign" className="block px-4 py-2 text-sm text-white hover:bg-primary">Add Campaign</Link></li>
            </ul>
          )}
        </li>
        <li className="mr-4"><Link to="/home" className="text-white">Home</Link></li>
        <li className="mr-4"><Link to="/explore" className="text-white">Explore</Link></li>
        <li className="mr-4"><Link to="/portfolio" className="text-white">Portfolio</Link></li>
        <li className="mr-4">
          <Link to="/kyc" className="text-white flex items-center">
            KYC
            <span className={`ml-2 w-2 h-2 rounded-full ${getKYCStatusColor()}`} />
          </Link>
        </li>
        <li className="mr-4"><Link to="/profile" className="text-white">Profile</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
