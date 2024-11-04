import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

function App() {
  const [userName, setUserName] = useState('');
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check for token in localStorage

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Optionally, you can decode the token to get the username
      // Here you can use a library like jwt-decode if your token contains the username
      const decodedUserName = ""; // Decode token to extract username if applicable
      setUserName(decodedUserName);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthPage setUserName={setUserName} />} />
          {/* Redirect to dashboard if authenticated */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard username={userName} /> : <Navigate to="/" />}
          />
          {/* Optional: Add a catch-all for other routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
