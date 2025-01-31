import React, { useState } from 'react';
import axios from 'axios';

const ImportExport = ({ token }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/import', formData, {
        headers: { Authorization: token, 'Content-Type': 'multipart/form-data' }
      });
      alert('Импорт завершен');
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportCsv = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/export/csv', {
        headers: { Authorization: token },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'organizations.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/export/excel', {
        headers: { Authorization: token },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'organizations.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Импорт и экспорт данных</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleImport}>Загрузить данные</button>
      <button onClick={handleExportCsv}>Экспорт в CSV</button>
      <button onClick={handleExportExcel}>Экспорт в Excel</button>
    </div>
  );
};

export default ImportExport;