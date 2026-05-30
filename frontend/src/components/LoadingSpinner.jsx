import React from 'react';

const LoadingSpinner = ({ size = 'medium', fullPage = false }) => {
  const sizeClass = size === 'small' ? 'spinner-sm' : size === 'large' ? 'spinner-lg' : 'spinner-md';
  
  const spinnerElement = (
    <div className={`spinner-container ${sizeClass}`}>
      <div className="spinner-ring"></div>
      <style>{`
        .spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .spinner-ring {
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--color-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .spinner-sm .spinner-ring {
          width: 24px;
          height: 24px;
          border-width: 2.5px;
        }
        .spinner-md .spinner-ring {
          width: 40px;
          height: 40px;
        }
        .spinner-lg .spinner-ring {
          width: 60px;
          height: 60px;
          border-width: 4px;
        }
        .full-page-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--bg-primary);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
      `}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div className="full-page-overlay">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

export default LoadingSpinner;
