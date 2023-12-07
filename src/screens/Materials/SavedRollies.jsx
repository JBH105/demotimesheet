import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Select, Table,Button } from 'antd';
import { query, where, getDocs, collection, getFirestore } from 'firebase/firestore';
import { app } from '../../firebase';
import Sidebar from "../../components/Common2/RolliesSidebar"
import Topbar from "../../components/Common2/Topbar"
import PendingRollies from '../../components/Rollies/PendingRollies';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import moment from 'moment';

// ...


function SavedRollies() {
  const [startDates, setStartDates] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [type, setType] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [filteredTimesheets2, setFilteredTimesheets2] = useState([]);
  const [filteredTimesheets3, setFilteredTimesheets3] = useState([]);
  const [filteredTimesheets4, setFilteredTimesheets4] = useState([]);
  const db = getFirestore(app);
   // This holds the information about dark mode/light mode
   const [mode, setMode] = useState();

   const navigate = useNavigate();


  const formatStartDate = (date) => {
    //
    if(type == "Weekly"){
     return moment(date, 'YYYY-MM-DD').format('DD MMMM dddd YYYY');
    }else{
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
  

const fetchDates = async (value) =>{
    setLoading(true)
   
      try {
        const timesheetsCollection = collection(db, 'rollies');
        const q = query(timesheetsCollection);
        const querySnapshot = await getDocs(q);
        
        if(value == "Weekly"){
        const uniqueStartDates = new Set();
        querySnapshot.forEach(doc => {
          const startDate = doc.data().start;
          uniqueStartDates.add(startDate);
        });
        setStartDates(Array.from(uniqueStartDates));
       }else if(value == "Monthly"){
        const uniqueMonths = new Set();
        
        querySnapshot.forEach((doc) => {
            const startDate = doc.data().start;
            const monthYear = moment(startDate, 'YYYY-MM-DD').format('MMMM YYYY');
            uniqueMonths.add(monthYear);
            });
        setStartDates(Array.from(uniqueMonths));
       }else{
        //set start dates as all time an array with a single value "all time"
       
        setStartDates(["All time"]);
       }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching start dates:', error);
        setLoading(false)
      }
    
  }
 

  const fetchRollies = async () =>{
    setLoading(true)
      if(type == "Weekly" && selectedStartDate){
      
        const timesheetsCollection = collection(db, 'rollies');
        const q = query(timesheetsCollection, where('type', '==', "Trays Used"), where('start', '==', selectedStartDate));
        const querySnapshot = await getDocs(q);

        const timesheets = querySnapshot.docs.map((doc) => ({
            id: doc.id, // Adding the document ID to the data object
            ...doc.data(),
          }));
        setFilteredTimesheets(timesheets);

        const timesheetsCollection2 = collection(db, 'rollies');
        const q2 = query(timesheetsCollection2, where('type', '==', "Cases Produced"), where('start', '==', selectedStartDate));
        const querySnapshot2 = await getDocs(q2);

        const timesheets2 = querySnapshot2.docs.map((doc) => ({
            id: doc.id, // Adding the document ID to the data object
            ...doc.data(),
          }));
        setFilteredTimesheets2(timesheets2);

        const timesheetsCollection3 = collection(db, 'rollies');
        const q3 = query(timesheetsCollection3, where('type', '==', "Cases Sold"), where('start', '==', selectedStartDate));
        const querySnapshot3 = await getDocs(q3);

        const timesheets3 = querySnapshot3.docs.map((doc) => ({
            id: doc.id, // Adding the document ID to the data object
            ...doc.data(),
          }));
        setFilteredTimesheets3(timesheets3);

        const timesheetsCollection4 = collection(db, 'rollies');
        const q4 = query(timesheetsCollection4, where('type', '==', "Cases In Stock"), where('start', '==', selectedStartDate));
        const querySnapshot4 = await getDocs(q4);

        const timesheets4 = querySnapshot4.docs.map((doc) => ({
            id: doc.id, // Adding the document ID to the data object
            ...doc.data(),
          }));
        setFilteredTimesheets4(timesheets4);

        setLoading(false)
      
    }else if(type == "Monthly" && selectedStartDate) {
   
    // Parse the selectedStartDate to obtain the month and year
    const selectedMonthYear = moment(selectedStartDate, 'MMMM YYYY').format('YYYY-MM');

    // Define the start and end date of the selected month
    const startDateOfMonth = moment(selectedMonthYear, 'YYYY-MM');
    const endDateOfMonth = startDateOfMonth.clone().endOf('month');

    try {
      const timesheetsCollection = collection(db, 'rollies');
      const q = query(
        timesheetsCollection,
        where('type', '==', "Trays Used"),
        where('start', '>=', startDateOfMonth.format('YYYY-MM-DD')),
        where('start', '<=', endDateOfMonth.format('YYYY-MM-DD'))
      );

      const querySnapshot = await getDocs(q);

      const timesheets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));


      setFilteredTimesheets(timesheets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rollies:', error);
      setLoading(false);
    }
    }else if(type == "All Time" && selectedStartDate)
    {
        try {
            const timesheetsCollection = collection(db, 'rollies');
            const q = query(timesheetsCollection, where('type', '==', "Trays Used"));
      
            const querySnapshot = await getDocs(q);
      
            const timesheets = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
      
            setFilteredTimesheets(timesheets);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching rollies:', error);
            setLoading(false);
          }
    }else{
        toast("Please select a date type to view")
    }
    

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
        value={loading? "loading..." : selectedStartDate}
      >
        {startDates?.map(startDate => (
          <Select.Option key={startDate} value={startDate}>
             {formatStartDate(startDate)}
          </Select.Option>
        ))}
      </Select>
        

      <Button onClick={fetchRollies} type="primary" className='bg-blue-700'>
          {loading ? 'loading...' : 'Search'}
       </Button>
      
      </>
      
          </div>
         
    <div className="w-12/12 flex flex-col space-y-2 justify-center align-middle">
        {type == "Weekly" &&
        <>
       <div style={{ overflowX: 'auto' }}>
        <PendingRollies filteredTimesheets={filteredTimesheets} category={"Trays Used"}/>
       </div>

      <div style={{ overflowX: 'auto' }}>
        <PendingRollies filteredTimesheets={filteredTimesheets2} category={"Cases Produced"}/>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <PendingRollies filteredTimesheets={filteredTimesheets3} category={"Cases Sold"}/>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <PendingRollies filteredTimesheets={filteredTimesheets4} category={"Cases In Stock"}/>
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

export default SavedRollies;
