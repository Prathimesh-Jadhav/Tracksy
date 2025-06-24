import React from 'react'
import { Link } from 'react-router-dom'
import { MdCancel } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { GlobalContext } from '../context/AppContext';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Firebase/Config';
import axios from 'axios';
import { toast } from 'react-toastify';

const Signup = ({ showSignup, setShowSignup, setShowLogin }) => {

    const { setUserCredentials, userCredentials, isLogin, setIsLogin } = React.useContext(GlobalContext);

    // Added: State for form input
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    });

    const handleGoogleSignup = async () => {
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

            if (sessionStorage.getItem('token') && sessionStorage.getItem('userId')) toast.error("User already logged in");

            // Save user data to the database
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/userRoutes/googleLogin`, userData);
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('userId', response.data.userId);
            sessionStorage.setItem('name', userData.name);
            sessionStorage.setItem('email', userData.email);
            toast.success("signup successful");
            setIsLogin(true);
            setShowSignup(false);

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

    // Added: Input change handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Added: Form submit handler
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const user = {
            name: formData.name,
            email: formData.email,
            password: formData.password
        };
        console.log("Sending to backend:", user);
        // Here you'd send `user` to your backend

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/userRoutes/signup`, user, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log("response", response);
            toast.success(response.data.message);
            setUserCredentials({
                name: response.data.name,
                email: response.data.email,
            });
            sessionStorage.setItem('name', response.data.name);
            sessionStorage.setItem('email', response.data.email);
            setFormData({ name: '', email: '', password: '' });
            setShowSignup(false);
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            }
            else {
                console.error("Signup failed:", error);
                toast.error("Signup failed");
            }
        }

    };

    return (
        <div className={`max-w-[350px] mx-auto px-4 bg-white rounded-lg flex flex-col items-center justify-center py-2 min-w-[280px] z-20 transform shadow-xl  ${showSignup ? '' : 'hidden'} login-form transition-all duration-300 ease-in-out`}>
            <div className='w-full flex items-center justify-between'>
                <h1 className='text-2xl font-bold mt-2 text-gray-800'>Tracksy</h1>
                <div onClick={() => setShowSignup(false)} className='text-gray-700 hover:text-gray-800'>
                    <MdCancel size={20} className='cursor-pointer' />
                </div>
            </div>

            <form className='mt-3' onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder='Name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className='border-2 border-gray-300 p-2 rounded-lg w-full my-2'
                />
                <input
                    type="email"
                    name="email"
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='border-2 border-gray-300 p-2 rounded-lg w-full my-2'
                />
                <input
                    type="password"
                    name="password"
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleInputChange}
                    className='border-2 border-gray-300 p-2 rounded-lg w-full my-2'
                />
                <button type='submit' className='bg-primary text-white py-2 px-4 rounded-lg w-full my-2 hover:bg-gray-800'>
                    Sign Up
                </button>
                <div className='text-secondary text-center mt-2 text-sm font-normal flex justify-center items-center gap-1'>
                    Already have an account?
                    <div className='text-sm text-primary hover:text-gray-700 hover:cursor-pointer' onClick={() => { setShowSignup(false); setShowLogin(true) }}>Sign in</div>
                </div>
            </form>

            <div className='w-full flex items-center mt-2'>
                <span className='inline-block w-full'><hr /></span>
                <span className='mx-2 text-sm '>or</span>
                <span className='inline-block w-full'><hr className='w-full' /></span>
            </div>
            <button className='bg-white hover:bg-gray-100 border text-gray-700 py-2 px-4 rounded-lg my-1 flex items-center justify-center gap-2' onClick={handleGoogleSignup}>
                <FcGoogle size={20} />
                <span className='text-sm'>Sign up with Google</span>
            </button>
        </div>
    );
}

export default Signup;
