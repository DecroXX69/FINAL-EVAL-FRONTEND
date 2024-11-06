import React, { useState } from 'react';
import styles from './Settings.module.css';
import baba from '../images/baba.png';
import lock from '../images/lock.png';
import eye from '../images/eye.png';
import mail from '../images/mail.png';

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
        <div className={styles.settingsForm}>
          <img src={baba} alt="Pro Manage" className={styles.icon} />
          <input
            className={styles.settingsInput}
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.settingsForm}>
          <img src={mail} alt="Pro Manage" className={styles.icon} />
          <input
            className={styles.settingsInput}
            type="email"
            name="email"
            placeholder="Update Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className={styles.settingsForm}>
          <img src={lock} alt="Pro Manage" className={styles.icon} />
          <input
            className={styles.settingsInput}
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={formData.oldPassword}
            onChange={handleChange}
          />
          <img src={eye} alt="Show Password" className={styles.eyeIcon} />
        </div>
        <div className={styles.settingsForm}>
          <img src={lock} alt="Pro Manage" className={styles.icon} />
          <input
            className={styles.settingsInput}
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <img src={eye} alt="Show Password" className={styles.eyeIcon} />
        </div>
        <button className={styles.settingsButton} type="submit">Update</button>
      </form>
    </div>
  );
};

export default Settings;
