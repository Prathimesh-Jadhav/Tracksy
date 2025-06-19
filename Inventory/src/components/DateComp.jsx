import React from 'react';

const DateComp = () => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return <p className='text-gray-800 text-sm border-2 dark:border-gray-600 rounded-full w-full text-center py-2 mt-4 dark:text-white'>{today}</p>;
};

export default DateComp;
