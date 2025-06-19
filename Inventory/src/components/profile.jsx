import React from 'react'

const Profile = ({ image, position, comment }) => {
    return (
        <div className={`h-8 w-8  absolute ${position} hover:z-20 hover:scale-110 transition-all duration-300 hover:cursor-pointer group`}>
            <div className='absolute -top-[60px] left-4 right-0 bottom-16 text-gray-800 hidden group-hover:block text-xs min-w-[140px] min-h-[50px] p-2 rounded-full bg-white'>{comment}</div>
            <img src={image} alt="" className='rounded-full'/>
        </div>
    )
}

export default Profile
