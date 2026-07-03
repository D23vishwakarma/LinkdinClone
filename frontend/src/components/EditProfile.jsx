import React from 'react'
import profile from '../assets/profile.svg'
import { CiCirclePlus } from "react-icons/ci";
import { TbCameraPlus } from "react-icons/tb";
import { useContext } from 'react';
import { userContext } from '../context/UserContext';
import { RxCross2 } from "react-icons/rx";
import { FaPencilAlt } from "react-icons/fa";
import { useState } from 'react';
function EditProfile() {
    const { userData, setUserData, edit, setEdit } = useContext(userContext);
    const [scrolled, setScrolled] = useState(false);
    const [firstName, setFirstName] = useState(userData.firstName || "");
    const [lastName, setLastName] = useState(userData.lastName || "");
    const [username, setUsername] = useState(userData.username || "");
    const [headline, setHeadline] = useState(userData.headline || "");
    const [location, setLocation] = useState(userData.location || "");
    const [gender, setGender] = useState(userData.gender || "");
    const [skills, setSkills] = useState(userData.skill||[]);
    const [skillInput, setSkillInput] = useState("");

    const handleScroll = (e) => {
        setScrolled(e.target.scrollTop > 0);
    };
    return (
        <div className='w-full h-screen fixed top-0 z-100 flex justify-center items-center'>
            <div className='bg-black opacity-[0.7] w-full h-screen absolute top-0 z-100'></div>
            <div className='bg-white w-130 max-h-150 z-200 absolute rounded-xl border border-zinc-600'>
                <div className={`h-12 bg- bg-zinc-100 flex justify-between items-center p-3 border-b border-zinc-300 sticky top-0 z-250 transition-shadow duration-75 ${scrolled ? 'shadow-md' : ''} rounded-t-lg`}>
                    <h2 className='text-xl font-semibold text-zinc-800 flex justify-center items-center gap-2'><FaPencilAlt size={15} /> Edit Profile</h2>
                    <button className='font-semibold text-zinc-800 text-xl' onClick={() => setEdit(!edit)}><RxCross2 /></button>
                </div>
                <div className='overflow-y-auto max-h-120' onScroll={handleScroll}>
                <div className='bg-gray-200 rounded-b-md h-30 relative'>
                    {userData.coverImage && <img
                        src={userData.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />}
                    <button className='absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors'>
                        <TbCameraPlus className='text-zinc-700' size={16} />
                    </button>
                </div>

                {/* Profile picture with plus badge */}
                <div className='w-[90px] h-[90px] relative -mt-11 ml-5'>
                    <img
                        src={profile}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover cursor-pointer shrink-0 border-2 border-white"
                    />
                    <div className='absolute bottom-0 right-0 text-zinc-600 w-6 h-6 flex justify-center items-center bg-gray-200 rounded-full border-2 border-white'>
                        <CiCirclePlus size={22} />
                    </div>
                </div>
                {/* user form details */}
                <form className="w-full max-w-123 flex flex-col gap-4 p-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-zinc-600">First Name</label>
                        <input
                            type="text"
                            placeholder="First Name"
                            className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors"
                            value={firstName} onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-zinc-600">Last Name</label>
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors"
                            value={lastName} onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-zinc-600">Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-zinc-600">Headline</label>
                        <input
                            type="text"
                            placeholder="e.g. Frontend Developer | React.js"
                            className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors"
                            value={headline} onChange={(e) => setHeadline(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-zinc-600">Location</label>
                        <input
                            type="text"
                            placeholder="e.g. Varanasi, Uttar Pradesh"
                            className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors"
                            value={location} onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-zinc-600">Gender</label>
                        <select
                            className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors bg-white"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {/* skills handling */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-zinc-600">Skills</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g. React.js"
                                className="flex-1 border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        const trimmed = skillInput.trim();
                                        if (trimmed && !skills.includes(trimmed)) {
                                            setSkills([...skills, trimmed]);
                                        }
                                        setSkillInput("");
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const trimmed = skillInput.trim();
                                    if (trimmed && !skills.includes(trimmed)) {
                                        setSkills([...skills, trimmed]);
                                    }
                                    setSkillInput("");
                                }}
                                className="px-4 py-2 text-sm font-medium text-[#0a66c2] border border-[#0a66c2] rounded-md hover:bg-[#e8f3f8] transition-colors shrink-0"
                            >
                                Add
                            </button>
                        </div>

                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="flex items-center gap-1.5 bg-[#e8f3f8] text-[#0a66c2] text-xs font-medium px-3 py-1 rounded-full"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                                            className="text-[#0a66c2] hover:text-[#004182] font-bold leading-none"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </form>
                </div>
                <div className='bg-zinc-100 flex justify-end items-center p-2.5 px-3 border-t border-zinc-200 z-250 rounded-b-lg'>
                    <button
                        type="submit"
                        className="w-15 bg-[#0a66c2] text-white font-medium text-sm py-1.5 rounded-full hover:bg-[#004182] transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
