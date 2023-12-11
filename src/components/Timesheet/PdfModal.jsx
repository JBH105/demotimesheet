import React, { useEffect, useState } from "react";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  Image,
  Font,
} from "@react-pdf/renderer";
import DMSans from "../../assets/DMSans_18pt-SemiBold.ttf";
import moment from "moment";

const currentDate = new Date();
const year = currentDate.getFullYear(); // Get the current year (e.g., 2023)
const month = currentDate.getMonth() + 1; // Get the current month (Note: Month is zero-based, so January is 0, February is 1, etc.)
const day = currentDate.getDate();
Font.register({
  family: "DMSans",
  src: DMSans,
  fontStyle: "normal",
  fontWeight: "700",
});
const styles = {
  page: {
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: "auto",
    fontWeight: "bold",
  },
  image: {
    width: "90px",
    marginLeft: "auto",
    marginRight: "30px",
  },
  viewer: {
    width: "100%",
    height: "100vh",
    border: "none",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginHorizontal: 0,
    marginTop: 3,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCell: {
    marginTop: 1,
    fontSize: 10,
    color: "#333333",
  },
  tableHead: {
    backgroundColor: "#373737",
    color: "#fff",
    padding: "30px 60px 30px 25px",
    fontSize: "30px",
    height: "auto",
    fontWeight: "700",
  },
  paynet: {
    padding: "0px",
    margin: "0px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    borderLeft: "22px solid #373737",
    marginTop: "-1px",
    paddingTop: "20px",
  },
  userData: {
    padding: "0px",
    margin: "0px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    borderLeft: "22px solid #373737",
    marginTop: "-1px",
    paddingTop: "6px",
  },
  payPeriod: {
    padding: "0px",
    margin: "0px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    borderLeft: "22px solid #373737",
    marginTop: "-1px",
    paddingTop: "8px",
  },
  earningData: {
    padding: "0px",
    margin: "0px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    borderLeft: "22px solid #373737",
    borderRight: "16px solid #7030a0",
    marginTop: "-1px",
    paddingTop: "4px",
    color: "#fff",
    alignItems: "center",
  },
};

const formatDateRange = (period) => {
  const startDate = period.substring(0, 10);
  const endDate = period.substring(11, 21);
  const startMoment = moment(startDate);
  const endMoment = moment(endDate);

  const startFormat = startMoment.format("MMM Do YYYY");
  const endFormat = endMoment.format("MMM Do YYYY");

  return `${startFormat.toUpperCase()} - ${endFormat.toUpperCase()}`;
};

const calculateTotalTime = (overtimes) => {
  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(" ");
    return { hours: parseInt(hours), minutes: parseInt(minutes) };
  };

  const parseAndAddTimes = (times) => {
    const totalDuration = times.reduce((acc, time) => {
      const parsedTime = parseTime(time);
      return acc.add(
        moment.duration({
          hours: parsedTime.hours,
          minutes: parsedTime.minutes,
        })
      );
    }, moment.duration());

    return totalDuration;
  };

  // Filter out undefined or null values before summing
  const validOvertimes = overtimes.filter((time) => time);
  const totalDuration = parseAndAddTimes(validOvertimes);
  const totalFormat = `${Math.floor(
    totalDuration.asHours()
  )}h ${totalDuration.minutes()}m`;

  return totalFormat;
};

const calculateTotalAmount = (totalTime, rate) => {
  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(" ");
    return { hours: parseInt(hours), minutes: parseInt(minutes) };
  };

  const parsedTime = parseTime(totalTime);
  const totalDuration = moment.duration({
    hours: parsedTime.hours,
    minutes: parsedTime.minutes,
  });
  const totalHours = parsedTime.hours + "." + parsedTime.minutes;
  // const totalHours = totalDuration.asHours();
  const totalAmount = totalHours * rate;
  return totalAmount.toFixed(2);
};

const PdfDocument = ({ record, earnings }) => (
  <>
    <Document title={`${record.name}'s TimeSheet`}>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            padding: "0px",
            margin: "0px",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            fontWeight: "bold",
          }}
        >
          <Text style={styles.tableHead}>CONTRACTOR</Text>
          <View style={{ padding: "0px" }}>
            <Image style={styles.image} src="/logo.png" />
          </View>
        </View>
        <View style={styles.paynet}>
          <Text
            style={{
              color: "#7030a0",
              fontSize: "18px",
              paddingLeft: "30px",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            CONTRACTOR NAME
          </Text>
          <Text style={{ color: "#000", fontSize: "18px", width: "200px" }}>
            NET PAY
          </Text>
        </View>
        <View style={styles.userData}>
          <Text
            style={{
              ...styles.boldText,
              color: "#000",
              fontSize: "20px",
              paddingLeft: "30px",
            }}
          >
            {record.name}
          </Text>
          <Text
            style={{
              color: "#7030a0",
              fontSize: "20px",
              // fontWeight: "extrabold",
              width: "200px",
              fontFamily: "DMSans",
              // fontWeight: "500",
            }}
          >
            ${earnings}
          </Text>
        </View>
        <View style={styles.userData}>
          <Text
            style={{ color: "#2d2d2d", fontSize: "12px", paddingLeft: "30px" }}
          >
            PAY RATE : ${record.payRate}
          </Text>
          <Text style={{ color: "#2d2d2d", fontSize: "12px", width: "200px" }}>
            PAY STUB NUMBER:
          </Text>
        </View>
        <View style={styles.userData}>
          <Text
            style={{ color: "#2d2d2d", fontSize: "11px", paddingLeft: "30px" }}
          ></Text>
          <Text
            style={{
              color: "#7030a0",
              fontSize: "11px",
              width: "200px",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            {record.paystubnumber}
          </Text>
        </View>
        <View style={styles.payPeriod}>
          <Text
            style={{ color: "#2d2d2d", fontSize: "11px", paddingLeft: "30px" }}
          >
            DEVNET ENTERPRISES
          </Text>
          <Text style={{ color: "#2d2d2d", fontSize: "11px", width: "200px" }}>
            PERIOD:
          </Text>
        </View>
        <View style={styles.userData}>
          <Text
            style={{ color: "#2d2d2d", fontSize: "11px", paddingLeft: "30px" }}
          >
            2914 4th Street
          </Text>
          <Text
            style={{
              color: "#7030a0",
              fontSize: "11px",
              // fontWeight: "extrabold",
              width: "200px",
              paddingTop: "2px",
              fontFamily: "DMSans",
              // fontWeight: "500",
            }}
          >
            {formatDateRange(record.period)}
          </Text>
        </View>
        <View style={styles.payPeriod}>
          <Text
            style={{ color: "#2d2d2d", fontSize: "11px", paddingLeft: "30px" }}
          >
            Atlanta, GA 3333
          </Text>
          <Text
            style={{
              color: "#2d2d2d",
              fontSize: "11px",
              width: "200px",
              paddingTop: "2px",
            }}
          >
            DATE:
          </Text>
        </View>
        <View style={styles.userData}>
          <Text
            style={{ color: "#2d2d2d", fontSize: "11px", paddingLeft: "30px" }}
          >
            (111) 291 8477
          </Text>
          <Text
            style={{
              color: "#7030a0",
              fontSize: "11px",
              // fontWeight: "extrabold",
              width: "200px",
              paddingTop: "2px",
              fontFamily: "DMSans",
              // fontWeight: "500",
            }}
          >
            {record.date}
          </Text>
        </View>
        <View style={styles.userData}>
          <Text
            style={{
              color: "#3b84ce",
              fontSize: "11px",
              paddingLeft: "30px",
              textDecoration: "underline",
            }}
          >
            {/* {record.email} */}
            admin@devnet.org
          </Text>
        </View>
        <View style={styles.userData}>
          <Text style={{ paddingLeft: "30px" }}></Text>
          <Text
            style={{
              backgroundColor: "#7030a0",
              fontSize: "11px",
              width: "200px",
              height: "20px",
            }}
          ></Text>
        </View>
        <View style={{ ...styles.userData, paddingTop: "0" }}>
          <Text
            style={{
              borderRight: "16px solid #7030a0",
              height: "20px",
              width: "100%",
            }}
          ></Text>
        </View>
        <View style={styles.earningData}>
          <Text
            style={{
              color: "#fff",
              fontSize: "11px",
              width: "50%",
              marginLeft: "30px",
              backgroundColor: "#373737",
              minWidth: "200px",
              padding: "4px 8px",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            EARNINGS
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: "11px",
              // fontWeight: "extrabold",
              backgroundColor: "#373737",
              width: "100%",
              padding: "4px 8px",
              marginLeft: "-1px",
              minWidth: "100px",
              textAlign: "center",
              fontFamily: "DMSans",
              // fontWeight: "500",
            }}
          >
            QTY/HRS
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: "11px",
              backgroundColor: "#373737",
              width: "100%",
              padding: "4px 8px",
              marginLeft: "-1px",
              textAlign: "center",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            RATE
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: "11px",
              // fontWeight: "extrabold",
              backgroundColor: "#373737",
              width: "70px",
              marginRight: "20px",
              padding: "4px 8px",
              marginLeft: "-1px",
              minWidth: "70px",
              fontFamily: "DMSans",
              // fontWeight: "500",
            }}
          >
            AMOUNT
          </Text>
        </View>
        <View style={{ ...styles.earningData, paddingTop: "20px" }}>
          <Text
            style={{
              color: "#000",
              fontSize: "13px",
              marginLeft: "30px",
              minWidth: "200px",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            Total Hours
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: "10px",
              width: "100%",
              minWidth: "100px",
              textAlign: "center",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            {calculateTotalTime([
              record.totalTime,
              record.overtime1,
              record.overtime2,
            ])}
          </Text>
          <Text
            style={{ color: "#000", fontSize: "10px", width: "100%" }}
          ></Text>
          <Text
            style={{
              color: "#000",
              fontSize: "10px",
              marginRight: "20px",
              minWidth: "70px",
              width: "70px",
              textAlign: "center",
            }}
          ></Text>
        </View>
        <View style={styles.earningData}>
          <Text
            style={{
              color: "#000",
              fontSize: "13px",
              marginLeft: "30px",
              minWidth: "200px",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            Regular Hours
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: "10px",
              width: "100%",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            {record.totalTime}
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: "10px",
              width: "100%",
              textAlign: "center",
            }}
          >
            ${record.payRate}
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: "10px",
              marginRight: "20px",
              minWidth: "70px",
              width: "70px",
              textAlign: "center",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            ${calculateTotalAmount(record.totalTime, record.payRate)}
          </Text>
        </View>
        <View style={styles.earningData}>
          <Text
            style={{
              color: "#000",
              fontSize: "13px",
              marginLeft: "30px",
              minWidth: "200px",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            Hours Overtime 40
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: "10px",
              width: "100%",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            {record.overtime1}
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: "10px",
              width: "100%",
              textAlign: "center",
            }}
          >
            ${record.payRate / 2 + record.payRate}
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: "10px",
              marginRight: "20px",
              minWidth: "70px",
              width: "70px",
              textAlign: "center",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            $
            {calculateTotalAmount(
              record.overtime1,
              record.payRate / 2 + record.payRate
            )}
          </Text>
        </View>
        <View style={styles.earningData}>
          <Text
            style={{
              color: "#000",
              fontSize: "13px",
              marginLeft: "30px",
              minWidth: "200px",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            Hours Overtime 50
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: "10px",
              width: "100%",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            {record.overtime2}
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: "10px",
              width: "100%",
              textAlign: "center",
            }}
          >
            ${record.payRate * 2}
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: "10px",
              marginRight: "20px",
              minWidth: "70px",
              width: "70px",
              textAlign: "center",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            ${calculateTotalAmount(record.overtime2, record.payRate * 2)}
          </Text>
        </View>
        <View style={styles.earningData}>
          <Text
            style={{
              color: "#000",
              fontSize: "13px",
              marginLeft: "30px",
              minWidth: "200px",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            Total Hours : Overtime
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: "10px",
              width: "100%",
              minWidth: "100px",
              textAlign: "center",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            {calculateTotalTime([record.overtime1, record.overtime2])}
          </Text>
          <Text
            style={{ color: "#000", fontSize: "10px", width: "100%" }}
          ></Text>
          <Text
            style={{
              color: "#000",
              fontSize: "10px",
              marginRight: "20px",
              minWidth: "70px",
              width: "70px",
              textAlign: "center",
            }}
          ></Text>
        </View>
        <View style={{ ...styles.earningData, paddingTop: "24px" }}>
          <Text
            style={{
              color: "#fff",
              fontSize: "10px",
              marginLeft: "30px",
              minWidth: "150px",
              backgroundColor: "#7030a0",
              padding: "4px 8px",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            TOTAL EARNINGS
          </Text>
          <Text
            style={{
              ...styles.after,
              color: "#000",
              fontSize: "10px",
              paddingBottom: "4px",
              marginRight: "20px",
              width: "50%",
              paddingLeft: "220px",
              borderBottom: "1px solid #7030a0",
              fontFamily: "DMSans",
              fontWeight: "500",
            }}
          >
            ${earnings}
          </Text>
        </View>
        <View style={{ ...styles.userData, paddingTop: "0" }}>
          <Text
            style={{
              borderRight: "16px solid #7030a0",
              height: "20px",
              width: "100%",
            }}
          ></Text>
        </View>
        <View
          style={{ ...styles.userData, marginTop: "-1px", paddingTop: "0" }}
        >
          <Text style={{ paddingLeft: "30px" }}></Text>
          <Text
            style={{
              backgroundColor: "#7030a0",
              fontSize: "11px",
              width: "314px",
              height: "20px",
            }}
          ></Text>
        </View>
      </Page>
    </Document>
  </>
);

const PdfModal = ({ record, onClose, payStubNumber }) => {
  // Convert time in the format "Xh Ym" to decimal hours
  const convertTimeToDecimal = (time) => {
    const [hoursStr, minutesStr] = time.split(" ");
    const hours = parseInt(hoursStr.replace("h", ""), 10);
    const minutes = parseInt(minutesStr.replace("m", ""), 10);

    return hours + minutes / 60;
  };
  // Calculate total earnings for hourly payType
  const calculateHourlyEarnings = (record) => {
    const { payRate, totalTime, overtime1, overtime2 } = record;

    const totalDecimalHours = convertTimeToDecimal(totalTime).toFixed(2);
    const overtime1DecimalHours = convertTimeToDecimal(overtime1).toFixed(2);
    const overtime2DecimalHours = convertTimeToDecimal(overtime2).toFixed(2);

    const regularEarnings =
      payRate *
      (totalDecimalHours - overtime1DecimalHours - overtime2DecimalHours);
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
  if (record.payType === "hourly") {
    earnings = calculateHourlyEarnings(record);
  } else if (record.payType === "weekly") {
    earnings = calculateWeeklyEarnings(record);
  } else if (record.payType === "security") {
    earnings = calculateSecurityEarnings(record);
  } else if (record.payType === "bagger") {
    earnings = calculateBaggerEarnings(record);
  } else {
    earnings = "";
  }

  return (
    <div style={{ height: "100%" }}>
      {/* PDFViewer wrapping the PdfDocument */}
      <PDFViewer width="100%" height="100%">
        {/* Pass the required props to the PdfDocument component */}
        <PdfDocument record={record} earnings={earnings} />
      </PDFViewer>

      {/* Close button */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default PdfModal;
