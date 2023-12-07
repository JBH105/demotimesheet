import React, { useEffect } from 'react';
import {
  ClockCircleOutlined,
  CalculatorOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import LandingCards from '../components/Common/LandingCards';
import {app} from "../firebase"
import { getAuth, signOut } from 'firebase/auth';


const Landing = () => {
    const auth = getAuth(app);


    const logout = () => {
  signOut(auth)
    .then(() => {
      // Redirect to the home page after successful logout
      window.location.href = '/';
    })
    .catch((error) => {
      // Handle any errors here, such as displaying an error message
      console.error('Error logging out:', error);
    });
};

 

  return (
    <div className="bg-custom-background bg-cover bg-center bg-no-repeat ">
      <div className="flex flex-wrap bg-gradient-to-tl from-[#672A8F] to-transparent">
        <div className="w-full md:w-4/4 px-4">
          {/* Middle column */}
          <div
            className="flex flex-col justify-center space-x-10 items-center"
            style={{ minHeight: '100vh' }}
          >
            <div className="flex justify-center mx-auto my-auto space-x-10 items-center">
              <LandingCards
                to={'/home'}
                text={'Timesheets'}
                icon={
                  <ClockCircleOutlined className="text-[60px] 2xl:text-[100px]" />
                }
              />
              <LandingCards
                to={'/materials/rollies/home'}
                text={'Rollies'}
                icon={
                  <CalculatorOutlined className="text-[60px] 2xl:text-[100px]" />
                }
              />
              <LandingCards
                to={'/materials/makers/home'}
                text={'Makers'}
                icon={
                  <CalculatorOutlined className="text-[60px] 2xl:text-[100px]" />
                }
              />
              <LandingCards
                to={'/materials/packers/home'}
                text={'Packers'}
                icon={
                  <CalculatorOutlined className="text-[60px] 2xl:text-[100px]" />
                }
              />
              <LandingCards
                to={'/management'}
                text={'Management'}
                icon={<CodeOutlined className="text-[60px] 2xl:text-[100px]" />}
              />
            </div>
            <Button
              onClick={logout}
              className="bg-[#9773AF] shadow-lg hover:text-gray-600 bg-opacity-10  mb-16 w-4/12 text-base h-12 font-semibold text-white"
              style={{ backdropFilter: 'blur(15px)' }}
            >
              <>Logout</>
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/4 px-4">
          {/* Right column */}
          <div className="flex p-10 justify-end items-end h-full">
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: '200px', height: '100px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;