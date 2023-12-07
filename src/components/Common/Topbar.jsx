import React from 'react';

function Topbar({ collapsed }) {
  return (
      <div className="h-28 z-10 w-full fixed -mb-40 flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-400">
        {
          import.meta.env.VITE_ENVIRONMENT === 'dev' ? <p style={{fontSize:50, color:'white'}}>TEST ENVIRONMENT</p>:
          <img src="/logo.png" alt="Logo" className="w-40 h-20 ml-auto" />
        }
      </div>
  );
}

export default Topbar;
