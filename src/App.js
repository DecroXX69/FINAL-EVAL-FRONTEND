import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import TaskView from './components/TaskView';

function App() {
  const [userName, setUserName] = useState('');
  const isAuthenticated = !!localStorage.getItem('authToken'); 

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      
      const decodedUserName = ""; 
      setUserName(decodedUserName);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthPage setUserName={setUserName} />} />
        
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard username={userName} /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/task/view/:taskId" element={<TaskView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
