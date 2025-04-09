// src/components/Modal.jsx
import React, { useEffect } from 'react';
import '../styles/components.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    }
    // Cleanup listener and body style on unmount or when modal closes
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Prevent clicks inside the modal from closing it
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;