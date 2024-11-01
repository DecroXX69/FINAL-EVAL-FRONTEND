import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import leftImage from '../images/Group.png';

const AuthPage = ({ setUserName }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMessage('');
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = 'http://localhost:5000/api/auth';

    if (isLogin) {
      try {
        const response = await axios.post(`${apiUrl}/login`, {
          email: formData.email,
          password: formData.password,
        });

        const { token, name } = response.data;
        localStorage.setItem('authToken', token);
        setUserName(name);

        navigate('/dashboard');
      } catch (error) {
        setErrorMessage(error.response ? error.response.data.message : error.message);
      }
    } else {
      try {
        if (formData.password !== formData.confirmPassword) {
          setErrorMessage("Passwords do not match");
          return;
        }

        const response = await axios.post(`${apiUrl}/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        setIsLogin(true);
      } catch (error) {
        setErrorMessage(error.response ? error.response.data.message : error.message);
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authLeft}>
        <img src={leftImage} alt="image" className={styles.authImage} />
        <h1>Welcome aboard my friend</h1>
        <p>Just a couple of clicks and we start.</p>
      </div>
      <div className={styles.authRight}>
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <h2>{isLogin ? 'Login' : 'Register'}</h2>

          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className={styles.authInput}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={styles.authInput}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={styles.authInput}
            required
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.authInput}
              required
            />
          )}

          <button type="submit" className={styles.authButton}>
            {isLogin ? 'Login' : 'Register'}
          </button>

          <p className={styles.toggleText}>
            {isLogin ? 'Have no account yet?' : 'Already have an account?'}
            <span onClick={toggleForm} className={styles.toggleLink}>
              {isLogin ? ' Register' : ' Login'}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
