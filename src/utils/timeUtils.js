import moment from 'moment';

export const calculateTotalHours = (start, end, _break) => {
    if (!start || !end) {
      return '0';
    }

    const startTime = moment(start, 'HH:mm');
    const endTime = moment(end, 'HH:mm');
    let duration = moment.duration(endTime.diff(startTime));
    if (_break) {
      duration = duration.subtract(_break, 'minutes');
    }
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();

    return `${hours}h ${minutes}m`;
};

//formatted time example: 8h 30m
export const formattedTimeAsMinutes = (formattedTime) => {

    if(!formattedTime) return 0;
    
    const timeParts = formattedTime.split(' ');
    const hourPart = timeParts[0].replace('h', '').trim();
    const minutePart = timeParts.length > 1 ? timeParts[1].replace('m', '').trim() : '0';

    const totalMins = (parseInt(hourPart) * 60) + parseInt(minutePart);
    return totalMins;
}

export const formatMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
};

export const handleTimeChange = (employees, datesArray, timesheetData, setTimesheetData, employeeIndex, date, time, timePart) => {

    const updatedTimesheetData = [...timesheetData];

    const formattedTime = time?.format('HH:mm');
    if(timePart === 'start'){
      updatedTimesheetData[employeeIndex].dates[date].start = formattedTime;
    }
    else if(timePart === 'end'){
      updatedTimesheetData[employeeIndex].dates[date].end = formattedTime;
    }

    const start = updatedTimesheetData[employeeIndex].dates[date].start;
    const end = updatedTimesheetData[employeeIndex].dates[date].end;
    const _break = updatedTimesheetData[employeeIndex].dates[date].break;

    const totalHours = calculateTotalHours(start, end, _break ? 30 : undefined);
    updatedTimesheetData[employeeIndex].dates[date].totalHours = totalHours;

    const totalMinutes = getTotalMins(datesArray, updatedTimesheetData, employeeIndex);
    
    const employeeType = employees[employeeIndex].payType;
    const overtime1Limit = employeeType === 'hourly' ? 10 * 60 : 0;//10 hours
    const regularWeekMins = 40 * 60;
    const overtime1 = Math.max(0, Math.min(totalMinutes - regularWeekMins, overtime1Limit));
    let overtime2;
    if (employeeType === 'hourly') {
      overtime2 = Math.max(0, totalMinutes - (50 * 60));
    } else {
      overtime2 = Math.max(0);
    }
    updatedTimesheetData[employeeIndex].totalTime = formatMinutes(totalMinutes);
    updatedTimesheetData[employeeIndex].overtime1 = formatMinutes(overtime1);
    updatedTimesheetData[employeeIndex].overtime2 = formatMinutes(overtime2);

    setTimesheetData(updatedTimesheetData);
  }

export const getDateRange = (selectedDateRange) => {
  const startDate = moment(selectedDateRange[0]?.$d);
  const endDate = moment(selectedDateRange[1]?.$d);
  const dates = [];

  let currentDate = startDate.clone();
  while (currentDate.isSameOrBefore(endDate)) {
    dates.push(currentDate.format('(ddd) YYYY-MM-DD'));
    currentDate.add(1, 'day');
  }
  return dates;
}

const getTotalMins = (datesArray, updatedTimesheetData, employeeIndex) => {

  const totalMinutes = datesArray.reduce(
    (acc, currentDate) => {
      const { totalHours } = updatedTimesheetData[employeeIndex].dates[currentDate];
      return acc + formattedTimeAsMinutes(totalHours);
    },
    0
  );

  return totalMinutes;
}