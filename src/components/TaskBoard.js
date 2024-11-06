import React, { useState } from 'react';
import styles from './Task.module.css';
import dotimg from '../images/dots.png';
import Modal from './Modal';

const TaskBoard = ({ tasks = [], onUpdateTask, onDeleteTask }) => {
    const [activePopupIndex, setActivePopupIndex] = useState(null);
    const [expandedChecklistIndex, setExpandedChecklistIndex] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    const handlePopupToggle = (index) => {
        setActivePopupIndex(activePopupIndex === index ? null : index);
    };

    const handleExpandChecklist = (index) => {
        setExpandedChecklistIndex(expandedChecklistIndex === index ? null : index);
    };

    const handleEditClick = (task) => {
        setCurrentTask(task);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setCurrentTask(null);
    };

    const handleTaskUpdate = (updatedTask) => {
        onUpdateTask(updatedTask);
        setModalOpen(false);
    };

    // Function to handle status change
    const handleStatusChange = (taskId, newStatus) => {
        const updatedTask = tasks.find(task => task._id === taskId);
        if (updatedTask) {
            updatedTask.status = newStatus; // Update the status
            onUpdateTask(updatedTask); // Trigger the update function
        }
    };

    // Function to handle task deletion
    const handleDeleteTask = (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            onDeleteTask(taskId); // Call the prop function to delete the task
        }
    };

    const handleShareTask = (taskId) => {
        const shareableLink = `${window.location.origin}/task/view/${taskId}`;
        navigator.clipboard.writeText(shareableLink)
            .then(() => alert('Link copied to clipboard!'))
            .catch(err => console.error('Failed to copy the link: ', err));
    };

    const handleChecklistToggle = async (taskId, itemIndex) => {
        const task = tasks.find(task => task._id === taskId);
        if (task) {
            const updatedStatus = !task.checklist[itemIndex].completed;

            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:5000/api/task/${taskId}/checklist/${itemIndex}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ completed: updatedStatus }),
                });
                
                if (!response.ok) throw new Error('Failed to update checklist');

                const updatedTask = await response.json();
                onUpdateTask(updatedTask); // Refresh task in the front end
            } catch (error) {
                console.error('Error updating checklist item:', error);
            }
        }
    };

    // Function to format the due date
    const formatDueDate = (dueDate) => {
        const date = new Date(dueDate);
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options); // e.g., "Feb 10"
    };

    return (
        <div className={styles.taskBoard}>
            {tasks.map((task, index) => {
                const completedCount = task.checklist.filter(item => item.completed).length; // Moved outside of JSX

                return (
                    <div key={task._id || index} className={styles.taskCard}>
                        <div className={styles.taskHeader}>
                            {task.priority && (
                                <div className={styles.taskPriority}>
                                    <span className={styles.priorityText}>{task.priority}</span>
                                </div>
                            )}
                            <span className={styles.taskAssignee}>
                                {task.assignedTo ? task.assignedTo.email || task.assignedTo.name : 'Unassigned'}
                            </span>
                            <div className={styles.taskOptions}>
                                <button className={styles.dotButton} onClick={() => handlePopupToggle(index)}>
                                    <img src={dotimg} alt="Options" />
                                </button>
                                {activePopupIndex === index && (
                                    <div className={styles.popupMenu}>
                                        <button onClick={() => handleEditClick(task)}>Edit</button>
                                        <button onClick={() => handleShareTask(task._id)}>Share</button>
                                        <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.taskBody}>
                            <h4 className={styles.taskTitle} title={task.title}>
                                {task.title.length > 25 ? `${task.title.slice(0, 25)}...` : task.title}
                            </h4>
                            <div className={styles.checklistProgress}>
                                Checklist ({completedCount}/{task.checklist.length}) {/* Corrected to show completed count */}
                            </div>
                            <button 
                                className={styles.expandChecklistButton} 
                                onClick={() => handleExpandChecklist(index)}
                            >
                                ▼
                            </button>
                            {expandedChecklistIndex === index && (
                                <div className={styles.checklistItems}>
                                    {task.checklist.map((item, idx) => (
                                        <div key={idx} className={styles.checklistItem}>
                                            <input
                                                type="checkbox"
                                                checked={item.completed}
                                                onChange={() => handleChecklistToggle(task._id, idx)}
                                            /> 
                                            {item.item}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={styles.taskFooter}>
                            <span className={styles.dueDate}>
                                {task.dueDate ? formatDueDate(task.dueDate) : 'No due date'}
                            </span>
                            <div className={styles.statusButtons}>
                                {/* Conditionally render buttons based on task status */}
                                {task.status === 'Backlog' && (
                                    <>
                                        <button onClick={() => handleStatusChange(task._id, 'In Progress')}>Progress</button>
                                        <button onClick={() => handleStatusChange(task._id, 'To Do')}>To Do</button>
                                        <button onClick={() => handleStatusChange(task._id, 'Done')}>Done</button>
                                    </>
                                )}
                                {task.status === 'In Progress' && (
                                    <>
                                        <button onClick={() => handleStatusChange(task._id, 'Backlog')}>Backlog</button>
                                        <button onClick={() => handleStatusChange(task._id, 'To Do')}>To Do</button>
                                        <button onClick={() => handleStatusChange(task._id, 'Done')}>Done</button>
                                    </>
                                )}
                                {task.status === 'To Do' && (
                                    <>
                                        <button onClick={() => handleStatusChange(task._id, 'Backlog')}>Backlog</button>
                                        <button onClick={() => handleStatusChange(task._id, 'In Progress')}>Progress</button>
                                        <button onClick={() => handleStatusChange(task._id, 'Done')}>Done</button>
                                    </>
                                )}
                                {task.status === 'Done' && (
                                    <>
                                        <button onClick={() => handleStatusChange(task._id, 'Backlog')}>Backlog</button>
                                        <button onClick={() => handleStatusChange(task._id, 'To Do')}>To Do</button>
                                        <button onClick={() => handleStatusChange(task._id, 'In Progress')}>Progress</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
            {modalOpen && (
                <Modal 
                    isOpen={modalOpen}
                    task={currentTask} 
                    onClose={handleModalClose} 
                    onSubmit={handleTaskUpdate}  
                />
            )}
        </div>
    );
};

export default TaskBoard;
