import React, { useState } from 'react';
import styles from './Task.module.css';
import dotimg from '../images/dots.png';
import Modal from './Modal'; // Assuming your modal component is named TaskModal

const TaskBoard = ({ tasks, onUpdateTask }) => {
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
        setCurrentTask(task); // Set the current task to be edited
        setModalOpen(true); // Open the modal
    };

    const handleModalClose = () => {
        setModalOpen(false); // Close the modal
        setCurrentTask(null); // Reset current task
    };

    const handleTaskUpdate = (updatedTask) => {
        onUpdateTask(updatedTask); // Call the function to update the task
        handleModalClose(); // Close the modal after updating
    };

    return (
        <div className={styles.taskBoard}>
            {tasks.map((task, index) => (
                <div key={task.id || index} className={styles.taskCard}>
                    <div className={styles.taskHeader}>
                        {task.priority && (
                            <div className={styles.taskPriority}>
                                <img src={task.priority.img} alt={task.priority.text} className={styles.priorityImage} />
                                <span className={styles.priorityText}>{task.priority.text}</span>
                            </div>
                        )}
                        <span className={styles.taskAssignee}>{task.assignedTo}</span>
                        <div className={styles.taskOptions}>
                            <button className={styles.dotButton} onClick={() => handlePopupToggle(index)}>
                                <img src={dotimg} alt="Options" />
                            </button>
                            {activePopupIndex === index && (
                                <div className={styles.popupMenu}>
                                    <button onClick={() => handleEditClick(task)}>Edit</button>
                                    <button>Share</button>
                                    <button>Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.taskBody}>
                        <h4 
                            className={styles.taskTitle} 
                            title={task.title} 
                        >
                            {task.title.length > 25 ? `${task.title.slice(0, 25)}...` : task.title}
                        </h4>
                        <div className={styles.checklistProgress}>
                            Checklist ({task.completedChecklistCount}/{task.checklist.length})
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
                                        <input type="checkbox" /> {item}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={styles.taskFooter}>
                        <span className={styles.dueDate}>
                            {task.dueDate 
                                ? new Date(task.dueDate).toLocaleDateString()
                                : ''}
                        </span>
                        <div className={styles.statusButtons}>
                            <button>Backlog</button>
                            <button>Progress</button>
                            <button>Done</button>
                        </div>
                    </div>
                </div>
            ))}
            {modalOpen && (
                <Modal 
                    task={currentTask} // Pass the current task to the modal
                    onClose={handleModalClose} // Function to close the modal
                    onUpdate={handleTaskUpdate} // Function to handle task update
                />
            )}
        </div>
    );
};

export default TaskBoard;  