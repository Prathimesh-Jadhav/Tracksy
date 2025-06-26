import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import { GlobalContext } from './context/AppContext'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

const Layout = () => {
    const {isLogin} = React.useContext(GlobalContext);

    const navigate = useNavigate();

    useEffect(()=>{
       if(!isLogin){
        toast.error("You are not logged in");
        navigate('/');
       }
    },[])



    return (
        <div className='flex dark:bg-black'>
            <Sidebar />
            <div className='flex-1 flex flex-col relative'> 
                <Navbar />
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
