import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const toggleAdminMenu = () => {
    setIsAdminMenuOpen(!isAdminMenuOpen);
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
            </ul>
          )}
        </li>
        <li className="mr-4"><Link to="/" className="text-white">Dashboard</Link></li>
        <li className="mr-4"><Link to="/explore" className="text-white">Explore</Link></li>
        <li className="mr-4"><Link to="/investments" className="text-white">Investments</Link></li>
        <li><Link to="/profile" className="text-white">Profile</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;