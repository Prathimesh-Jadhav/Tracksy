import React from 'react'
import supplier from '../assets/inventory-32.png'
import { Link } from 'react-router-dom'
import { navOptions } from '../data/LandComments'
import profile1 from '../assets/profile1.jpg'
import { AiOutlineLogout } from "react-icons/ai";
import { GlobalContext } from '../context/AppContext'

const Menubar = ({ openMenu, setOpenMenu }) => {

  const { setIsLogin,userCredentials } = React.useContext(GlobalContext);

  const handleLogout = () => {
    setIsLogin(false);
    sessionStorage.clear();
  }

  return (
    <div className={`flex flex-col min-h-screen dark:border-gray-600 bg-gray-100 dark:bg-gray-800 max-w-[280px] min-w-[280px] fixed right-0 top-0 shadow-md z-50 bottom-0 ${openMenu ? 'translate-x-0' : 'translate-x-full'} transition-all duration-500 ease-in-out border-2 rounded-l-lg md:hidden py-6 px-3`}>
      {/* Logo and Title  */}
      <div className='flex items-center justify-start w-full gap-2 px-2 border-b-2 dark:border-gray-600 relative'>
        <div className='bg-gradient-to-br from-violet-700 to-blue-600 rounded-full'><img src={supplier} alt="" className='w-10 h-10 rounded-full border-2' /></div>
        <div className='flex flex-col items-start justify-center p-1 mb-2'>
          <h1 className='text-md font-bold mt-2 text-gray-800 dark:text-white'>Tracksy</h1>
          <p className='text-gray-500 text-xs'>A Shopkeeper's Platform.</p>
        </div>
        <div className='absolute right-2 top-6 cursor-pointer' onClick={() => setOpenMenu(!openMenu)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-black bg-gray-200 p-1 rounded-full hover:bg-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      {/* Navigation Options */}
      <div className='flex flex-col items-start justify-start w-full mt-5 px-2'>
        {
          navOptions.map((option) => {
            const Icon = option.icon
            return (
              <Link
                key={option.id}
                to={`/layout/${option.link}`}
                className='flex items-center gap-2 w-full px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium'
                onClick={() => setOpenMenu(!openMenu)}
              >
                <div>
                  <Icon className='text-xl text-gray-700 dark:text-white' />
                </div>
                <span className='text-md text-gray-700 dark:text-white'>{option.name}</span>
              </Link>
            )
          })
        }
      </div>

      {/* Footer */}
      <div className='flex items-center justify-start gap-2 mt-auto  w-full px-2'>
        <div className='min-w-9 min-h-9 max-w-9 max-h-9 rounded-full border-2 overflow-hidden'> <img src={profile1} alt="" /></div>
        <div className='flex flex-col items-start justify-center'>
          <div className='text-sm text-gray-700 font-medium dark:text-white'>{userCredentials?.name}</div>
          <div className='text-xs text-gray-500 break-all'>{userCredentials?.email}</div>
        </div>
        <div className='hover:cursor-pointer hover:bg-gray-200 rounded-full p-[4px] ml-3 bg-gray-200 dark:text-black' onClick={handleLogout}>
          <AiOutlineLogout size={20} />
        </div>
      </div>


    </div>
  )
}

export default Menubar
