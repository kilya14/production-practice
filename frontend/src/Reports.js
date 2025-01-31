import React, { useState } from 'react';
import axios from 'axios';

const Reports = ({ token }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);

  const generateReport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports/applications', {
        headers: { Authorization: token },
        params: { startDate, endDate }
      });
      setReportData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Отчеты</h1>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button onClick={generateReport}>Сгенерировать отчет</button>

      <h2>Отчет по количеству заявок</h2>
      <ul>
        {reportData.map(item => (
          <li key={item.Название}>
            {item.Название}: {item.Количество_заявок}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reports;