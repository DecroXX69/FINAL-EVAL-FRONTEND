import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Analytics.module.css';

const Analytics = () => {
  const [taskStats, setTaskStats] = useState({
    backlog: 0,
    toDo: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    dueTasks: 0,
  });

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/api/task/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTaskStats(response.data);
      } catch (error) {
        console.error('Failed to fetch task stats:', error);
      }
    };

    fetchTaskStats();
  }, []);

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.analyticsTable}>
        <h3>Task Status</h3>
        <table>
          <tbody>
            <tr>
              <td>Backlog</td>
              <td>{taskStats.backlog}</td>
            </tr>
            <tr>
              <td>To Do</td>
              <td>{taskStats.toDo}</td>
            </tr>
            <tr>
              <td>In Progress</td>
              <td>{taskStats.inProgress}</td>
            </tr>
            <tr>
              <td>Completed</td>
              <td>{taskStats.completed}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.analyticsTable}>
        <h3>Priority and Due Tasks</h3>
        <table>
          <tbody>
            <tr>
              <td>High Priority</td>
              <td>{taskStats.highPriority}</td>
            </tr>
            <tr>
              <td>Medium Priority</td>
              <td>{taskStats.mediumPriority}</td>
            </tr>
            <tr>
              <td>Low Priority</td>
              <td>{taskStats.lowPriority}</td>
            </tr>
            <tr>
              <td>Due Tasks</td>
              <td>{taskStats.dueTasks}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
