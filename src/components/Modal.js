import React, { useState, useEffect } from 'react';
import styles from './Modal.module.css';
import DatePicker from './DatePicker'; // Ensure to import the DatePicker component
import deleteimage from '../images/Delete.png';
import redimg from '../images/red.png';
import blueimg from '../images/blue.png';
import greenimg from '../images/green.png';

const Modal = ({ isOpen, onClose, task, onSubmit }) => { // Accept task as a prop
    const [checklists, setChecklists] = useState([]);
    const [completedChecklists, setCompletedChecklists] = useState([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [priority, setPriority] = useState(null); // New state for priority

    useEffect(() => {
        if (isOpen) {
            if (task) { // Populate fields if editing an existing task
                setChecklists(task.checklist || []);
                setCompletedChecklists(new Array(task.checklist.length).fill(false)); // Adjust completed checklist based on existing task
                setSelectedDate(task.dueDate ? new Date(task.dueDate) : null);
                setPriority(task.priority || null);
            } else {
                // Reset state for creating a new task
                setChecklists([]);
                setCompletedChecklists([]);
                setSelectedDate(null);
                setPriority(null);
            }
        }
    }, [isOpen, task]); // Add task as a dependency

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const title = formData.get('title');
        const assignedTo = formData.get('assignedTo');
    
        if (!title || !priority || checklists.length === 0 || !checklists.some(item => item)) {
            alert('Please fill in the Title, select a Priority, and add at least one Checklist item.'); // Alert user for missing fields
            return; // Prevent form submission
        }
    
        const taskData = {
            title: title,
            priority: priority,
            assignedTo: assignedTo,
            checklist: checklists.filter(item => item),
            completedChecklistCount: completedChecklists.filter(completed => completed).length,
            dueDate: selectedDate ? selectedDate.toISOString() : null,
        };
        onSubmit(taskData);
    };

    const selectPriority = (level) => {
        setPriority(level);
    };

    const addChecklist = () => {
        setChecklists([...checklists, '']);
        setCompletedChecklists([...completedChecklists, false]);
    };

    const handleChecklistChange = (index, value) => {
        const newChecklists = [...checklists];
        newChecklists[index] = value;
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
            // Close calendar when a date is selected
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
                                        value={checklist}
                                        onChange={(e) => handleChecklistChange(index, e.target.value)}
                                        className={styles.checklistInput}
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