import React,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

function App() {
  const [userName, setUserName] = useState('');
  const isAuthenticated = !!userName; 

  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/" element={<AuthPage setUserName={setUserName} />} />

         
          {isAuthenticated && (
            <Route path="/dashboard" element={<Dashboard username={userName} />} />
          )}

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;  