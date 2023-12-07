import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Common/Sidebar';
import Topbar from '../../components/Common/Topbar';
import { useNavigate } from 'react-router-dom';
import {app} from "../../firebase"
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  // This holds the information about dark mode/light mode
  const [mode, setMode] = useState();

  const auth = getAuth(app);

  const [timesheetsOnly, setTimesheetsOnly] = useState(false);
  const [userTypeIdentified, setUserTypeIdentified] = useState(false);

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
      if (user?.email === import.meta.env.VITE_TIMESHEET_ONLY_USER) {
        setTimesheetsOnly(true)
      }

      setUserTypeIdentified(true)
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

        {/*right*/}
        <div className="w-10/12">
          {/* Content of the right div */}
          {
            !timesheetsOnly && userTypeIdentified ?
            <div className="flex justify-center align-middle mb-20">
              <div className="w-10/12 md:w-1/2 mx-auto mt-72">
                <h1 className="text-3xl font-normal text-center">
                  Welcome Back to the {import.meta.env.VITE_NAME} Timesheet App
                </h1>

                <p className="text-2xl font-light text-center mt-10">
                  As an admin user of {import.meta.env.VITE_NAME} Enterprises' custom time sheet app, you
                  can easily manage your team's time tracking, employee profiles,
                  and approve pending timesheets. We're excited to have you on
                  board and are here to support you. Let's improve your team's
                  productivity together!
                </p>
              </div>
            </div>:
            <div className="w-5/12 mb-2 mt-36 space-x-6  mx-auto  flex flex-row justify-center align-middle">\
            </div>
          }
          {
            timesheetsOnly && userTypeIdentified && <h1 className='text-center text-7xl'>ACCESS DENIED</h1>
          }
        </div>
      </div>
    </div>
  );
}

export default Home;
