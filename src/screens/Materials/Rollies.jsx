import React, { useState, useEffect } from 'react';
import { Button,Switch, Modal, Form, Input, Select, Table, DatePicker, TimePicker } from 'antd';
import { addDoc,query,where,getDocs, collection,setDoc, doc, onSnapshot, getFirestore, updateDoc, deleteDoc } from 'firebase/firestore';
import { app } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import Sidebar from "../../components/Common2/RolliesSidebar"
import Topbar from "../../components/Common2/Topbar"
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import RolliesSheetTable from '../../components/Rollies/RolliesSheetTable';
import EditRolliesSheetTable from '../../components/Rollies/EditRolliesSheetTable';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Rollies() {
  const [collapsed, setCollapsed] = useState(false);
  const [rollies, setRollies] = useState(["lights","fulls","menthos"]);
  const [exsist, setExsist] = useState(false);
  const [exsist2, setExsist2] = useState(false);
  const [exsist3, setExsist3] = useState(false);
  const [exsist4, setExsist4] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [timesheetData, setTimesheetData] = useState([]);
  const [timesheetData2, setTimesheetData2] = useState([]);
  const [timesheetData3, setTimesheetData3] = useState([]);
  const [timesheetData4, setTimesheetData4] = useState([]);
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
        if (exist) {
          
          setExsist(true)
          // Update your state or take any other actions here
        } else {
          
          setExsist(false)
          // Update your state or take any other actions here
        }
      });

      checkTimesheetsExist2(formattedPeriod).then(exist => {
        if (exist) {
          
          setExsist2(true)
          // Update your state or take any other actions here
        } else {
          
          setExsist2(false)
          // Update your state or take any other actions here
        }
      });

      checkTimesheetsExist3(formattedPeriod).then(exist => {
        if (exist) {
          
          setExsist3(true)
          // Update your state or take any other actions here
        } else {
          
          setExsist3(false)
          // Update your state or take any other actions here
        }
      });


      checkTimesheetsExist4(formattedPeriod).then(exist => {
        if (exist) {
          
          setExsist4(true)
          // Update your state or take any other actions here
        } else {
          
          setExsist4(false)
          // Update your state or take any other actions here
        }
      });
    }
  }, [selectedDateRange,fetch]);
  

  const checkTimesheetsExist = async (period) => {
    try {
      const timesheetRef = collection(db, 'rollies');
      const q = query(
        timesheetRef,
        where('period', '==', period),
        where('type', '==', "Trays Used") // 
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

  const checkTimesheetsExist2 = async (period) => {
    try {
      const timesheetRef = collection(db, 'rollies');
      const q = query(
        timesheetRef,
        where('period', '==', period),
        where('type', '==', "Cases Produced") // 
      );
  
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTimesheetData2(data)
      return !querySnapshot.empty; // Returns true if timesheets exist, false if not
    } catch (error) {
      console.error('Error checking timesheets: ', error);
      return false;
    }
  };

  const checkTimesheetsExist3 = async (period) => {
    try {
      const timesheetRef = collection(db, 'rollies');
      const q = query(
        timesheetRef,
        where('period', '==', period),
        where('type', '==', "Cases Sold") // 
      );
  
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTimesheetData3(data)
      return !querySnapshot.empty; // Returns true if timesheets exist, false if not
    } catch (error) {
      console.error('Error checking timesheets: ', error);
      return false;
    }
  };


  const checkTimesheetsExist4 = async (period) => {
    try {
      const timesheetRef = collection(db, 'rollies');
      const q = query(
        timesheetRef,
        where('period', '==', period),
        where('type', '==', "Cases In Stock") // 
      );
  
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTimesheetData4(data)
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
            <Form.Item label="Start Date">
            <DatePicker.RangePicker onChange={handleDateRangeChange} />
            </Form.Item>
          </div>
          <div className="w-12/12 flex flex-col space-y-10 justify-center align-middle">
         
         {/* Render your timesheet table */}
         {
          !exsist &&
          <div style={{ overflowX: 'auto' }}>
         <RolliesSheetTable selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange} rollies={rollies} setRollies={setRollies} fetch={fetch} setFetch={setFetch} type="Trays Used"/>
         </div>
         }
         {
          !exsist2 &&
          <div style={{ overflowX: 'auto' }}>
         <RolliesSheetTable selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange} rollies={rollies} setRollies={setRollies} fetch={fetch} setFetch={setFetch} type="Cases Produced"/>
         </div>
         }
         {
          !exsist3 &&
          <div style={{ overflowX: 'auto' }}>
         <RolliesSheetTable selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange} rollies={rollies} setRollies={setRollies} fetch={fetch} setFetch={setFetch} type="Cases Sold"/>
         </div>
         }
         {
          !exsist4 &&
          <div style={{ overflowX: 'auto' }}>
         <RolliesSheetTable selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange} rollies={rollies} setRollies={setRollies} fetch={fetch} setFetch={setFetch} type="Cases In Stock"/>
         </div>
         }
         {
          exsist &&
          <div style={{ overflowX: 'auto' }}>
          <EditRolliesSheetTable selectedDateRange={selectedDateRange} rollies={rollies} setRollies={setRollies} timesheetDataFromFirebase={timesheetData} fetch={fetch} setFetch={setFetch} type="Trays Used"/>
          </div>
          } 
           {
          exsist2 &&
          <div style={{ overflowX: 'auto' }}>
          <EditRolliesSheetTable selectedDateRange={selectedDateRange} rollies={rollies} setRollies={setRollies} timesheetDataFromFirebase={timesheetData2} fetch={fetch} setFetch={setFetch} type="Cases Produced"/>
          </div>
          } 
           {
          exsist3 &&
          <div style={{ overflowX: 'auto' }}>
          <EditRolliesSheetTable selectedDateRange={selectedDateRange} rollies={rollies} setRollies={setRollies} timesheetDataFromFirebase={timesheetData3} fetch={fetch} setFetch={setFetch} type="Cases Sold"/>
          </div>
          } 
           {
          exsist4 &&
          <div style={{ overflowX: 'auto' }}>
          <EditRolliesSheetTable selectedDateRange={selectedDateRange} rollies={rollies} setRollies={setRollies} timesheetDataFromFirebase={timesheetData4} fetch={fetch} setFetch={setFetch} type="Cases In Stock"/>
          </div>
          } 
    </div>
    </div>
    </div>
    </div>
  );
}

export default Rollies;
