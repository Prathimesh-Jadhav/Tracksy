import React from 'react'
import supplier from '../assets/inventory-32.png'
import DateComp from './DateComp'
import { navOptions } from '../data/LandComments'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import profile1 from '../assets/profile1.jpg'
import { AiOutlineLogout } from "react-icons/ai";
import { GlobalContext } from '../context/AppContext'

const Sidebar = () => {

  const { selectedOption, setIsLogin,userCredentials } = React.useContext(GlobalContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLogin(false);
    sessionStorage.clear();
  }

  return (
    <div className="min-w-[270px] min-h-screen bg-white dark:bg-black dark:text-white border-r-2 dark:border-gray-800 flex flex-col items-center px-5 py-1 max-md:hidden">
      {/* Logo and Title  */}
      <div className='flex items-center justify-start w-full gap-2'>
        <div className='bg-gradient-to-br from-violet-700 to-blue-600 rounded-full'><img src={supplier} alt="" className='w-10 h-10 rounded-full border-2' /></div>
        <div className='flex flex-col items-start justify-center p-1 mb-2'>
          <h1 className='text-md font-bold mt-2 text-gray-800 dark:text-white'>Tracksy</h1>
          <p className='text-gray-500 text-xs'>A Shopkeeper's Platform.</p>
        </div>
      </div>

      {/* Date Component */}
      <DateComp />

      {/* Navigation Options */}
      <div className='flex flex-col items-start justify-start w-full mt-5'>
        {
          navOptions.map((option) => {
            const Icon = option.icon
            return (
              <Link
                key={option.id}
                to={`/layout/${option.link}`}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium ${selectedOption == `${option.link}` && 'bg-gray-100 dark:bg-gray-700 dark:text-white'}`}
              >
                <div>
                  <Icon className='text-xl text-gray-700 dark:text-white' />
                </div>
                <span className={`text-md text-gray-700 dark:text-white `}>{option.name}</span>
              </Link>
            )
          })
        }
      </div>

      {/* Footer */}
      <div className='flex items-center justify-start gap-2 mt-auto mb-3 w-full'>
        <div className='w-9 h-9 rounded-full border overflow-hidden'> <img src={profile1} alt="" /></div>
        <div className='flex items-center justify-center gap-3'>
          <div className='flex flex-col items-start justify-center max-w-[150px]'>
            <div className='text-sm text-gray-700 font-medium dark:text-white'>{userCredentials?.name}</div>
            <div className='text-xs text-gray-500 break-all'>{userCredentials?.email}</div>
          </div>
          <div className='bg-gray-100  hover:cursor-pointer hover:bg-gray-200 rounded-full p-[4px] dark:text-black' onClick={handleLogout}>
            <AiOutlineLogout size={20} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
