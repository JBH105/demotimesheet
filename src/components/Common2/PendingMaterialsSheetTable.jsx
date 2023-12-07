import React from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { toTitleCase } from '../../utils/textUtils'

function PendingMaterialsSheetTable({ filteredTimesheets, material, category }) {

  // Extract and sort date keys using Moment.js
  const dateKeys = Object.keys(filteredTimesheets[0]?.dates || []).sort((date1, date2) => {
    const date1Moment = moment(date1, 'ddd YYYY-MM-DD');
    const date2Moment = moment(date2, 'ddd YYYY-MM-DD');

    return date1Moment.isBefore(date2Moment) ? -1 : date1Moment.isAfter(date2Moment) ? 1 : 0;
  });

  // Define columns for the table dynamically based on sorted dates
  const columns = [
    { title: toTitleCase(material), dataIndex: material.toLowerCase(), key: material.toLowerCase() },
    ...dateKeys.map((date) => ({
      title: date,
      dataIndex: date,
      key: date,
      render: (text) => (text?.units ? text?.units : '0'), // Display units or '0' if units are not available
    })),
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  // Prepare data for the table
  const data = filteredTimesheets.map((timesheet) => ({
    [material.toLowerCase()]: timesheet[material.toLowerCase()],
    ...timesheet.dates,
    total: timesheet.total,
  }));

  // Calculate the running total of all totals in the timesheet data
  const totalSum = data.reduce((sum, item) => sum + (item.total || 0), 0);


  return (
    <div>
        <h1 className='text-center font-bold my-4'>{category} Total For The Week <span className='text-blue-700'>{totalSum}</span></h1>
      <Table dataSource={[...data]} columns={columns} />
    </div>
  );
}

export default PendingMaterialsSheetTable;
