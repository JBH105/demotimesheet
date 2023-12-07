import React, { useState, useEffect } from 'react';
import { Button, Switch, Input, Table, TimePicker } from 'antd';
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { app } from '../../firebase';
import moment from 'moment';
import Loading from '../../components/Common/Loading';
import { handleTimeChange, getDateRange } from '../../utils/timeUtils';

function EditTimeSheetTable({ selectedDateRange, selectedPayType, employees, timesheetDataFromFirebase, fetch, setFetch }) {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [timesheetData, setTimesheetData] = useState([]);
  const [datesArray, setDatesArray] = useState([]);
  const formattedStartDate = moment(selectedDateRange[0]?.$d).format("(ddd) YYYY-MM-DD")
  const formattedEndDate = moment(selectedDateRange[1]?.$d).format("(ddd) YYYY-MM-DD")

  const db = getFirestore(app);

  useEffect(() => {

    if (selectedDateRange.length === 2) {
      setFilterLoading(true);
      generateTimesheetData();
    }
  }, [selectedDateRange, employees, selectedPayType, timesheetDataFromFirebase]);

  useEffect(() => {
    setFilterLoading(false);
  }, [timesheetData])

  const generateTimesheetData = () => {
    const startDate = moment(selectedDateRange[0]?.$d);
    const endDate = moment(selectedDateRange[1]?.$d);
    const dates = getDateRange(selectedDateRange)
    setDatesArray(dates);

    const timesheetDataArray = [];

    let filteredEmployees = employees.filter(x => x.payType.toLowerCase() === selectedPayType);
    if (selectedPayType === "all") filteredEmployees = employees;
    filteredEmployees.forEach(employee => {

      const period = `${startDate?.format("YYYY-MM-DD")}-${endDate?.format("YYYY-MM-DD")}`
      const timesheetId = `${employee.id}-${period}`

      const timesheetObject = {
        id: timesheetId,
        email: employee.email,
        name: employee.name,
        sin: employee.sin,
        payRate: employee.payRate,
        payType: employee.payType,
        dates: {},
        totalTime: '0h 0m',
        overtime1: '0h 0m',
        overtime2: '0h 0m',
        period,
        start: startDate?.format("YYYY-MM-DD"),
        worked: false,
        units: {},
        totalUnits: '0',
        status: 'editing',
      };

      dates.forEach(date => {
        timesheetObject.dates[date] = {
          start: '',
          end: '',
          break: false,
          totalHours: '0',
        };
      });

      // Initialize units property for baggers
      if (employee.payType === 'bagger') {
        dates.forEach(date => {
          timesheetObject.units[date] = {
            units: '',
          };
        });
      }

      // Check if timesheet data is available from prop
      const existingTimesheetData = timesheetDataFromFirebase.find(data => data.id === timesheetId);
      if (existingTimesheetData) {
        // Use the data from prop
        timesheetObject.totalTime = existingTimesheetData.totalTime;
        timesheetObject.overtime1 = existingTimesheetData.overtime1;
        timesheetObject.overtime2 = existingTimesheetData.overtime2;
        timesheetObject.worked = existingTimesheetData.worked;
        timesheetObject.dates = existingTimesheetData.dates;
        timesheetObject.units = existingTimesheetData.units;

        timesheetObject.totalUnits = existingTimesheetData.totalUnits;
        timesheetObject.status = existingTimesheetData.status;
      }

      timesheetDataArray.push(timesheetObject);
    });

    setTimesheetData(timesheetDataArray);
  };

  const handleStartTimeChange = (employeeIndex, date, time) => {
    handleTimeChange(employees, datesArray, timesheetData, setTimesheetData, employeeIndex, date, time, "start");
  };

  const handleEndTimeChange = (employeeIndex, date, time) => {
    handleTimeChange(employees, datesArray, timesheetData, setTimesheetData, employeeIndex, date, time, "end");
  };

  const handleUnitsChange = (employeeIndex, date, units) => {
    const updatedTimesheetData = [...timesheetData];
    updatedTimesheetData[employeeIndex].units[date].units = units;

    // Calculate total units for baggers
    if (updatedTimesheetData[employeeIndex].payType === 'bagger') {
      const totalUnits = datesArray.reduce(
        (acc, currentDate) => {
          const { units } = updatedTimesheetData[employeeIndex].units[currentDate];
          if (units !== '') {
            return acc + parseInt(units);
          }
          return acc;
        },
        0
      );
      updatedTimesheetData[employeeIndex].totalUnits = totalUnits.toString();
    }

    setTimesheetData(updatedTimesheetData);
  };

  const handleBreakChange = (employeeIndex, date) => {

    const updatedTimesheetData = [...timesheetData];

    if (!updatedTimesheetData[employeeIndex].dates[date].totalHours ||
      updatedTimesheetData[employeeIndex].dates[date].totalHours === "0") {
      toast("Cannot have break for someone who didn't work")
      return;
    }
    updatedTimesheetData[employeeIndex].dates[date].break = !updatedTimesheetData[employeeIndex].dates[date].break;

    handleTimeChange(employees, datesArray, timesheetData, setTimesheetData, employeeIndex, date);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'payType', key: 'payType' },
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
          const employeeType = record.payType;
          const dateData = record.units[date];
          const dateData2 = record.dates[date];

          if (employeeType === 'bagger') {
            return (
              <Input
                type="number"
                placeholder='units'
                value={dateData?.units}
                onChange={(e) => handleUnitsChange(index, date, e.target.value)}
              />
            );
          } else if (employeeType === 'weekly') {
            return (
              <h1>weekly Employee</h1>
            );
          }
          else {
            return (
              <div className='space-y-2'>
                <TimePicker
                  format="HH:mm"
                  value={dateData2?.start ? moment(dateData2?.start, 'HH:mm') : null}
                  onChange={time => handleStartTimeChange(index, date, time)}
                />
                <TimePicker
                  format="HH:mm"
                  value={dateData2?.end ? moment(dateData2?.end, 'HH:mm') : null}
                  onChange={time => handleEndTimeChange(index, date, time)}
                />
                <div className='flex'>
                  Break:
                  {/* Add the "Break" toggle button here */}
                  <Switch
                    className='bg-gray-700'
                    checked={dateData2?.break}
                    onChange={() => handleBreakChange(index, date)}
                  />
                </div>

                <div className='ml-2 mt-2'>
                  Total: {dates[date]?.totalHours}
                </div>
              </div>
            );

          }

        },
      };

    }),

    {
      title: 'Total',
      dataIndex: 'totalTime',
      key: 'totalTime',
      render: (totalTime, record) => {
        const employeeType = record.payType;
        if (employeeType === 'hourly' || employeeType === 'security') {
          return totalTime;
        }
        return <h1>null</h1>;
      },
    },
    {
      title: 'Ot1',
      dataIndex: 'overtime1',
      key: 'overtime1',
      render: (overtime1, record) => {
        const employeeType = record.payType;
        if (employeeType === 'hourly') {
          return overtime1;
        }
        return <h1>null</h1>;
      },
    },
    {
      title: 'Ot2',
      dataIndex: 'overtime2',
      key: 'overtime2',
      render: (overtime2, record) => {
        const employeeType = record.payType;
        if (employeeType === 'hourly') {
          return overtime2;
        }
        return <h1>null</h1>;
      },
    },
    {
      title: 'Total Units',
      dataIndex: 'totalUnits',
      key: 'totalUnits',
      render: (totalUnits, record) => {
        if (record.payType === 'bagger') {
          return totalUnits;
        }
        return <h1>null</h1>;
      },
    },
    {
      title: 'Worked',
      dataIndex: 'worked',
      key: 'worked',
      render: (worked, record, index) => {
        if (record.payType === 'weekly') {
          return (
            <Switch
              className={worked ? `bg-blue-700` : `bg-gray-700`}
              checked={worked}
              onChange={() => {
                const updatedTimesheetData = [...timesheetData];
                updatedTimesheetData[index].worked = !updatedTimesheetData[index].worked;
                setTimesheetData(updatedTimesheetData);
              }}
            />

          );
        }
        return <h1>null</h1>;
      }
    }
  ];

  const handleSaveToFirebase = async () => {
    if (timesheetData?.length === 0) {
      toast("you can't save empty table")
      return;
    }
    setLoading(true);
    try {
      // Save timesheetData to Firebase
      for (const record of timesheetData) {
        if (!hasWorked(record)) continue;
        // const uniqueIdentifier = `${record.sin}${record.period}`;
        const uniqueIdentifier = `${record.id}`;
        const updatedRecord = { ...record, status: 'editing' };
        const docRef = await setDoc(doc(db, 'timesheet', uniqueIdentifier), updatedRecord);

      }
      toast('Timesheet data saved to Firebase');
      setFetch(!fetch)
      setLoading(false);
    } catch (error) {
      console.error('Error writing document: ', error);
      toast('Timesheet data failed to save to Firebase');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (timesheetData?.length === 0) {
      toast("you can't submit empty table")
      return;
    }
    setLoading2(true);
    try {
      // Save timesheetData to Firebase
      for (const record of timesheetData) {
        if (!hasWorked(record)) continue;
        // const uniqueIdentifier = `${record.sin}${record.period}`;
        const uniqueIdentifier = `${record.id}`;
        const updatedRecord = { ...record, status: 'pending' };
        const docRef = await setDoc(doc(db, 'timesheet', uniqueIdentifier), updatedRecord);

      }
      toast('Timesheet data saved to Firebase');
      setFetch(!fetch)
      setLoading2(false);
    } catch (error) {
      console.error('Error writing document: ', error);
      toast('Timesheet data failed to submit to Firebase');
      setLoading2(false);
    }
  };

  const hasWorked = (rec) => {
    if (rec.payType === 'hourly' || rec.payType === 'security') {
      if (rec.totalTime === '0h 0m') return false;
      else return true;
    }
    else if (rec.payType === 'bagger') {
      if (rec.totalUnits === '0') return false;
      else return true;
    }
    else if (rec.payType === 'weekly') {
      return rec.worked;
    }
    else return false;
  }

  return (
    <div>
      {
        filterLoading ? <Loading size="large" color="black" />
          :
          <>
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
          </>
      }
    </div>
  );
}

export default EditTimeSheetTable;
