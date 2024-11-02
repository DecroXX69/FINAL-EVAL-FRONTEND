import React from 'react';
import styles from './DatePicker.module.css';

const DatePicker = ({ onSelect, clearDate }) => {
    const [date, setDate] = React.useState(new Date());
    const [yearDropdownOpen, setYearDropdownOpen] = React.useState(false);
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; 

    const selectToday = () => {
        const today = new Date();
        setDate(today);
        onSelect(today);
    };

    const adjustMonth = (direction) => {
        const newDate = new Date(date.getFullYear(), date.getMonth() + direction, 1);
        setDate(newDate);
    };

    const adjustYear = (newYear) => {
        const newDate = new Date(newYear, date.getMonth(), 1);
        setDate(newDate);
        setYearDropdownOpen(false); 
    };

    const toggleYearDropdown = () => {
        setYearDropdownOpen(!yearDropdownOpen);
    };

    return (
        <div className={styles.datePicker}>
            <div className={styles.calendarHeader}>
                <div className={styles.monthYearContainer}>
                    <span>
                        {months[date.getMonth()]}, 
                        <button className={styles.yearButton} onClick={toggleYearDropdown}>
                            {date.getFullYear()} ▼
                        </button>
                    </span>
                    <div className={styles.arrowButtons}>
                        <button onClick={() => adjustMonth(-1)}>▲</button>
                        <button onClick={() => adjustMonth(1)}>▼</button>
                    </div>
                </div>
                {yearDropdownOpen && (
                    <div className={styles.yearDropdown}>
                        {Array.from({ length: 100 }, (_, i) => date.getFullYear() - 50 + i).map(year => ( 
                            <button key={year} onClick={() => adjustYear(year)}>
                                {year}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.weekDays}>
                {daysOfWeek.map(day => (
                    <div key={day} className={styles.dayHeader}>
                        {day}
                    </div>
                ))}
            </div>
            <div className={styles.dateGrid}>
                {Array.from({ length: 31 }, (_, i) => (
                    <button 
                        key={i} 
                        onClick={() => onSelect(new Date(date.getFullYear(), date.getMonth(), i + 1))}
                        disabled={i + 1 > new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()} 
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <div className={styles.dateActions}>
                <button onClick={(e) => { e.preventDefault(); clearDate(); }}>Clear</button>
                <button onClick={(e) => { e.preventDefault(); selectToday(); }}>Today</button>
            </div>
        </div>
    );
};

export default DatePicker;