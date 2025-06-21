import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export const GlobalContext = React.createContext();

const AppContext = ({ children }) => {
  const [userCredentials, setUserCredentials] = React.useState({
    name:sessionStorage.getItem('name') || '',
    email: sessionStorage.getItem('email') || '',
  });
  const [darkMode, setDarkMode] = React.useState(sessionStorage.getItem('theme') === 'dark');
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [saleDetails, setSaleDetails] = useState(null);
  const [isLogin, setIsLogin] = useState(sessionStorage.getItem('token') ? true : false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      navigate('/layout/dashboard');
    }
    else {
      navigate('/');
    }

  }, [isLogin])

  return (
    <div>
      <GlobalContext.Provider value={{ userCredentials, setUserCredentials, darkMode, setDarkMode, selectedOption, setSelectedOption, showLogin, setShowLogin, showSignup, setShowSignup, saleDetails, setSaleDetails, isLogin, setIsLogin }}>
        {children}
      </GlobalContext.Provider>
    </div>
  )

}

export default AppContext
