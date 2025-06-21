import React, { useState } from 'react'
import LandingPageNav from '../components/LandingPageNav'
import { landComments } from '../data/LandComments'
import Profile from '../components/profile'
import Card from '../assets/Card.png'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { GlobalContext } from '../context/AppContext'
import { FaBrain } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";
import { GiPoolTriangle } from "react-icons/gi";
import { PiTriangleDashedDuotone } from "react-icons/pi";
import { MdGrain } from "react-icons/md";

const LandingPage = () => {
    gsap.registerPlugin(ScrollTrigger)

    useGSAP(() => {

        const tl = gsap.timeline();
        const mm = gsap.matchMedia();

        tl.from('.heading', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            stagger: 0.2,
        })

        mm.add({
            "(min-width: 768px)": () => {
                gsap.from('.card-img', {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.out',
                    stagger: 0.2,
                })
            },
            "(max-width: 767px)": () => {
                tl.from('.card-img', {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.out',
                })
            }
        })

        return () => {
            tl.kill();
            mm.revert();
        }

    }, [])


    //states:
    const { showLogin, setShowLogin, showSignup, setShowSignup } = React.useContext(GlobalContext);

    return (
        <div className='w-full relative min-h-screen '>
            <LandingPageNav setShowLogin={setShowLogin} />

            {/* content */}
            <div className='relative max-w-[900px] mx-auto px-16 max-md:px-6 mt-16 max-md:mt-14'>
                 <div className='absolute bottom-4 left-10  max-md:hidden'><FaArrowTrendUp size={27} color='#daa520'/></div>
                 <div className='absolute top-4 left-10  max-md:hidden'><GiPoolTriangle size={27} color='f37b62'/></div>
                 <div className='absolute top-3 right-8  max-md:hidden'><PiTriangleDashedDuotone size={27} color='cb2603'/></div>
                 <div className='absolute bottom-6 right-16  max-md:hidden'><MdGrain size={27} color='f37b62'/></div>
                <div className='flex flex-col items-center justify-center content'>
                    <div className='flex gap-2 px-4 items-center text-sm rounded-full p-2 bg-violet-200 mb-4 text-violet-800 font-bold'> <div><FaBrain /></div>With AI powered Purchase List</div>
                    <p className='text-4xl font-bold text-black mb-4 font-inter-tight text-center leading-snug heading dark:text-white'>
                        Smart <span className=''>Inventory Management</span> Built for Local Businesses.
                    </p>
                    <p className='text-secondary text-lg text-center mb-6 font-inter-tight heading'>
                        Manage your inventory smartly with tools designed to save time and grow your shop.
                    </p>
                    <div className='w-full flex justify-center items-center gap-6 max-md:flex-col-reverse max-md:gap-4 heading'>
                        <button
                            onClick={() => setShowSignup(!showSignup)}
                            className="relative z-10 py-2 px-6 text-white rounded-full border-2 border-gray-400 group overflow-hidden hover:scale-110 transition-all duration-300 ease-in-out"
                        >
                            <span className="absolute inset-0 bg-black transition-transform duration-300 ease-in-out z-[-1]" />
                            <span className="relative z-10 text-white transition-colors duration-300">
                                Get Started
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* features */}
            <div className='max-w-[1200px] mx-auto px-12 max-md:px-6 mt-16 max-md:mt-12 flex justify-between items-center flex-wrap max-md:justify-center gap-4 image'>
                <div className="group relative max-w-[300px] bg-white/70 backdrop-blur-sm rounded-3xl px-4 py-2  transition-all duration-500 transform  border border-gray-200  overflow-hidden">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-cyan-400/20 to-blue-600/20 opacity-100 transition-opacity duration-500"></div>
                    {/* <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div> */}

                    <div className="relative z-10">
                        {/* Icon with glow effect */}
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/25 group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                            Smart Dashboard
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Beautiful analytics that turn your data into actionable insights with real-time tracking.
                        </p>
                    </div>
                </div>


                {/* Premium badge */}
                <div className="group relative bg-white/70 backdrop-blur-sm rounded-3xl px-4 py-3  transition-all duration-500 transform  border border-gray-200 border-purple-200/50 overflow-hidden max-w-[320px]">

                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-purple-600/20 opacity-100  transition-opacity duration-500"></div>
                    {/* <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div> */}

                    <div className="relative z-10 ">
                        {/* AI Icon with multiple effects */}
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/25 group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3 relative">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            {/* Pulsing rings */}
                            {/* <div className="absolute inset-0 rounded-2xl bg-purple-400 animate-ping opacity-20"></div>
                            <div className="absolute inset-0 rounded-2xl bg-pink-400 animate-pulse opacity-15"></div> */}
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                            AI Purchase Lists
                        </h3>
                        <p className="text-gray-600 mb-3 leading-relaxed">
                            Revolutionary AI that predicts what you need before you run out. Smart ordering made simple.
                        </p>

                        {/* AI Status with animation */}
                        {/* <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 animate-pulse"></div>
                                    <span className="text-sm font-semibold text-purple-700">AI Generated Purchase List</span>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>

                <div className="group relative bg-white/70 backdrop-blur-sm rounded-3xl px-4 py-4 transition-all duration-500 transform shadow-md border border-white/50 overflow-hidden max-w-[320px]">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-green-400/20 to-teal-600/20 opacity-100 transition-opacity duration-500"></div>
                    {/* <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div> */}

                    <div className="relative z-10">
                        {/* Icon with glow effect */}
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg group-hover:shadow-emerald-500/25 group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21h6" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                            Total Control
                        </h3>
                        <p className="text-gray-600 mb-3 leading-relaxed">
                            Complete mastery over your inventory with advanced tracking and intelligent alerts.
                        </p>

                        {/* Beautiful stats */}
                        {/* <div className="grid grid-cols-1 gap-3 mb-6">
                            <div className="text-center p-2 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">24/7</div>
                                <div className="text-xs text-emerald-700 font-medium">Active</div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className={`fixed inset-0 bg-gray-200 flex justify-center items-center z-50 bg-opacity-70 px-4 ${showLogin || showSignup ? '' : 'hidden'}`}>
                <Login showLogin={showLogin} setShowLogin={setShowLogin} setShowSignup={setShowSignup} />
                <Signup showSignup={showSignup} setShowSignup={setShowSignup} setShowLogin={setShowLogin} />
            </div>

        </div>
    )
}

export default LandingPage
