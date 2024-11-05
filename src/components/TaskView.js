import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TaskView = () => {
    const { taskId } = useParams(); 
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await fetch(`/api/task/view/${taskId}`);
                if (!response.ok) throw new Error('Task not found');
                const data = await response.json();
                console.log('Fetched task:', data); 
                setTask(data);
            } catch (error) {
                console.error('Error fetching task:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [taskId]);

    if (loading) return <p>Loading...</p>;

    if (!task) return <p>Task not found</p>; 

    return (
        <div>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>Assigned to: {task.assignedTo ? task.assignedTo.email : 'Unassigned'}</p>
            <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Status: {task.status}</p>
            <h4>Checklist:</h4>
            <ul>
                {task.checklist.map((item, idx) => (
                    <li key={idx}>{item.item}</li>
                ))}
            </ul>
        </div>
    );
};

export default TaskView;
