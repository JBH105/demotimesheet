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

function Timesheet() {
  const [collapsed, setCollapsed] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [exsist, setExsist] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [selectedPayType, setSelectedPayType] = useState("");
  const [timesheetData, setTimesheetData] = useState([]);
  const [selectePosition, setSelectePosition] = useState("")
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

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleDateRangeChange = async (dates) => {
    await sleep(1000);
    if (dates) {
      setSelectedDateRange(dates);
    }
  };

  const handlePayTypeChange = async (payType) => {
    await sleep(500);
    setSelectedPayType(payType)
  }

  const handlePositionChange = async (payType) => {
    await sleep(500)
    setSelectePosition(payType)
  }

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
          <div className="w-6/12 mt-36 space-x-6  mx-auto  flex flex-row justify-center align-middle">
            {/* Start Date */}
            <Form.Item label="Date Range">
              <DatePicker.RangePicker onChange={handleDateRangeChange} />
            </Form.Item>
            
            <Form.Item label="Pay Type">
              <Select defaultValue="" style={{ width: 120 }} onChange={handlePayTypeChange}>
                <Select.Option value="">None</Select.Option>
                <Select.Option value="hourly">Hourly</Select.Option>
                <Select.Option value="weekly">Weekly</Select.Option>
                <Select.Option value="security">Security</Select.Option>
                <Select.Option value="bagger">Bagger</Select.Option>
                <Select.Option value="all">All</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Position">
              <Select defaultValue="" style={{ width: 150 }} onChange={handlePositionChange}>
                <Select.Option value="">None</Select.Option>
                <Select.Option value="Factory Worker">Factory Worker</Select.Option>
                <Select.Option value="Operator">Operator</Select.Option>
                <Select.Option value="Bagger">Bagger</Select.Option>
                <Select.Option value="General Manager">General Manager</Select.Option>
                <Select.Option value="Labourer">Labourer</Select.Option>
                <Select.Option value="CEO">CEO</Select.Option>
              </Select>
            </Form.Item>
            
          </div>
          <div className="w-12/12 flex flex-row justify-center align-middle">

            {/* Render your timesheet table */}
            {
              !exsist &&
              <div style={{ overflowX: 'auto' }}>
                <TimesheetTable selectedDateRange={selectedDateRange} selectedPayType={selectedPayType} selectePosition={selectePosition} setSelectedDateRange={setSelectedDateRange} employees={employees} setEmployees={setEmployees} fetch={fetch} setFetch={setFetch} />
              </div>
            }
            {
              exsist &&
              <div style={{ overflowX: 'auto' }}>
                <EditTimeSheetTable selectedDateRange={selectedDateRange} selectedPayType={selectedPayType} selectePosition={selectePosition} employees={employees} timesheetDataFromFirebase={timesheetData} fetch={fetch} setFetch={setFetch} />
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timesheet;
