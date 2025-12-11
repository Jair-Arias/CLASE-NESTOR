import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Cargando...', fullScreen = false }) => {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <div className={`${sizes[size]} border-4 border-green-600 border-t-transparent rounded-full animate-spin`}></div>
        {text && <p className="mt-4 text-white text-lg">{text}</p>}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizes[size]} border-4 border-green-600 border-t-transparent rounded-full animate-spin`}></div>
      {text && <p className="mt-2 text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;