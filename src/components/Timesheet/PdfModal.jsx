import React from 'react';
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  Image,
} from '@react-pdf/renderer';
import moment from 'moment';

const currentDate = new Date();
const year = currentDate.getFullYear(); // Get the current year (e.g., 2023)
const month = currentDate.getMonth() + 1; // Get the current month (Note: Month is zero-based, so January is 0, February is 1, etc.)
const day = currentDate.getDate();

const styles = {
  page: {
    backgroundColor: 'white',
    padding: 12,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 'auto',
  },
  image: {
    width: 100,
    height: 60,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  viewer: {
    width: '100%',
    height: '100vh',
    border: 'none',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginHorizontal: 0,
    marginTop: 3,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCell: {
    marginTop: 1,
    fontSize: 10,
    color: '#333333',
  },
};

const PdfDocument = ({ record,earnings }) => (
  <Document title={`${record.name}'s TimeSheet`}>
    <Page size="A4" style={styles.page}>
      <View
        style={{
          padding: '0px',
          margin: '0px',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <View style={{}}>
          <Image style={styles.image} src="/logo.png" />
        </View>
        <View style={{ padding: '0px', flexDirection: 'column' }}></View>
      </View>

      <View
        style={{
          padding: '0px',
          marginTop: '10px',
          paddingBottom: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          borderStyle: 'solid',
          borderBottomWidth: 1,
          borderColor: 'gray',
        }}
      >
        <View style={{ padding: '0px', flexDirection: 'column' }}>
          <Text style={{ fontSize: '12px' }}>{import.meta.env.VITE_NAME} Enterprises Inc</Text>
        </View>
        <View style={{ padding: '0px', flexDirection: 'column' }}>
          <Text style={{ fontSize: '12px' }}>
            Date: {`${year}/${month}/${day}`}
          </Text>
        </View>
      </View>

      <View
        style={{
          padding: '0px',
          marginTop: '10px',
          paddingBottom: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          borderStyle: 'solid',
          borderBottomWidth: '1px',
          borderColor: 'gray',
        }}
      >
        <View style={{ padding: '0px', flexDirection: 'column' }}>
          <Text style={{ fontSize: '12px' }}>Pay Amount Text</Text>
        </View>
        <View style={{ padding: '0px', flexDirection: 'column' }}>
          <Text style={{ fontSize: '12px' }}>$0.00</Text>
          <Text style={{ fontSize: '11px', color: 'gray' }}>
            This is not a check
          </Text>
        </View>
      </View>

      <View
        style={{
          padding: '0px',
          marginTop: '10px',
          paddingBottom: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <View style={{ padding: '0px', flexDirection: 'column' }}>
          <Text style={{ fontSize: '12px', color: 'gray' }}>
            Pay to the order of
          </Text>
        </View>
      </View>

      {/*table*/}
      <Text
        style={{
          ...styles.tableCell,
          marginLeft: '0',
          marginTop: '10px',
          color: 'black',
        }}
      >
        Employee Information
      </Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: '20%' }}>
            <Text style={styles.tableCell}>Name</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
          <View
            style={{ ...styles.tableCol, width: '40%', borderRightWidth: 1 }}
          >
            <Text style={styles.tableCell}>Employee ID / SIN</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
         
          <View
            style={{ ...styles.tableCol, width: '40%', borderRightWidth: 1 }}
          >
            <Text style={styles.tableCell}>Work Week</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
        </View>

        {/*row*/}
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: '20%' }}>
            <Text style={styles.tableCell}>{record.name}</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
          <View style={{ ...styles.tableCol, width: '40%' }}>
            <Text style={styles.tableCell}>{record.sin}</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
          <View style={{ ...styles.tableCol, width: '40%' }}>
            <Text style={styles.tableCell}>
              {moment(record?.start).format('(ddd) MMM Do YYYY')} {' '}
              
            </Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
        </View>
      </View>

     

      <View style={{...styles.table,marginTop:"20px"}}>
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: '25%' }}>
            {
                record.payType != "weekly" &&
                <>
                <Text style={styles.tableCell}>Hours Worked</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
            </>
            }

              {
                record.payType == "weekly" &&
                <>
                <Text style={styles.tableCell}>Worked</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
            </>
            }
            
          </View>
          <View style={{ ...styles.tableCol, width: '25%' }}>
            <Text style={styles.tableCell}>Rate</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
          <View
            style={{ ...styles.tableCol, width: '25%', borderRightWidth: 1 }}
          >
            <Text style={styles.tableCell}>Earnings</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
          {/* <View
            style={{ ...styles.tableCol, width: '20%', borderRightWidth: 1 }}
          >
            <Text style={styles.tableCell}>Deductions</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
          <View
            style={{ ...styles.tableCol, width: '20%', borderRightWidth: 1 }}
          >
            <Text style={styles.tableCell}>Bonus</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>*/}
          <View
            style={{ ...styles.tableCol, width: '25%', borderRightWidth: 1 }}
          >
            <Text style={styles.tableCell}>Total Hours (with overtime)</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
        </View>

        {/*row*/}
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: '25%' }}>
            <Text style={styles.tableCell}>
              {record.payType == 'weekly' ? <>{record.worked? "Yes":"No"}</> :<>{record.totalTime} </>}
            </Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
          <View style={{ ...styles.tableCol, width: '25%' }}>
            <Text style={styles.tableCell}>${record.payRate}</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
          <View style={{ ...styles.tableCol, width: '25%' }}>
            <Text style={styles.tableCell}>
            
                ${earnings}
            
            </Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}>
                
            </Text>
          </View>
          {/*
          <View style={{ ...styles.tableCol, width: '20%' }}>
            <Text style={styles.tableCell}>{record.deductions}</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
          <View style={{ ...styles.tableCol, width: '20%' }}>
            <Text style={styles.tableCell}>{record.additions}</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
          */}
          <View style={{ ...styles.tableCol, width: '25%' }}>
            <Text style={styles.tableCell}>{(earnings / record?.payRate).toFixed(2)}</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}></Text>
          </View>
        </View>

        {/*row*/}
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: '50%' }}>
            <Text style={styles.tableCell}>Net Earnings</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}>
            ${earnings}
            </Text>
          </View>

          <View style={{ ...styles.tableCol, width: '50%' }}>
            <Text style={styles.tableCell}>Gross Earnings</Text>
            <Text style={{ ...styles.tableCell, color: 'black' }}>
            ${earnings}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const PdfModal = ({ record, onClose }) => {
  


  // Convert time in the format "Xh Ym" to decimal hours
const convertTimeToDecimal = (time) => {
    const [hoursStr, minutesStr] = time.split(' ');
    const hours = parseInt(hoursStr.replace('h', ''), 10);
    const minutes = parseInt(minutesStr.replace('m', ''), 10);
  
    return hours + minutes / 60;
  };
  // Calculate total earnings for hourly payType
  const calculateHourlyEarnings = (record) => {
    const { payRate, totalTime, overtime1, overtime2 } = record;
  
    const totalDecimalHours = convertTimeToDecimal(totalTime).toFixed(2);
    const overtime1DecimalHours = convertTimeToDecimal(overtime1).toFixed(2);
    const overtime2DecimalHours = convertTimeToDecimal(overtime2).toFixed(2);
  
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
    const totalDecimalHours = convertTimeToDecimal(totalTime).toFixed(2);
    return (payRate * totalDecimalHours).toFixed(2);
  };
  

  // Calculate total earnings for bagger payType
  const calculateBaggerEarnings = (record) => {
    const { payRate, totalUnits } = record;
    return (payRate * totalUnits).toFixed(2);
  };

  let earnings;
  if (record.payType === 'hourly') {
    earnings = calculateHourlyEarnings(record);
  } else if (record.payType === 'weekly') {
    earnings = calculateWeeklyEarnings(record);
  } else if (record.payType === 'security') {
    earnings = calculateSecurityEarnings(record);
  } else if (record.payType === 'bagger') {
    earnings = calculateBaggerEarnings(record);
  } else {
    earnings = ''
  }
  

  return (
    <div style={{ height: '100%' }}>
      {/* PDFViewer wrapping the PdfDocument */}
      <PDFViewer width="100%" height="100%">
        {/* Pass the required props to the PdfDocument component */}
        <PdfDocument record={record} earnings={earnings}/>
      </PDFViewer>

      {/* Close button */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default PdfModal;