import React, { useState, useEffect } from 'react';
import { Form, DatePicker } from 'antd';
import { query,where,getDocs, collection,getFirestore } from 'firebase/firestore';
import { app } from '../../../firebase';
import { ToastContainer } from 'react-toastify';
import Sidebar from "../../../components/Common2/MakersSidebar"
import Topbar from "../../../components/Common2/Topbar"
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import MaterialsTimesheet from '../../../components/Common2/MaterialsSheetTable';
import EditMaterialsTimesheet from '../../../components/Common2/EditMaterialsSheetTable';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Makers() {
  const [collapsed, setCollapsed] = useState(false);
  const [makers, setMakers] = useState(["lights","fulls", "bb", "menthols"]);
  const [exsist, setExsist] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [timesheetData, setTimesheetData] = useState([]);
  // This holds the information about dark mode/light mode
  const [mode, setMode] = useState();

  const navigate = useNavigate();
  
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
 
  const db = getFirestore(app);

 

  useEffect(() => {
    if (selectedDateRange?.length === 2) {
      const startDate = moment(selectedDateRange[0]?.$d);
      const endDate = moment(selectedDateRange[1]?.$d);
      const formattedPeriod = `${startDate?.format("YYYY-MM-DD")}-${endDate?.format("YYYY-MM-DD")}`;

      
      checkTimesheetsExist(formattedPeriod).then(exist => {
        setExsist(exist)
      });

      
    }
  }, [selectedDateRange,fetch]);
  

  const checkTimesheetsExist = async (period) => {
    try {
      const timesheetRef = collection(db, 'makers');
      const q = query(
        timesheetRef,
        where('period', '==', period),
        where('type', '==', "Trays Produced") // 
      );
  
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTimesheetData(data)
      return !querySnapshot.empty; // Returns true if timesheets exist, false if not
    } catch (error) {
      console.error('Error checking timesheets: ', error);
      return false;
    }
  };
 
  const handleDateRangeChange = (dates) => {
    if(dates){
    setSelectedDateRange(dates);
    }
  };

  
  return (
    <div className={`${mode === 'dark' ? 'bg-white' : 'bg-white'} font-lato`}>
    <Topbar collapsed={collapsed} />
    <ToastContainer autoClose={2000} />

    <div className="flex">
      {/* Left */}
      <div>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Right */}
      <div className="w-10/12 mb-20 ">
        {/* Content of the right div */}
            {/* Content of the right div */}
            <div className="w-5/12 mt-36 space-x-6  mx-auto  flex flex-row justify-center align-middle">
            {/* Start Date */}
            <Form.Item label="Date Range">
            <DatePicker.RangePicker onChange={handleDateRangeChange} />
            </Form.Item>
          </div>
          <div className="w-12/12 flex flex-col space-y-10 justify-center align-middle">
         
         {/* Render your timesheet table */}
         {
          !exsist &&
          <div style={{ overflowX: 'auto' }}>
         <MaterialsTimesheet selectedDateRange={selectedDateRange} material={'Maker'} items={makers} fetch={fetch} setFetch={setFetch} type="Trays Produced"/>
         </div>
         }
         
         {
          exsist &&
          <div style={{ overflowX: 'auto' }}>
          <EditMaterialsTimesheet selectedDateRange={selectedDateRange} material={'Maker'} items={makers} timesheetDataFromFirebase={timesheetData} fetch={fetch} setFetch={setFetch} type="Trays Produced"/>
          </div>
          } 
           
    </div>
    </div>
    </div>
    </div>
  );
}

export default Makers;
