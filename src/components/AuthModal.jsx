import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose, canSkip = true }) => {
  const { currentUser } = useAuth();
  
  // Determine if modal can be closed
  // If canSkip is false, only allow closing if user is authenticated
  const allowClose = canSkip || !!currentUser;
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Close on escape key only if allowed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && allowClose) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, allowClose]);
  
  // Close when clicking outside of modal content only if allowed
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && allowClose) {
      onClose();
    }
  };
  
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <Login onClose={allowClose ? onClose : null} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AuthModal; 