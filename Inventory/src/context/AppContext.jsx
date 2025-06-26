import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export const GlobalContext = React.createContext();

const AppContext = ({ children }) => {
  const [userCredentials, setUserCredentials] = React.useState({
    name: sessionStorage.getItem('name') || '',
    email: sessionStorage.getItem('email') || '',
  });
  const [darkMode, setDarkMode] = React.useState(sessionStorage.getItem('theme') === 'dark');
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [saleDetails, setSaleDetails] = useState(null);
  const [isLogin, setIsLogin] = useState(sessionStorage.getItem('token') ? true : false);
  const [purchaseList, setPurchaseList] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('next-week');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      navigate('/layout/dashboard');
    }
    else {
      navigate('/');
    }

  }, [isLogin])

  useEffect(() => {
    if(isLogin == false) return;
    setTimeout(async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/salesForecast/${selectedPeriod}`,
          { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
        );
        setPurchaseList(response.data.results || []);
        if (response.data.message) {
          toast.success(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          console.error('Error fetching products:', error.response.data.message);
          toast.error(error.response.data.message);
        }
        console.error('Error fetching products:', error);
      }
    }, 100);
  }, [selectedPeriod,isLogin]);

  return (
    <div>
      <GlobalContext.Provider value={{ userCredentials, setUserCredentials, darkMode, setDarkMode, selectedOption, setSelectedOption, showLogin, setShowLogin, showSignup, setShowSignup, saleDetails, setSaleDetails, isLogin, setIsLogin,selectedPeriod, setSelectedPeriod,purchaseList,setPurchaseList,loading,setLoading }}>
        {children}
      </GlobalContext.Provider>
    </div>
  )

}

export default AppContext
