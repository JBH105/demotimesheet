import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Select, Table } from 'antd';
import { query, where, getDocs, collection, getFirestore } from 'firebase/firestore';
import { app } from '../../firebase';
import Sidebar from "../../components/Common/Sidebar"
import Topbar from "../../components/Common/Topbar"
import PendingTable from '../../components/Timesheet/PendingTable';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import moment from 'moment';

function Pending() {
  const [startDates, setStartDates] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("editing");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const db = getFirestore(app);
  // This holds the information about dark mode/light mode
  const [mode, setMode] = useState();

  const navigate = useNavigate();

  const formatStartDate = (date) => {
    return moment(date, 'YYYY-MM-DD').format('(ddd) DD MMMM YYYY');
  };


  const auth = getAuth(app);

  const [show, setShow] = useState(false);
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
      if (user?.email === import.meta.env.VITE_ADMIN) {
        setShow(true)
      } else {
        setShow(false)
      }

      setUserTypeIdentified(true)
    });

    return () => {
      // Clean up the listener when component unmounts
      unsubscribe();
    };
  }, [navigate]);


  useEffect(() => {
    setLoading(true)
    const fetchStartDates = async () => {
      try {
        const timesheetsCollection = collection(db, 'timesheet');
        const q = query(timesheetsCollection);
        const querySnapshot = await getDocs(q);

        const uniqueStartDates = new Set();
        querySnapshot.forEach(doc => {
          const startDate = doc.data().start;
          uniqueStartDates.add(startDate);
        });

        setStartDates(Array.from(uniqueStartDates));
        setLoading(false)
      } catch (error) {
        console.error('Error fetching start dates:', error);
        setLoading(false)
      }
    };

    fetchStartDates();
  }, [db]);

  useEffect(() => {
    setLoading(true)
    const filterTimesheets = async () => {
      if (selectedStartDate) {
        const timesheetsCollection = collection(db, 'timesheet');
        const q = query(timesheetsCollection, where('status', '==', status), where('start', '==', selectedStartDate));
        const querySnapshot = await getDocs(q);

        const timesheets = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Adding the document ID to the data object
          ...doc.data(),
        }));
        setFilteredTimesheets(timesheets);
        setLoading(false)
      }
      setLoading(false)
    };

    filterTimesheets();
  }, [db, selectedStartDate, status, fetch]);



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
          <div className="w-5/12 mb-2 mt-36 space-x-6  mx-auto  flex flex-row justify-center align-middle">
            {show &&
              <>
                <Select

                  placeholder="Select a start date"
                  onChange={value => setStatus(value)}
                  value={status}
                >
                  <Option value="editing">Editing</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="denied">Denied</Option>
                </Select>
                <Select
                  className='w-60'
                  placeholder="Select a start date"
                  onChange={value => setSelectedStartDate(value)}
                  value={loading ? "loading..." : selectedStartDate}
                >
                  {startDates.map(startDate => (
                    <Select.Option key={startDate} value={startDate}>
                      {formatStartDate(startDate)}
                    </Select.Option>
                  ))}
                </Select>
              </>
            }
          </div>
          {show &&
            <div className="w-12/12 flex flex-row justify-center align-middle">
              <div style={{ overflowX: 'auto' }}>
                <PendingTable filteredTimesheets={filteredTimesheets} fetch={fetch} setFetch={setFetch} />
              </div>
            </div>
          }
          {
            !show && userTypeIdentified && <h1 className='text-center text-7xl'>ACCESS DENIED</h1>
          }
        </div>
      </div>
    </div>
  );
}

export default Pending;
