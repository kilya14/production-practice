import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OrganizationsList from './OrganizationsList';
import Login from './Login';
import Reports from './Reports';
import ImportExport from './ImportExport';

function App() {
  const [token, setToken] = useState('');

  const login = (tkn) => {
    setToken(tkn);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login login={login} />} />
        <Route path="/" element={<OrganizationsList token={token} />} />
        <Route path="/reports" element={<Reports token={token} />} />
        <Route path="/import-export" element={<ImportExport token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;