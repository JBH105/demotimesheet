import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Common2/PackersSidebar';
import Topbar from '../../../components/Common2/Topbar';
import { useNavigate } from 'react-router-dom';
import {app} from "../../../firebase"
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function PackersHome() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  // This holds the information about dark mode/light mode
  const [mode, setMode] = useState();

  const auth = getAuth(app);

  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        const colorScheme = event.matches ? 'dark' : 'light';
        
        setMode(colorScheme);
      });
      
      const unsubscribe = onAuthStateChanged(auth, (user) => {
       
        if (!user) {
          // User is not logged in, navigate to "/"
          navigate('/');
        }
      });
  
      return () => {
        // Clean up the listener when component unmounts
        unsubscribe();
      };
  }, [navigate]);



  return (
    <div className={`${mode === 'dark' ? 'bg-white' : 'bg-white'} font-lato`}>
      <Topbar collapsed={collapsed} />

      <div className="flex">
        {/*left*/}
        <div>
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/*left*/}
        <div className="w-10/12">
          {/* Content of the right div */}
          <div className="flex justify-center align-middle mb-20">
            <div className="w-10/12 md:w-1/2 mx-auto mt-72">
              <h1 className="text-3xl font-normal text-center">
              Welcome to the {import.meta.env.VITE_NAME} Packers Materials Calculator!
              </h1>

              <p className="text-2xl font-light text-center mt-10">
              As an admin user of {import.meta.env.VITE_NAME} Cigarette Factory's custom materials
              calculator, you can efficiently manage your team's inventory
              tracking, supplier profiles, and approve pending material
              requests. We're thrilled to have you on board and ready to provide
              our full support. Let's enhance your factory's efficiency
              together!
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackersHome;
