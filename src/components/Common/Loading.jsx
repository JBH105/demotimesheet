import React from 'react';

const Loading = ({ size, color }) => {
  // Calculate the spinner size class based on the provided size prop
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'h-4 w-4';
      case 'medium':
        return 'h-8 w-8';
      case 'large':
        return 'h-16 w-16';
      default:
        return 'h-8 w-8'; // Default to medium size
    }
  };

  return (
    <div className="flex items-center justify-center">
      {color == 'black' ? (
        <div
          className={`animate-spin rounded-full border-t-2 border-b-2 border-black ${getSizeClass()}`}
        />
      ) : (
        <div
          className={`animate-spin rounded-full border-t-2 border-b-2 border-white ${getSizeClass()}`}
        />
      )}
    </div>
  );
};

export default Loading;
