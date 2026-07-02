import { FaHome, FaUserFriends, FaBell, FaSearch,FaSignOutAlt, FaChevronRight } from "react-icons/fa";
import shortlogo from '../../assets/shortlogo.svg'
import profile from '../../assets/profile.svg'
import { useState } from "react";
import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import axios from "axios";
import { authContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const [mobsearch, setMobsearch] = useState(false)
    const { userData,setUserData } = useContext(userContext);
    const {serverUrl}=useContext(authContext);
    const [showpopup,setShowpopup]=useState(false)
    const navigate=useNavigate();
    const handleSignout=async()=>{
        try {
            const result=await axios.post(serverUrl+"/api/auth/logout",{withCredentials:true})
            setUserData(null);
            navigate("/login")
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex justify-center items-center w-full bg-white border-b p-1 border-gray-200 fixed top-0">
            <div className="w-full max-w-[1100px] flex items-center justify-between px-4 sm:px-6 py-2">
                {/* Left: Logo + Search */}
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <img src={shortlogo} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" alt="Logo" />

                    {/* Search — full on desktop, icon-only on mobile */}
                    <div className="hidden sm:flex items-center bg-gray-100 rounded px-3 py-1.5 w-64">
                        <svg
                            className="w-4 h-4 text-gray-500 mr-2 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent outline-none text-sm w-full placeholder-gray-500"
                        />
                    </div>

                    {/* Mobile search icon button */}
                    <button className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 shrink-0" onClick={() => setMobsearch(!mobsearch)}>
                        <FaSearch className="w-3.5 h-3.5" />
                    </button>
                    <input
                        type="text"
                        placeholder="Search"
                        className={`${mobsearch ? '' : 'hidden'} bg-transparent outline-none text-sm w-full placeholder-gray-500`}
                    />
                </div>

                {/* Right: Nav icons + Profile */}
                <div className="flex items-center gap-3 sm:gap-6 shrink-0 relative">
                    {showpopup &&<div className={`absolute bg-white w-72 top-15 rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden`}>
                        {/* Pop up  */}
                        <div className="flex flex-col items-center p-6 pb-4">
                            <img
                                src={profile}
                                alt="Profile"
                                className="w-16 h-16 rounded-full object-cover cursor-pointer shrink-0 border border-gray-200"
                            />
                            <div className="text-zinc-800 mt-3 font-semibold text-base">
                                {userData.firstName} {userData.lastName}
                            </div>
                            {userData.headline && (
                                <div className="text-zinc-500 text-xs mt-1 text-center px-2">
                                    {userData.headline}
                                </div>
                            )}
                            <button className="mt-4 w-[90%] h-[35px] rounded-full border-2 border-[#288ab4] text-[#288ab4] font-medium text-sm hover:bg-[#e8f3f8] transition-colors">
                                View Profile
                            </button>
                        </div>

                        <div className="border-t border-gray-200" />

                        {/* Manage section */}
                        <div className="flex flex-col py-2">
                            <button className="flex items-center justify-between px-6 py-3 hover:bg-gray-100 transition-colors text-left">
                                <div className="flex items-center gap-3">
                                    <FaUserFriends className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-zinc-700">My Network</span>
                                </div>
                                <FaChevronRight className="w-3 h-3 text-gray-400" />
                            </button>
                        </div>

                        <div className="border-t border-gray-200" />

                        {/* Sign out section */}
                        <div className="flex flex-col py-2">
                            <button className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 transition-colors text-left" onClick={handleSignout}>
                                <FaSignOutAlt className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-zinc-700">Sign Out</span>
                            </button>
                        </div>
                    </div>
}
                    <div className="hidden sm:flex flex-col items-center text-gray-500 cursor-pointer">
                        <FaHome className="w-5 h-5" />
                        <span className="text-xs mt-0.5">Home</span>
                    </div>
                    <div className="hidden sm:flex flex-col items-center text-gray-500 cursor-pointer">
                        <FaUserFriends className="w-5 h-5" />
                        <span className="text-xs mt-0.5">My Network</span>
                    </div>

                    {/* Bell — always visible, no label on mobile */}
                    <div className="flex flex-col items-center text-gray-500 cursor-pointer">
                        <FaBell className="w-5 h-5" />
                        <span className="hidden sm:block text-xs mt-0.5">Notifications</span>
                    </div>

                    {/* Profile image */}
                    <img
                        src={profile}
                        alt="Profile"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover cursor-pointer shrink-0"
                        onClick={()=>setShowpopup(!showpopup)}

                    />
                </div>
            </div>
        </div>
    );
}