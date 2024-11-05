import React from 'react';
import styles from './LogoutModal.module.css';

const LogoutModal = ({ onClose, onLogout }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        
        <p>Are you sure you want to log out?</p>
        <div className={styles.buttonContainer}>
          <button onClick={onLogout} className={styles.confirmButton}>Yes, Logout</button>
          <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
