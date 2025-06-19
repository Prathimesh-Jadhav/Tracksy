import React from 'react'
import Profile1 from '../assets/profile1.jpg'
import DarkModeToggle from './DarkModeToggle'
import supplier from '../assets/inventory-32.png'
import { IoMenu } from "react-icons/io5";
import Menubar from './Menubar'

const Navbar = () => {

  const [openMenu, setOpenMenu] = React.useState(false);

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  }  

  return (
    <div className='w-full h-14 border-b-2 px-7 max-md:px-4 flex justify-between items-center font-inter-tight dark:text-white dark:border-gray-800 sticky top-0  z-50 bg-white dark:bg-black'>
      <div className='flex items-center gap-2'>
        <div className='bg-gradient-to-br from-violet-700 to-blue-600 rounded-full md:hidden'><img src={supplier} alt="" className='w-8 h-8 rounded-full border-2' /></div>
        <div className='text-xl font-bold'>Tracksy</div>
      </div>
      <div className='flex items-center gap-4'>
        <div className='max-md:hidden'>
        <DarkModeToggle />
        </div>
        <div className='w-8 h-8 bg-gray-200 rounded-full overflow-hidden hover:cursor-pointer max-md:hidden'> <img src={Profile1} alt="" /></div>
        <div onClick={handleOpenMenu} className='dark:text-white text-gray-800'>
        <IoMenu className='text-3xl md:hidden hover:cursor-pointer' />
        </div>
        <Menubar openMenu={openMenu} setOpenMenu={setOpenMenu} />
      </div>
    </div>
  )
}

export default Navbar
