import React, { useState, useEffect } from 'react';
import { Button,Input, Table } from 'antd';
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { app } from '../../firebase';
import moment from 'moment';
import { getDateRange } from '../../utils/timeUtils'

function EditTimeSheetTable({selectedDateRange,rollies,setRollies,timesheetDataFromFirebase,fetch, setFetch}) {

    const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [timesheetData, setTimesheetData] = useState([]);
  const [datesArray, setDatesArray] = useState([]);
  const formattedStartDate = moment(selectedDateRange[0]?.$d).format("(ddd) YYYY-MM-DD")
  const formattedEndDate = moment(selectedDateRange[1]?.$d).format("(ddd) YYYY-MM-DD")

  const db = getFirestore(app);

  
  useEffect(() => {
    if (selectedDateRange.length === 2) {
      const generateTimesheetData = () => {
        const startDate = moment(selectedDateRange[0]?.$d);
        const endDate = moment(selectedDateRange[1]?.$d);
        const dates = getDateRange(selectedDateRange)
        setDatesArray(dates);

        const timesheetDataArray = [];

        rollies.forEach(rollie => {
          const timesheetObject = {
            rollie: rollie,
            type:"Trays",
            dates: {},
            total: 0, 
            period:`${startDate?.format("YYYY-MM-DD")}-${endDate?.format("YYYY-MM-DD")}`,
            start:startDate?.format("YYYY-MM-DD"),
            status: '',
          };

          dates.forEach(date => {
            timesheetObject.dates[date] = {
              units: 0,
              notes: ''
            };
          });

          
        
         // Check if timesheet data is available from prop
        const existingTimesheetData = timesheetDataFromFirebase.find(data => data.rollie === rollie);
       
        if (existingTimesheetData) {
          // Use the data from prop
          timesheetObject.rollie = existingTimesheetData.rollie;
          timesheetObject.type = existingTimesheetData.type;
          timesheetObject.total = existingTimesheetData.total;
          timesheetObject.dates = existingTimesheetData.dates;
          timesheetObject.status = existingTimesheetData.status;
          }
          timesheetDataArray.push(timesheetObject);
        });
        setTimesheetData(timesheetDataArray);
      };

      generateTimesheetData();
    }
  }, [selectedDateRange, rollies,timesheetDataFromFirebase]);


  const handleUnitsChange = (index, date, units) => {
    const updatedTimesheetData = [...timesheetData];
    updatedTimesheetData[index].dates[date].units = units;

    
      const totalUnits = datesArray.reduce(
        (acc, currentDate) => {
          const { units } = updatedTimesheetData[index].dates[currentDate];
          if (units !== '') {
            return acc + parseInt(units);
          }
          return acc;
        },
        0
      );
      updatedTimesheetData[index].total = totalUnits;
    

    setTimesheetData(updatedTimesheetData);
  };

  const handleNotesChange = (index, date, notes) => {
    const updatedTimesheetData = [...timesheetData];
    updatedTimesheetData[index].dates[date].notes = notes;
    setTimesheetData(updatedTimesheetData);
  };

  const columns = [
    { title: 'Rollie', dataIndex: 'rollie', key: 'rollie' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    ...datesArray.map(date => {
      const dayOfWeek = moment(date, '(ddd) YYYY-MM-DD').format('ddd');
      const isWeekend = dayOfWeek === 'Sat' || dayOfWeek === 'Sun';
  
      return {
        title: (
          <div className={isWeekend ? 'border-y-2 border-indigo-500' : ''}>
            {date}
          </div>
        ),
        dataIndex: 'dates',
        key: date,
        render: (dates, record, index) => {
          
          const dateData = dates[date];
  
          return (
            <div className='space-y-2'>
             <Input
                  type="number"
                  placeholder='units'
                  value={dateData?.units}
                  onChange={(e) => handleUnitsChange(index, date, e.target.value)}
                />      
               <Input
                  type="text"
                  placeholder='notes'
                  value={dateData?.notes}
                  onChange={(e) => handleNotesChange(index, date, e.target.value)}
                />        
            </div>
          );
        },
      };
    }),
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (totalTime, record) => {
          return totalTime; 
      },
    }
  ];
  
  const handleSaveToFirebase = async () => {
    if(timesheetData?.length === 0){
      toast("you can't save empty table")
      return;
    }
    setLoading(true);
      try {
        // Save timesheetData to Firebase
        for (const record of timesheetData) {
          const uniqueIdentifier = `${record.rollie}-${record.type}-${record.period}`;
          const updatedRecord = { ...record, status: 'editing' };
          const docRef = await setDoc(doc(db, 'rollies', uniqueIdentifier), updatedRecord);
        }
        toast('Timesheet data saved to Firebase');
        setLoading(false);
        setFetch(!fetch)
      } catch (error) {
        console.error('Error writing document: ', error);
        toast('Timesheet data failed to save to Firebase');
        setLoading(false);
      }
    };
  
  const handleSubmit = async () => {
    if(timesheetData?.length === 0){
      toast("you can't submit empty table")
      return;
    }
    setLoading2(true);
    try {
      // Save timesheetData to Firebase
      for (const record of timesheetData) {
        const uniqueIdentifier = `${record.rollie}-${record.type}-${record.period}`;
        const updatedRecord = { ...record, status: 'pending' };
        const docRef = await setDoc(doc(db, 'rollies', uniqueIdentifier), updatedRecord);
      }
      toast('Timesheet data saved to Firebase');
      setLoading2(false);
      setFetch(!fetch)
    } catch (error) {
      console.error('Error writing document: ', error);
      toast('Timesheet data failed to submit to Firebase');
      setLoading2(false);
    }
  };
    
    
  

  return (
    <div>
       <ToastContainer autoClose={2000} />
       <div className="flex justify-center mt-2 mb-4 space-x-1">
        <h1>Work Week:</h1>
        <div className="flex space-x-2">
          <p>( {formattedStartDate}</p>
          <p>-</p>
          <p>{formattedEndDate} )</p>
        </div>
      </div>
      {/* Render your timesheet table */}
      <Table dataSource={timesheetData} columns={columns} pagination={false} />
      
      <div className="flex justify-center space-x-4 mt-4">
        <Button
          className="bg-blue-600 text-white"
          type="primary px-10"
          
        >
          {loading ? 'loading...' : 'Reset'}
        </Button>
        <Button onClick={handleSaveToFirebase} type="primary" className='bg-blue-700'>
          {loading ? 'loading...' : 'Save TimeSheet'}
       </Button>
        <Button
          className="bg-purple-600 text-white px-10"
          type="primary"
          onClick={handleSubmit}
        >
          {loading2 ? 'loading...' : 'Submit'}
        </Button>
      </div>
    </div>
  );
}

export default EditTimeSheetTable;
