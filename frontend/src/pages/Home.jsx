import React from 'react'
import Header from '../components/Header/Header'
import profile from '../assets/profile.svg'
import { CiCirclePlus } from "react-icons/ci";
import { TbCameraPlus } from "react-icons/tb";
import { useContext } from 'react';
import { userContext } from '../context/UserContext';
import EditProfile from '../components/EditProfile';

function Home() {
    const { userData, setUserData,edit,setEdit } = useContext(userContext);
    return (
        <div className='w-full bg-[#f0efe7] h-screen flex flex-col md:flex-row items-start justify-center pt-17 md:pt-20 md:px-2 gap-[15px] md:gap-[15px]'>
            {edit && <EditProfile/>}
            <Header />
            <div className='w-full bg-white md:w-[15%] rounded-lg relative border border-zinc-200 overflow-hidden min-h-40' onClick={()=>{setEdit(!edit)}}>
                {/* Cover photo */}
                <div className='bg-gray-200 rounded-t-md h-15 relative'>
                    {userData.coverImage &&<img
                        src={userData.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />}
                    <button className='absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors'>
                        <TbCameraPlus className='text-zinc-700' size={16} />
                    </button>
                </div>

                {/* Profile picture with plus badge */}
                <div className='w-[75px] h-[75px] relative -mt-9 ml-5'>
                    <img
                        src={profile}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover cursor-pointer shrink-0 border-2 border-white"
                    />
                    <div className='absolute bottom-0 right-0 text-zinc-600 w-6 h-6 flex justify-center items-center bg-gray-200 rounded-full border-2 border-white'>
                        <CiCirclePlus size={22} />
                    </div>
                </div>

                {/* Info section */}
                <div className='p-4 pt-2'>
                    <h2 className='font-semibold text-zinc-800 text-[19px] truncate'>
                        {`${userData.firstName} ${userData.lastName}`}
                    </h2>
                    <p className='text-[13px] text-zinc-700 line-clamp-2'>
                        {userData.headline}
                    </p>
                    <p className='text-[12px] text-zinc-500 mt-1'>
                        {userData.location}
                    </p>

                    {/* Education row */}
                    {userData.university && (
                        <div className='flex items-center gap-2 mt-3'>
                            <img
                                // src={userData.universityLogo}
                                alt="University"
                                className="w-6 h-6 object-contain shrink-0"
                            />
                            <p className='text-[12px] text-zinc-700 font-medium leading-tight'>
                                {/* {userData.university} */}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className='h-70 w-full bg-white md:w-[40%] rounded-lg border border-zinc-200'></div>
            <div className='h-70 w-full bg-white md:w-[19%] rounded-lg border border-zinc-200'></div>
        </div>
    )
}

export default Home
