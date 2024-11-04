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
import pplimg from '../images/ppl.png';

const Dashboard = ({ username, users, setUsers }) => {
  const currentDate = new Date().toLocaleDateString('en-GB');
  const [selectedPage, setSelectedPage] = useState('Board');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAddPeopleModalOpen, setAddPeopleModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Retrieve the token
        console.log('Retrieved token:', token);
        const response = await fetch('http://localhost:5000/api/task', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });

        if (!response.ok) throw new Error('Failed to fetch tasks');

        const data = await response.json();
        console.log('Fetched tasks:', data);
        setTasks(data); // assume the API returns { tasks: [...] }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleModalSubmit = (taskData) => {
    setTasks((prevTasks) => (Array.isArray(prevTasks) ? [...prevTasks, taskData] : [taskData]));
    setModalOpen(false);
  };

  const handleAddUser = async (email) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/add-people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const data = await response.json();
      console.log('User added:', data);
      setUsers((prevUsers) => [...prevUsers, data.user.email]);
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

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === data._id ? data : task))
      );
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  // Filter tasks based on their statuses
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
        <button className={styles.sidebarButton} onClick={() => setSelectedPage('Analytics')}>
          <img src={image3} alt="Analytics" className={styles.sidebarIcon} />
          Analytics
        </button>
        <button className={styles.sidebarButton} onClick={() => setSelectedPage('Settings')}>
          <img src={image4} alt="Settings" className={styles.sidebarIcon} />
          Settings
        </button>
        <button className={styles.logoutButton}>Log Out</button>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.helloUser}>Hello, {username}</h3>
          <span className={styles.date}>{currentDate}</span>
        </div>
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
              <TaskBoard tasks={toDoTasks} onUpdateTask={handleUpdateTask} />
            </div>
          </div>
          <div className={styles.card}>
            <span className={styles.cardTitle}>In Progress</span>
            <button className={styles.topRightButton}>
              <img src={image2} alt="Collapse" />
            </button>
            <div className={styles.taskList}>
              <TaskBoard tasks={inProgressTasks} onUpdateTask={handleUpdateTask} />
            </div>
          </div>
          <div className={styles.card}>
            <span className={styles.cardTitle}>Done</span>
            <button className={styles.topRightButton}>
              <img src={image2} alt="Collapse" />
            </button>
            <div className={styles.taskList}>
              <TaskBoard tasks={doneTasks} onUpdateTask={handleUpdateTask} />
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Dashboard;
