
import React, { useState } from 'react';
import styles from './Settings.module.css';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    oldPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/auth/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update details');
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Failed to update details. Please try again.');
      console.error('Error updating details:', error);
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <h4>Settings</h4>
      {message && <p className={styles.settingsMessage}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label className={styles.settingsLabel}>
          Name:
          <input className={styles.settingsInput} type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label className={styles.settingsLabel}>
          Email:
          <input className={styles.settingsInput} type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label className={styles.settingsLabel}>
          Old Password:
          <input className={styles.settingsInput} type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} />
        </label>
        <label className={styles.settingsLabel}>
          New Password:
          <input className={styles.settingsInput} type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
        </label>
        <button className={styles.settingsButton} type="submit">Update</button>
      </form>
    </div>
  );
};

export default Settings;
