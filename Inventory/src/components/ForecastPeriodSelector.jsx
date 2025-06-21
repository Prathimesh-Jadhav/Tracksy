import React, { useState } from 'react';

const ForecastPeriodSelector = ({ onChange }) => {
  const [selected, setSelected] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    onChange?.(value); // call parent function if passed
  };

  return (
    <div className="w-full max-w-xs">
      <select
        value={selected}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>Select period</option>
        <option value="next-week">Next Week</option>
        <option value="next-month">Next 30 Days</option>
      </select>
    </div>
  );
};

export default ForecastPeriodSelector;
