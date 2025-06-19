import React, { useEffect } from 'react'
import { Link, useRevalidator } from 'react-router-dom'
import { MdCancel } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';
import { GlobalContext } from '../context/AppContext';
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { toast } from 'react-toastify';
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Firebase/Config';
import axios from 'axios'

const Login = ({ showLogin, setShowLogin, setShowSignup }) => {

    const { setUserCredentials, isLogin, setIsLogin } = React.useContext(GlobalContext);
    const [showForgotPassword, setShowForgotPassword] = React.useState(false);

    // Added: state for form input
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const token = await user.getIdToken();

            const userData = {
                name: user.displayName,
                email: user.email,
                googleLogin: true,
                isVerified: true
            }

            if(userData == null) return toast.error("No Data");

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/userRoutes/googleLogin`, userData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log("response", response);
            if (sessionStorage.getItem('token') && sessionStorage.getItem('userId')) { return toast.error("User already logged in") };
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('userId', response.data.userId);
            setUserCredentials({
                name:userData.name,
                email:userData.email
            })
            sessionStorage.setItem('name', userData.name);
            sessionStorage.setItem('email', userData.email);
            console.log("user", response.data);
            toast.success("Login successful");
            setIsLogin(true);
            setShowLogin(false);

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            }
            else {
                console.error("Login failed:", error);
                toast.error("Login failed");
            }
        }
    };

    const handleEmailOpen = () => {
        setShowForgotPassword(prev => !prev);
    }

    const submitUsersEmailForForgotPassword = (e) => {
        console.log("Submitting email for forgot password");
        const element = e.target.closest('.forgot-password');
        const email = element.querySelector('input[type="email"]').value;
        console.log("Email submitted for forgot password:", email);
        setShowForgotPassword(false);
        setShowLogin(false);
    }

    // Added: input change handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Added: form submit handler
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const user = {
            email: formData.email,
            password: formData.password
        };
        console.log("Sending to backend:", user);
        // Here you'd send `user` to your backend
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/userRoutes/login`, user, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log("response", response);
            if (sessionStorage.getItem('token') && sessionStorage.getItem('userId')) return toast.error("User already logged in");
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('userId', response.data.userId);
            sessionStorage.setItem('name', response.data.name);
            sessionStorage.setItem('email', response.data.email);
            toast.success("Login successful");
            setFormData({ email: '', password: ''});
            setIsLogin(true);
            setShowLogin(false);
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            }
            else {
                console.error("Login failed:", error);
                toast.error("Login failed");
            }

        }
    }

    return (
        <div className={`max-w-[350px] mx-auto px-4 bg-white rounded-lg flex flex-col items-center justify-center py-2 min-w-[280px] z-20 transform shadow-xl  ${showLogin ? '' : 'hidden'} login-form transition-all duration-300 ease-in-out`}>
            <div className=' w-full flex items-center justify-between'>
                <h1 className='text-2xl font-bold mt-2 text-gray-800'>Tracksy</h1>
                <div onClick={() => setShowLogin(false)} className='text-gray-700 hover:text-gray-800'><MdCancel size={20} className='cursor-pointer' /></div>
            </div>
            <form action="" className='mt-3' onSubmit={handleFormSubmit}>
                <input
                    type="email"
                    placeholder='Email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='border-2 border-gray-300 p-2 rounded-lg w-full my-2'
                />
                <input
                    type="password"
                    placeholder='Password'
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    className='border-2 border-gray-300 p-2 rounded-lg w-full my-2'
                />
                <div className='flex justify-end items-center w-full'>
                    <Link className='text-sm text-gray-500 hover:text-gray-800' onClick={handleEmailOpen}>Forgot Password?</Link>
                </div>
                {showForgotPassword && (
                    <div className={`flex items-center border-2 rounded-lg px-2  forgot-password ${showForgotPassword ? 'mt-2' : 'mt-0'} transition-all duration-300 ease-in-out`}>
                        <input type="email" placeholder='Enter Email' name='emailOfForgotPassword' className='outline-none rounded-lg w-full my-2' />
                        <BsFillArrowUpRightCircleFill size={20} color='#00b16a' className='cursor-pointer' onClick={submitUsersEmailForForgotPassword} />
                        <MdCancel size={20} className='cursor-pointer ml-1' onClick={() => setShowForgotPassword(false)} />
                    </div>
                )}

                <button type='submit' className='bg-primary text-white py-2 px-4 rounded-lg w-full my-2 hover:bg-gray-800 '>Login</button>
                <div className='text-secondary text-center mt-2 text-sm font-normal flex items-center justify-center gap-1'>Don't have an account? <div className='text-sm text-primary hover:text-gray-700 hover:cursor-pointer' onClick={() => { setShowLogin(false); setShowSignup(true) }}>Sign Up</div></div>
            </form>

            <div className='w-full flex items-center mt-2'>
                <span className='inline-block w-full'><hr /></span>
                <span className='mx-2 text-sm '>or</span>
                <span className='inline-block w-full'><hr className='w-full' /></span>
            </div>

            <button className='bg-white hover:bg-gray-100 border text-gray-700 py-2 px-4 rounded-lg my-1 flex items-center justify-center gap-2' onClick={handleGoogleLogin}>
                <FcGoogle size={20} />
                <span className='text-sm'>Sign in with Google</span>
            </button>
        </div>
    )
}

export default Login;
