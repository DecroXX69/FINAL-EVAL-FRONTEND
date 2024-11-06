import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import image1 from '../images/addTask.png';
import image2 from '../images/collapse.png';
import image3 from '../images/database.png';
import image4 from '../images/settings.png';
import image5 from '../images/layout.png';
import image6 from '../images/codesandbox.png';
import Modal from './Modal';
import TaskBoard from './TaskBoard';
import AddPeopleModal from './AddPeopleModal';
import LogoutModal from './LogoutModal'; // Import the LogoutModal
import pplimg from '../images/ppl.png';
import Analytics from './Analytics';
import { jwtDecode } from 'jwt-decode'; // Imported jwtDecode correctly
import Settings from './Setting';
import image7 from '../images/Logout.png';

const Dashboard = ({ username, users, setUsers }) => {
  const currentDate = new Date().toLocaleDateString('en-GB');
  const [selectedPage, setSelectedPage] = useState(localStorage.getItem('selectedPage') || 'Board');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAddPeopleModalOpen, setAddPeopleModalOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false); // State for logout modal
  const [tasks, setTasks] = useState([]);
  
  // Retrieve username from token on initial load
  const [displayedUsername, setDisplayedUsername] = useState(localStorage.getItem('username') || username);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/task', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch tasks');

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Persist selectedPage and username
  useEffect(() => {
    localStorage.setItem('selectedPage', selectedPage);
    localStorage.setItem('username', displayedUsername);
  }, [selectedPage, displayedUsername]);

  // Decode the token to get user information
  const getUserInfoFromToken = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken; // Adjust based on the structure of your token payload
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && !displayedUsername) {
      const userInfo = getUserInfoFromToken(token);
      if (userInfo && userInfo.username) {
        setDisplayedUsername(userInfo.username);
      }
    }
  }, [displayedUsername]);

  const handleModalSubmit = (taskData) => {
    setTasks((prevTasks) => (Array.isArray(prevTasks) ? [...prevTasks, taskData] : [taskData]));
    setModalOpen(false);
  };

  const handleAddUser = async (email) => {
    const token = localStorage.getItem('authToken');
    const userInfo = getUserInfoFromToken(token); // Decode token to get user info
    const addedBy = userInfo?.userId; // Ensure userId is retrieved from the decoded token

    try {
      const response = await fetch('http://localhost:5000/api/auth/add-people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, addedBy }),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const data = await response.json();
      console.log('User added:', data);
      setUsers((prevUsers) => [...prevUsers, data.user.addedByEmail || data.user.email]);
    } catch (error) {
      console.log('Error adding user:', error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/task/${updatedTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const data = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === data._id ? data : task))
      );
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/task/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete task');

      // Filter out the deleted task from the tasks state
      setTasks((prevTasks) => prevTasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token from local storage
    window.location.href = '/login'; // Redirect to login page
  };

  const handleOpenLogoutModal = () => {
    setLogoutModalOpen(true); // Open the logout modal
  };

  const backlogTasks = tasks.filter(task => task.status === 'Backlog');
  const toDoTasks = tasks.filter(task => task.status === 'To Do');
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
  const doneTasks = tasks.filter(task => task.status === 'Done');

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <img src={image6} alt="Pro Manage" className={styles.logo} />
          <h4 className={styles.proManageText}>Pro Manage</h4>
        </div>
        <button
          className={`${styles.sidebarButton} ${selectedPage === 'Board' ? styles.active : ''}`}
          onClick={() => setSelectedPage('Board')}
        >
          <img src={image5} alt="Board" className={styles.sidebarIcon} />
          Board
        </button>
        <button
          className={`${styles.sidebarButton} ${selectedPage === 'Analytics' ? styles.active : ''}`}
          onClick={() => setSelectedPage('Analytics')}
        >
          <img src={image3} alt="Analytics" className={styles.sidebarIcon} />
          Analytics
        </button>
        <button
          className={`${styles.sidebarButton} ${selectedPage === 'Settings' ? styles.active : ''}`}
          onClick={() => setSelectedPage('Settings')}
        >
          <img src={image4} alt="Settings" className={styles.sidebarIcon} />
          Settings
        </button>
        <button className={styles.logoutButton} onClick={handleOpenLogoutModal}>
  <img src={image7} alt="Logout Icon" className={styles.logoutIcon} />
  Log Out
</button>

      </div>
      <div className={styles.content}>
  {selectedPage === 'Board' && (
    <div className={styles.header}>
      <h3 className={styles.helloUser}>Hello, {displayedUsername}</h3>
      <span className={styles.date}>{currentDate}</span>
    </div>
  )}

  {selectedPage === 'Board' && (
    <>
      <div className={styles.boardHeader}>
        <h3 className={styles.boardTitle}>Board</h3>
        <img src={pplimg} alt="group" className={styles.pplIcon} />
        <button
          className={styles.addPeopleButton}
          onClick={() => setAddPeopleModalOpen(true)}
        >
          Add People
        </button>
      </div>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <span className={styles.cardTitle}>Backlog</span>
          <button className={styles.topRightButton}>
            <img src={image2} alt="Collapse" />
          </button>
          <div className={styles.taskList}>
            <TaskBoard tasks={backlogTasks} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />
          </div>
        </div>
        <div className={styles.card}>
          <span className={styles.cardTitle}>To Do</span>
          <div className={styles.toDoButtonsContainer}>
            <button className={styles.addTaskButton} onClick={() => setModalOpen(true)}>
              <img src={image1} alt="Add Task" />
            </button>
            <button className={styles.collapseButton}>
              <img src={image2} alt="Collapse" />
            </button>
          </div>
          <div className={styles.taskList}>
            <TaskBoard tasks={toDoTasks} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />
          </div>
        </div>
        <div className={styles.card}>
          <span className={styles.cardTitle}>In Progress</span>
          <button className={styles.topRightButton}>
            <img src={image2} alt="Collapse" />
          </button>
          <div className={styles.taskList}>
            <TaskBoard tasks={inProgressTasks} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />
          </div>
        </div>
        <div className={styles.card}>
          <span className={styles.cardTitle}>Done</span>
          <button className={styles.topRightButton}>
            <img src={image2} alt="Collapse" />
          </button>
          <div className={styles.taskList}>
            <TaskBoard tasks={doneTasks} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />
          </div>
        </div>
      </div>
    </>
  )}

  {selectedPage === 'Analytics' && <Analytics />}
  {selectedPage === 'Settings' && <Settings />}

        <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        users={users}
        onSubmit={handleModalSubmit}
      />

        <AddPeopleModal
        isOpen={isAddPeopleModalOpen}
        onClose={() => setAddPeopleModalOpen(false)}
        onAdd={handleAddUser}
      />
        {isLogoutModalOpen && (
          <LogoutModal onClose={() => setLogoutModalOpen(false)} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
