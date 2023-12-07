import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Select, Table, Button } from 'antd';
import { query, where, getDocs, collection, getFirestore } from 'firebase/firestore';
import { app } from '../../../firebase';
import Sidebar from "../../../components/Common2/PackersSidebar"
import Topbar from "../../../components/Common2/Topbar"
import PendingMaterialsSheetTable from '../../../components/Common2/PendingMaterialsSheetTable'
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import moment from 'moment';

function SavedPackers() {

  const [startDates, setStartDates] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  const categories = ['Trays Used', 'Cases Produced', 'Cases Sold', 'Cases In Stock'];
  // const packers = ['CF', 'CL', 'CM', 'BB FF', 'BB LT', 'CC ORIG', 'CC SILVER', 'PU', 'DK', 'DIS FF', 'DIS LT', 'PLAY FF', 'PLAY LT', 'DM FF', 'DM LT', 'RF', 'RL', 'RBB', 'RMEN'];

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const db = getFirestore(app);
  // This holds the information about dark mode/light mode
  const [mode, setMode] = useState();

  const navigate = useNavigate();

  const formatStartDate = (date) => {
    //
    if (type == "Weekly") {
      return moment(date, 'YYYY-MM-DD').format('DD MMMM dddd YYYY');
    } else {
      return date;
    }
  };

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

  const fetchDates = async (value) => {
    setLoading(true)

    try {
      const timesheetsCollection = collection(db, 'packers');
      const q = query(timesheetsCollection);
      const querySnapshot = await getDocs(q);

      if (value == "Weekly") {
        const uniqueStartDates = new Set();
        querySnapshot.forEach(doc => {
          const startDate = doc.data().start;
          uniqueStartDates.add(startDate);
        });
        setStartDates(Array.from(uniqueStartDates));
      } else if (value == "Monthly") {
        const uniqueMonths = new Set();

        querySnapshot.forEach((doc) => {
          const startDate = doc.data().start;
          const monthYear = moment(startDate, 'YYYY-MM-DD').format('MMMM YYYY');
          uniqueMonths.add(monthYear);
        });
        setStartDates(Array.from(uniqueMonths));
      } else {
        //set start dates as all time an array with a single value "all time"

        setStartDates(["All time"]);
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching start dates:', error);
      setLoading(false)
    }

  }

  const fetchPackers = async () => {
    try {
      const timesheets = await Promise.all(categories.map(async (category) => {
        const ts = await fetchPackersByCategory(category);
        return {timesheets: ts, category}
      }));
      setFilteredTimesheets(timesheets);
    } catch (error) {
      console.error('Error setting timesheets:', error);
    }
  }

  const fetchPackersByCategory = async (category) => {
    setLoading(true)
    let timesheets = []
    if (type == "Weekly" && selectedStartDate) {

      const timesheetsCollection = collection(db, 'packers');
      const q = query(timesheetsCollection, where('type', '==', category), where('start', '==', selectedStartDate));
      const querySnapshot = await getDocs(q);

      timesheets = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Adding the document ID to the data object
        ...doc.data(),
      }));
      // setFilteredTimesheets(timesheets);
      setLoading(false)

    } else if (type == "Monthly" && selectedStartDate) {

      // Parse the selectedStartDate to obtain the month and year
      const selectedMonthYear = moment(selectedStartDate, 'MMMM YYYY').format('YYYY-MM');

      // Define the start and end date of the selected month
      const startDateOfMonth = moment(selectedMonthYear, 'YYYY-MM');
      const endDateOfMonth = startDateOfMonth.clone().endOf('month');

      try {
        const timesheetsCollection = collection(db, 'packers');
        const q = query(
          timesheetsCollection,
          where('type', '==', category),
          where('start', '>=', startDateOfMonth.format('YYYY-MM-DD')),
          where('start', '<=', endDateOfMonth.format('YYYY-MM-DD'))
        );

        const querySnapshot = await getDocs(q);

        timesheets = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // setFilteredTimesheets(timesheets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching packers:', error);
        setLoading(false);
      }
    } else if (type == "All Time" && selectedStartDate) {
      try {
        const timesheetsCollection = collection(db, 'packers');
        const q = query(timesheetsCollection, where('type', '==', category));

        const querySnapshot = await getDocs(q);

        timesheets = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // setFilteredTimesheets(timesheets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching packers:', error);
        setLoading(false);
      }
    } else {
      toast("Please select a date type to view")
    }

    return timesheets;

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
          <div className="w-5/12 mb-2 mt-36 space-x-6  mx-auto  flex flex-row justify-center align-middle">

            <>
              <Select
                placeholder="View By"
                onChange={(value) => {
                  setSelectedStartDate(null)
                  setType(value)
                  fetchDates(value)
                }}
                value={type}
              >
                <Option value="Weekly">Weekly</Option>
                <Option value="Monthly">Monthly</Option>
                <Option value="All Time">All Time</Option>
              </Select>
              <Select
                placeholder="Select a date type to view"
                onChange={value => setSelectedStartDate(value)}
                value={loading ? "loading..." : selectedStartDate}
              >
                {startDates?.map(startDate => (
                  <Select.Option key={startDate} value={startDate}>
                    {formatStartDate(startDate)}
                  </Select.Option>
                ))}
              </Select>


              <Button onClick={fetchPackers} type="primary" className='bg-blue-700'>
                {loading ? 'loading...' : 'Search'}
              </Button>

            </>

          </div>

          <div className="w-12/12 flex flex-col space-y-2 justify-center align-middle">
            {type == "Weekly" &&
              <>
                <div style={{ overflowX: 'auto' }}>
                {
                  filteredTimesheets && filteredTimesheets.map(x => (
                      <PendingMaterialsSheetTable filteredTimesheets={x.timesheets} material={"Packer"} category={x.category} />
                  ))
                }
                </div>
              </>}
          </div>
          <div className="w-12/12 flex flex-col space-y-2 justify-center align-middle">
            {type == "Monthly" &&
              <>
                <h1 className='text-center'>Under construction</h1>
              </>}
          </div>

          <div className="w-12/12 flex flex-col space-y-2 justify-center align-middle">
            {type == "All Time" &&
              <>
                <h1 className='text-center'>Under construction</h1>
              </>}
          </div>

        </div>
      </div>
    </div>
  );
}

export default SavedPackers;
