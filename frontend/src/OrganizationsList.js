import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const OrganizationsList = ({ token }) => {
  const [organizations, setOrganizations] = useState([]);
  const [newOrg, setNewOrg] = useState({ Название: '', Адрес: '', Имя_руководителя: '', Номер_телефона: '', Дополнительная_информация: '' });
  const [editingOrg, setEditingOrg] = useState(null);
  const [applications, setApplications] = useState([]);
  const [newApplication, setNewApplication] = useState({ Организация_ID: '', Дата_заявки: '', Статус: 'в ожидании' });
  const [editingApplication, setEditingApplication] = useState(null);

  const fetchOrganizations = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/organizations', {
        headers: { Authorization: token }
      });
      setOrganizations(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const fetchApplications = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/applications', {
        headers: { Authorization: token }
      });
      setApplications(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    fetchOrganizations();
    fetchApplications();
  }, [fetchOrganizations, fetchApplications]);

  const handleAddOrganization = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/organizations', newOrg, {
        headers: { Authorization: token }
      });
      setOrganizations([...organizations, response.data]);
      setNewOrg({ Название: '', Адрес: '', Имя_руководителя: '', Номер_телефона: '', Дополнительная_информация: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditOrganization = (org) => {
    setEditingOrg(org);
    setNewOrg(org);
  };

  const handleUpdateOrganization = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/organizations/${editingOrg.ID}`, newOrg, {
        headers: { Authorization: token }
      });
      setOrganizations(organizations.map(org => org.ID === editingOrg.ID ? response.data : org));
      setEditingOrg(null);
      setNewOrg({ Название: '', Адрес: '', Имя_руководителя: '', Номер_телефона: '', Дополнительная_информация: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteOrganization = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/organizations/${id}`, {
        headers: { Authorization: token }
      });
      setOrganizations(organizations.filter(org => org.ID !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddApplication = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/applications', newApplication, {
        headers: { Authorization: token }
      });
      setApplications([...applications, response.data]);
      setNewApplication({ Организация_ID: '', Дата_заявки: '', Статус: 'в ожидании' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditApplication = (app) => {
    setEditingApplication(app);
    setNewApplication(app);
  };

  const handleUpdateApplication = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/applications/${editingApplication.ID}`, newApplication, {
        headers: { Authorization: token }
      });
      setApplications(applications.map(app => app.ID === editingApplication.ID ? response.data : app));
      setEditingApplication(null);
      setNewApplication({ Организация_ID: '', Дата_заявки: '', Статус: 'в ожидании' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/applications/${id}`, {
        headers: { Authorization: token }
      });
      setApplications(applications.filter(app => app.ID !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Список организаций</h1>
      <ul>
        {organizations.map(org => (
          <li key={org.ID}>
            {org.Название} - {org.Адрес}
            <button onClick={() => handleEditOrganization(org)}>Редактировать</button>
            <button onClick={() => handleDeleteOrganization(org.ID)}>Удалить</button>
          </li>
        ))}
      </ul>

      <h2>{editingOrg ? 'Редактировать организацию' : 'Добавить новую организацию'}</h2>
      <input
        type="text"
        placeholder="Название"
        value={newOrg.Название}
        onChange={(e) => setNewOrg({ ...newOrg, Название: e.target.value })}
      />
      <input
        type="text"
        placeholder="Адрес"
        value={newOrg.Адрес}
        onChange={(e) => setNewOrg({ ...newOrg, Адрес: e.target.value })}
      />
      <input
        type="text"
        placeholder="Имя руководителя"
        value={newOrg.Имя_руководителя}
        onChange={(e) => setNewOrg({ ...newOrg, Имя_руководителя: e.target.value })}
      />
      <input
        type="text"
        placeholder="Номер телефона"
        value={newOrg.Номер_телефона}
        onChange={(e) => setNewOrg({ ...newOrg, Номер_телефона: e.target.value })}
      />
      <textarea
        placeholder="Дополнительная информация"
        value={newOrg.Дополнительная_информация}
        onChange={(e) => setNewOrg({ ...newOrg, Дополнительная_информация: e.target.value })}
      />
      <button onClick={editingOrg ? handleUpdateOrganization : handleAddOrganization}>
        {editingOrg ? 'Сохранить изменения' : 'Добавить'}
      </button>

      <h1>Список заявок</h1>
      <ul>
        {applications.map(app => (
          <li key={app.ID}>
            {app.Организация_ID} - {app.Дата_заявки} - {app.Статус}
            <button onClick={() => handleEditApplication(app)}>Редактировать</button>
            <button onClick={() => handleDeleteApplication(app.ID)}>Удалить</button>
          </li>
        ))}
      </ul>

      <h2>{editingApplication ? 'Редактировать заявку' : 'Добавить новую заявку'}</h2>
      <select
        value={newApplication.Организация_ID}
        onChange={(e) => setNewApplication({ ...newApplication, Организация_ID: e.target.value })}
      >
        <option value="">Выберите организацию</option>
        {organizations.map(org => (
          <option key={org.ID} value={org.ID}>{org.Название}</option>
        ))}
      </select>
      <input
        type="date"
        value={newApplication.Дата_заявки}
        onChange={(e) => setNewApplication({ ...newApplication, Дата_заявки: e.target.value })}
      />
      <select
        value={newApplication.Статус}
        onChange={(e) => setNewApplication({ ...newApplication, Статус: e.target.value })}
      >
        <option value="в ожидании">В ожидании</option>
        <option value="обработана">Обработана</option>
        <option value="отклонена">Отклонена</option>
      </select>
      <button onClick={editingApplication ? handleUpdateApplication : handleAddApplication}>
        {editingApplication ? 'Сохранить изменения' : 'Добавить'}
      </button>
    </div>
  );
};

export default OrganizationsList;