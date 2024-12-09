import React from 'react';
import Logo from './Logo';
import Navbar from './Navbar';

const Header: React.FC = () => {
  return (
    <header className="header" style={{
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 1rem',
      backgroundColor: 'var(--card-bg-color)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 30,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <Logo />
      <Navbar />
      <style>
        {`
          :root {
            --header-height: 3rem;
          }

          body {
            padding-top: calc(var(--header-height) + 1rem);
          }

          @media (min-width: 769px) {
            :root {
              --header-height: 4rem;
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
