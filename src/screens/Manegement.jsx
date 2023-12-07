import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Common/Sidebar';
import Topbar from '../components/Common/Topbar';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

function Management() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  // This holds the information about dark mode/light mode
  const [mode, setMode] = useState();

  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        const colorScheme = event.matches ? 'dark' : 'light';
        
        setMode(colorScheme);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('type');

    if (token) {
      
    } else {
      navigate('/');
    }
  }, []);

  

  return (
    <div className={`${mode === 'dark' ? 'bg-white' : 'bg-white'} font-lato`}>
      <Topbar collapsed={collapsed} />

      <div className="flex">
        {/* Content of the right div */}
        <div className="flex justify-center align-middle mb-20">
          <div className="w-10/12 md:w-1/2 mx-auto mt-72">
            <h1 className="text-3xl font-normal text-center">
              Introducing the {import.meta.env.VITE_NAME} Management App!
            </h1>

            <p className="text-2xl font-light text-center mt-10">
              As an admin user of {import.meta.env.VITE_NAME} Enterprises' custom management app, you
              can seamlessly oversee various aspects of your company, such as
              employee profiles, project tracking, and approve pending tasks.
              We're delighted to have you join our platform and are committed to
              assisting you every step of the way. Let's elevate your company's
              efficiency and success together!
            </p>
            <Link
              to="/landing"
              className="bg-blue-600 justify-center space-x-2 w-1/2 mx-auto mt-10 flex align-middle text-center text-sm py-2 hover:text-gray-400 rounded-none text-white"
            >
              <ArrowLeftOutlined className="my-auto" />
              <h1 className="text-center text-sm">Back to Dashboard</h1>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Management;