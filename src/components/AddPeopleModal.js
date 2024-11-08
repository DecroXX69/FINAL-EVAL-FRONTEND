
import React, { useState } from 'react';
import styles from './AddPeopleModal.module.css';

const AddPeopleModal = ({ isOpen, onClose, onAdd }) => {
  const [email, setEmail] = useState('');

  const handleAddClick = () => {
    if (email) {
      onAdd(email);
      setEmail(''); 
      onClose(); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h4>Add people to the board</h4>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.emailInput}
          required 
        />
        <div className={styles.buttonContainer}>
          <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
          <button onClick={handleAddClick} className={styles.addButton}>Add Email</button>
        </div>
      </div>
    </div>
  );
};

export default AddPeopleModal;
