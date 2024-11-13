import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="logo">
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/steerup-7780c.appspot.com/o/STEERUP_Logo_PurpleGC_Shadow.svg?alt=media&token=fa4cc84f-2056-477c-92aa-e2a6b38f1410"
        alt="Steerup Logo"
        style={{
          height: '40px',
          width: 'auto',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default Logo;
