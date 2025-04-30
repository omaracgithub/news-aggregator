'use client';

import React, { useEffect, useState } from 'react';
import { FiCheck, FiBell, FiAlertCircle } from 'react-icons/fi';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose 
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Start in hidden position
      setIsActive(false);
      
      // Force a browser reflow to ensure the initial hidden state is applied
      setTimeout(() => {
        // Then trigger slide-in animation
        setIsActive(true);
      }, 10);
      
      const timer = setTimeout(() => {
        // Start exit animation
        setIsExiting(true);
        
        // Wait for animation to complete before closing
        setTimeout(() => {
          onClose();
          // Reset states after closing
          setIsExiting(false);
          setIsActive(false);
        }, 400);
      }, 3000); // Stay visible for 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColors = {
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    error: 'bg-gradient-to-r from-red-500 to-rose-500',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-500'
  };

  // Get the appropriate icon
  const getIcon = () => {
    switch(type) {
      case 'success':
        return <FiCheck className="text-white" size={20} />;
      case 'error':
        return <FiAlertCircle className="text-white" size={20} />;
      case 'info':
      default:
        return <FiBell className="text-white" size={20} />;
    }
  };

  return (
    <div 
      className="fixed bottom-6 left-0 right-0 flex justify-center items-center z-50 pointer-events-none"
      style={{ perspective: '1000px' }}
    >
      <div 
        className={`${bgColors[type]} text-white py-3 px-5 rounded-xl shadow-2xl flex items-center space-x-3 max-w-md mx-auto`}
        style={{ 
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transform: isExiting 
            ? 'translateY(120px) scale(0.95)' 
            : isActive 
              ? 'translateY(0) scale(1)' 
              : 'translateY(120px) scale(0.95)',
          opacity: isExiting || !isActive ? 0 : 1,
          transformOrigin: 'center bottom',
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease-out',
          willChange: 'transform, opacity'
        }}
      >
        <div className="bg-white bg-opacity-30 p-2 rounded-full flex items-center justify-center">
          {getIcon()}
        </div>
        <p className="text-sm font-medium tracking-wide">{message}</p>
      </div>
    </div>
  );
};

export default Toast; 