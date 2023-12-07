import React, { useState, useEffect } from 'react';
import { Button, Switch, Modal, Form, Input, Select, Table, DatePicker, TimePicker } from 'antd';
import { addDoc, query, where, getDocs, collection, setDoc, doc, onSnapshot, getFirestore, updateDoc, deleteDoc } from 'firebase/firestore';
import { app } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import Sidebar from "../../components/Common/Sidebar"
import Topbar from "../../components/Common/Topbar"
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import TimesheetTable from '../../components/Timesheet/TimeSheetTable';
import EditTimeSheetTable from '../../components/Timesheet/EditTimeSheetTable';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function ManagerTimesheet() {
  const [collapsed, setCollapsed] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [exsist, setExsist] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [timesheetData, setTimesheetData] = useState([]);
  // This holds the information about dark mode/light mode
  const [mode, setMode] = useState();

  const navigate = useNavigate();


  const auth = getAuth(app);

  const [show, setShow] = useState(false);

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
      if (user?.email === import.meta.env.VITE_ADMIN) {
        setShow(true)
      } else {
        setShow(false)
      }
    });

    return () => {
      // Clean up the listener when component unmounts
      unsubscribe();
    };
  }, [navigate]);

  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'employees'), snapshot => {
      const employeesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeesData);
    });

    return () => {
      unsubscribe();
    };
  }, [db]);

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
    }
  }, [selectedDateRange, fetch]);


  const checkTimesheetsExist = async (period) => {
    try {
      const timesheetRef = collection(db, 'timesheet');
      const q = query(
        timesheetRef,
        where('period', '==', period)
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
    if (dates) {
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
        <div className="w-10/12 mb-20">
          {/* Content of the right div */}
          {/* Content of the right div */}
          <div className="w-5/12 mt-36 space-x-6  mx-auto  flex flex-row justify-center align-middle">
            {/* Start Date */}
            {show &&
              <Form.Item label="Start Date">
                <DatePicker.RangePicker onChange={handleDateRangeChange} />
              </Form.Item>
            }
          </div>
          {show &&
            <div className="w-12/12 flex flex-row justify-center align-middle">

              {/* Render your timesheet table */}
              {
                !exsist &&
                <div style={{ overflowX: 'auto' }}>
                  <TimesheetTable selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange} employees={employees} setEmployees={setEmployees} fetch={fetch} setFetch={setFetch} />
                </div>
              }
              {
                exsist &&
                <div style={{ overflowX: 'auto' }}>
                  <EditTimeSheetTable selectedDateRange={selectedDateRange} employees={employees} timesheetDataFromFirebase={timesheetData} fetch={fetch} setFetch={setFetch} />
                </div>
              }
            </div>
          }
          {
            !show && <h1 className='text-center text-7xl'>ACCESS DENIED</h1>
          }
        </div>
      </div>
    </div>
  );
}

export default ManagerTimesheet;
