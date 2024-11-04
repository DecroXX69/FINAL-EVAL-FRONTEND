import React, { useState, useEffect } from 'react';
import styles from './Modal.module.css';
import DatePicker from './DatePicker'; 
import deleteimage from '../images/Delete.png';
import redimg from '../images/red.png';
import blueimg from '../images/blue.png';
import greenimg from '../images/green.png';

const Modal = ({ isOpen, onClose, task, onSubmit }) => { 
    const [checklists, setChecklists] = useState([]);
    const [completedChecklists, setCompletedChecklists] = useState([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [priority, setPriority] = useState(null); 

    useEffect(() => {
        if (isOpen) {
            if (task) {
                setChecklists(task.checklist || []);
                setCompletedChecklists(new Array(task.checklist.length).fill(false)); 
                setSelectedDate(task.dueDate ? new Date(task.dueDate) : null);
                setPriority(task.priority || null);
            } else {
                resetModal();
            }
        }
    }, [isOpen, task]); 

    const resetModal = () => {
        setChecklists([]);
        setCompletedChecklists([]);
        setSelectedDate(null);
        setPriority(null);
    };

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const title = formData.get('title');
        const assignedTo = formData.get('assignedTo');

        // Validation checks
        if (!title || !priority || checklists.length === 0 || checklists.every(item => item.item.trim() === '')) {
            alert('Please fill in the Title, select a Priority, and add at least one valid Checklist item.');
            return;
        }

        const formattedChecklist = checklists.map((checklist, index) => ({
            item: checklist.item, 
            completed: completedChecklists[index]
        }));
        
        const taskData = {
            title,
            priority: priority.text,
            assignedTo,
            checklist: formattedChecklist,
            dueDate: selectedDate ? selectedDate.toISOString() : null,
            status: task ? task.status : 'To Do',
        };

        try {
            const response = await fetch(
                task ? `http://localhost:5000/api/task/${task._id}` : 'http://localhost:5000/api/task',
                {
                    method: task ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                    body: JSON.stringify(taskData),
                }
            );

            if (!response.ok) throw new Error('Failed to save task');

            const savedTask = await response.json();
            onSubmit(savedTask); 
            onClose();
        } catch (error) {
            console.error('Error saving task:', error);
            alert('An error occurred while saving the task. Please try again.');
        }
    };

    const selectPriority = (level) => {
        setPriority(level);
    };

    const addChecklist = () => {
        setChecklists([...checklists, { item: '', completed: false }]); 
        setCompletedChecklists([...completedChecklists, false]); 
    };

    const handleChecklistChange = (index, value) => {
        const newChecklists = [...checklists];
        newChecklists[index].item = value; // Update item property
        setChecklists(newChecklists);
    };

    const toggleChecklistCompletion = (index) => {
        const newCompletedChecklists = [...completedChecklists];
        newCompletedChecklists[index] = !newCompletedChecklists[index];
        setCompletedChecklists(newCompletedChecklists);
    };

    const deleteChecklistItem = (index) => {
        const newChecklists = checklists.filter((_, i) => i !== index);
        const newCompletedChecklists = completedChecklists.filter((_, i) => i !== index);
        setChecklists(newChecklists);
        setCompletedChecklists(newCompletedChecklists);
    };

    const completedCount = completedChecklists.filter(completed => completed).length;

    const toggleCalendar = () => {
        setIsCalendarOpen((prevState) => !prevState);
    };

    const handleDateSelect = (date) => {
        if (date instanceof Date && !isNaN(date)) {
            setSelectedDate(date);
            setIsCalendarOpen(false);
        } else {
            console.error('Invalid date selected:', date);
        }
    };

    const clearDate = () => {
        setSelectedDate(null);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} style={{ height: '600px' }}>
                <form onSubmit={handleSubmit}>
                    <label className={styles.formLabelAbove}>Title <span className={styles.required}>*</span></label>
                    <input type="text" name="title" required className={styles.inputField} defaultValue={task?.title} placeholder="Enter Task Title" />

                    <label className={styles.formLabel}>
                        Select Priority <span className={styles.required}>*</span>
                        <div className={styles.priorityButtons}>
                            <button type="button" className={styles.priorityHigh} onClick={() => selectPriority({ text: 'High Priority', img: redimg })}>
                                <img src={redimg} alt="High Priority" />
                                High Priority
                            </button>
                            <button type="button" className={styles.priorityModerate} onClick={() => selectPriority({ text: 'Moderate Priority', img: blueimg })}>
                                <img src={blueimg} alt="Moderate Priority" />
                                Moderate Priority
                            </button>
                            <button type="button" className={styles.priorityLow} onClick={() => selectPriority({ text: 'Low Priority', img: greenimg })}>
                                <img src={greenimg} alt="Low Priority" />
                                Low Priority
                            </button>
                        </div>
                    </label>

                    <label className={styles.formLabelInline}>
                        Assign to
                        <input type="text" name="assignedTo" defaultValue={task?.assignedTo} placeholder="Add an assignee" className={styles.assignToInput} />
                    </label>

                    <label className={styles.formLabel}>
                        Checklist ({completedCount}/{checklists.length}) <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.checklistContainer}>
                        {checklists.map((checklist, index) => (
                            <div key={index} className={styles.checklistItem}>
                                <label className={styles.checklistInputWrapper}>
                                    <input
                                        type="checkbox"
                                        checked={completedChecklists[index]}
                                        onChange={() => toggleChecklistCompletion(index)}
                                        className={styles.checklistCheckbox}
                                    />
                                    <input
                                        type="text"
                                        value={checklist.item}
                                        onChange={(e) => handleChecklistChange(index, e.target.value)}
                                        className={styles.checklistInput}
                                        placeholder="Checklist Item"
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => deleteChecklistItem(index)}
                                    className={styles.deleteButton}
                                >
                                    <img src={deleteimage} alt="Delete" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button type="button" onClick={addChecklist} className={styles.addNewButton}>+ Add New</button>

                    <div style={{ marginBottom: '20px' }}></div>

                    <button type="button" onClick={toggleCalendar} className={styles.dueDateButton}>
                        {selectedDate ? selectedDate.toLocaleDateString() : 'Select Due Date'}
                    </button>

                    {isCalendarOpen && (
                        <div className={styles.calendarContainer}>
                            <DatePicker selectedDate={selectedDate} onSelect={handleDateSelect} clearDate={clearDate} />
                        </div>
                    )}

                    <div className={styles.bottomButtons}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
                        <button type="submit" className={styles.saveButton}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
