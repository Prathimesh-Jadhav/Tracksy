import React from 'react';

const LandingPageNav = ({ setShowLogin }) => {
  return (
    <div className='w-full h-14 border-b-2 px-16 flex justify-between items-center font-inter-tight max-md:px-6 text-black'>
      <div className='text-xl font-bold'>Tracksy</div>
      <div>
        <button
          className='relative z-10 py-1 px-5 rounded-full border-2 border-gray-500 overflow-hidden group'
          onClick={() => setShowLogin(true)}
        >
          <span className='absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-[-1]' />
          <span className='relative z-10 text-black group-hover:text-white transition-colors duration-300'>
            Login
          </span>
        </button>
      </div>
    </div>
  );
};

export default LandingPageNav;

