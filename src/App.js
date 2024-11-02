import React,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

function App() {
  const [userName, setUserName] = useState('');
  const isAuthenticated = !!userName; // Replace with actual authentication check logic, e.g., from context or state

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route to AuthPage as the default login/register page */}
          <Route path="/" element={<AuthPage setUserName={setUserName} />} />

          {/* Protected route for Dashboard */}
          {isAuthenticated && (
            <Route path="/dashboard" element={<Dashboard username={userName} />} />
          )}

          {/* Add additional routes for other pages here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;  