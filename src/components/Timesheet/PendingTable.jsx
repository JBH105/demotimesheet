import React,{useState} from 'react';
import { Table,Button,Modal } from 'antd';
import { query, where,doc, getDocs,updateDoc, collection, getFirestore } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { app } from '../../firebase';
import PdfModal from './PdfModal';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import PdfModelCount from '../../utils/generatePdfContent';
import { pdf } from '@react-pdf/renderer';


function PendingTable({ filteredTimesheets,fetch,setFetch }) {
    const db = getFirestore(app);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [calculatedEarnings, setCalculatedEarnings] = useState({});
    const [generatedPdf, setGeneratedPdf] = useState(null);

    const sendEmail = async (data) => {
      const formData = new FormData();
      formData.append("to", data.email);
      formData.append("subject", "Timesheet");
      formData.append("text", "Hello Dear <br/> Pease checck your timesheet");
    
      const pdfContent = await PdfModelCount(data);
      const pdfBlob = await pdf(pdfContent).toBlob()
      const pdfFile = new File([pdfBlob], "timesheet.pdf", { type: "application/pdf" });
    
      formData.append("pdfFile", pdfFile);
    
      try {
        const result = await axios.post("http://localhost:8000/send-email", formData);
        console.log(result);
        toast(result.data.message);
      } catch (err) {
        console.error("err", err);
      }
    };
    

    const approveTimesheet = async (record) => {
        
        const timesheetRef = doc(db, 'timesheet', record.id);
        try {
          await updateDoc(timesheetRef, { status: 'approved' });
          toast(`Approved timesheet with ID: ${record.id}`);
          setFetch(!fetch)
        } catch (error) {
          console.error('Error updating timesheet:', error);
          toast("error approving timesheet")
        }
      };
    
      const denyTimesheet = async (record) => {
        const timesheetRef = doc(db, 'timesheet', record.id);
        try {
          await updateDoc(timesheetRef, { status: 'denied' });
          toast(`Denied timesheet with ID: ${record.id}`);
          setFetch(!fetch)
        } catch (error) {
          console.error('Error updating timesheet:', error);
          toast("error denying timesheet")
        }
      };

      const generatePaystub = (record) => {
        // Logic to generate paystub
        
      };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Pay Type', dataIndex: 'payType', key: 'payType' },
    { title: 'Pay Rate', dataIndex: 'payRate', key: 'payRate' },
    {
      title: 'Breaks',
      dataIndex: 'breaks',
      key: 'breaks',
      render: (_, record) => calculateTotalBreaks(record),
    },
    { title: 'Total Time', dataIndex: 'totalTime', key: 'totalTime' },
    { title: 'Overtime 1', dataIndex: 'overtime1', key: 'overtime1' },
    { title: 'Overtime 2', dataIndex: 'overtime2', key: 'overtime2' },
    { title: 'Total Units', dataIndex: 'totalUnits', key: 'totalUnits' },
    {
      title: 'Worked',
      dataIndex: 'worked',
      key: 'worked',
      render: worked => (worked ? 'Yes' : 'Null'),
    },
    {
        title: 'Total Earnings',
        dataIndex: 'totalEarnings',
        key: 'totalEarnings',
        render: (totalEarnings, record) => {
          if (record.payType === 'hourly') {
            const hourlyEarnings = calculateHourlyEarnings(record);
            return `$${hourlyEarnings}`;
          } else if (record.payType === 'weekly') {
            const weeklyEarnings = calculateWeeklyEarnings(record);
            return weeklyEarnings;
          } else if (record.payType === 'security') {
            const securityEarnings = calculateSecurityEarnings(record);
            return securityEarnings;
          } else if (record.payType === 'bagger') {
            const baggerEarnings = calculateBaggerEarnings(record);
            return baggerEarnings;
          } else {
            return '';
          }
        },
      },
      {
        title: 'Final Hours',
        dataIndex: 'finalHours',
        key: 'finalHours',
        render: (_, record) => {
          if (record.payType === 'hourly' || record.payType === 'security') {
            const hourlyEarnings = calculateHourlyEarnings(record);
            const payRate = parseFloat(record.payRate);
            const finalHours = (hourlyEarnings / payRate).toFixed(2);
            return `${finalHours} (dec)`;
          } else {
            return 'null';
          }
        },
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <div className='flex space-x-2'>
            {record.status === 'editing' || record.status === 'pending'  && (
              <>
                <Button className='bg-blue-700' type="primary" onClick={() => approveTimesheet(record)}>Approve</Button>
                <Button className='bg-red-700 text-white' type="danger" onClick={() => denyTimesheet(record)}>Deny</Button>
              </>
            )}
            {record.status === 'denied' && (
              <>
                <Button className='bg-blue-700' type="primary" onClick={() => approveTimesheet(record)}>Approve</Button>
              </>
            )}
            {record.status === 'approved' && (
              <Button className='bg-green-700 text-white' onClick={() => {
                setSelectedRecord(record); // Save the selected record to state
                setModalVisible(true); // Open the modal
              }}>Generate Paystub</Button>
            )}
           {record.status === 'approved' && (
             <Button className='bg-green-700 text-white' onClick={() => {
                sendEmail(record)
              }}>Send Email</Button>
           )}
              </div>
        ),
      },
  ];

  // Convert time in the format "Xh Ym" to decimal hours
const convertTimeToDecimal = (time) => {
  
    const [hoursStr, minutesStr] = time.split(' ');
    const hours = parseInt(hoursStr.replace('h', ''), 10);
    const minutes = parseInt(minutesStr.replace('m', ''), 10);
    
  
    return (hours + minutes / 60).toFixed(2);
  };
  
  // Calculate total earnings for hourly payType
  const calculateHourlyEarnings = (record) => {
    const { payRate, totalTime, overtime1, overtime2 } = record;
  
    const totalDecimalHours = convertTimeToDecimal(totalTime);
    const overtime1DecimalHours = convertTimeToDecimal(overtime1);
    const overtime2DecimalHours = convertTimeToDecimal(overtime2);
  
    const regularEarnings = payRate * (totalDecimalHours - overtime1DecimalHours - overtime2DecimalHours);
    const overtime1Earnings = payRate * 1.5 * overtime1DecimalHours;
    const overtime2Earnings = payRate * 2 * overtime2DecimalHours;
  
    return (regularEarnings + overtime1Earnings + overtime2Earnings).toFixed(2);
  };
  
  
  

  // Calculate total earnings for weekly payType
  const calculateWeeklyEarnings = (record) => {
    const { payRate, worked } = record;
    return (worked ? payRate : 0).toFixed(2);
  };

  // Calculate total earnings for security payType
const calculateSecurityEarnings = (record) => {
    const { payRate, totalTime } = record;
    const totalDecimalHours = convertTimeToDecimal(totalTime);
    return (payRate * totalDecimalHours).toFixed(2);
  };
  

  // Calculate total earnings for bagger payType
  const calculateBaggerEarnings = (record) => {
    const { payRate, totalUnits } = record;
    return (payRate * totalUnits).toFixed(2);
  };

  // Add a new function to calculate total breaks for a record
const calculateTotalBreaks = (record) => {
  const { dates } = record;
  let totalBreaks = 0;

  // Loop through the dates and count breaks
  Object.values(dates).forEach((date) => {
    if (date.break) {
      totalBreaks += 1; // Each break is 30 minutes
    }
  });

  // Convert total breaks to "HH:mm" format
  const hours = Math.floor(totalBreaks / 2);
  const minutes = (totalBreaks % 2) * 30;
  return `${hours}h ${minutes}m`;
};



  return (
    <div>
      <Table dataSource={filteredTimesheets} columns={columns} />
      {/* Ant Design Modal */}
      <div>
        <Modal
          width={860}
          bodyStyle={{ height: 400, width: 820 }}
          title="Generate PayStub As Pdf"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)} // Close the modal when the user clicks outside of it
          footer={null} // No footer (remove this line if you want a footer with buttons)
        >
          {modalVisible && <PdfModal record={selectedRecord}/>}
        </Modal>
      </div>
    </div>
  );
}

export default PendingTable;
