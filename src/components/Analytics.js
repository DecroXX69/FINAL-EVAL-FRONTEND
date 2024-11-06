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
      <h4 className={styles.analyticsHeading}>Analytics</h4>
      <div className={styles.analyticsTables}>
        <div className={styles.tableContainer}>
          <ul className={styles.taskList}>
            <li><span>Backlog</span> <span>{taskStats.backlog}</span></li>
            <li><span>To Do</span> <span>{taskStats.toDo}</span></li>
            <li><span>In Progress</span> <span>{taskStats.inProgress}</span></li>
            <li><span>Completed</span> <span>{taskStats.completed}</span></li>
          </ul>
        </div>
        <div className={styles.tableContainer}>
          <ul className={styles.taskList}>
            <li><span>High Priority</span> <span>{taskStats.highPriority}</span></li>
            <li><span>Medium Priority</span> <span>{taskStats.mediumPriority}</span></li>
            <li><span>Low Priority</span> <span>{taskStats.lowPriority}</span></li>
            <li><span>Due Tasks</span> <span>{taskStats.dueTasks}</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
