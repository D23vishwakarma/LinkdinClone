import React from 'react'
import profile from '../assets/profile.svg'
import { CiCirclePlus } from "react-icons/ci";
import { TbCameraPlus } from "react-icons/tb";
import { useContext } from 'react';
import { userContext } from '../context/UserContext';
import { RxCross2 } from "react-icons/rx";
import { FaPencilAlt } from "react-icons/fa";
import { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import { authContext } from '../context/AuthContext';
function EditProfile() {
    const { userData, setUserData, edit, setEdit } = useContext(userContext);
    const {serverUrl}=useContext(authContext)
    const [scrolled, setScrolled] = useState(false);
    const [firstName, setFirstName] = useState(userData.firstName || "");
    const [lastName, setLastName] = useState(userData.lastName || "");
    const [username, setUsername] = useState(userData.username || "");
    const [headline, setHeadline] = useState(userData.headline || "");
    const [location, setLocation] = useState(userData.location || "");
    const [gender, setGender] = useState(userData.gender || "");
    const [skills, setSkills] = useState(userData.skills || []);
    const [skillInput, setSkillInput] = useState("");
    const [education, setEducation] = useState(userData?.education || []);
    const [college, setCollege] = useState("");
    const [degree, setDegree] = useState("");
    const [fieldOfStudy, setFieldOfStudy] = useState("");
    const [experience, setExperience] = useState(userData?.experience || []);
    const [expTitle, setExpTitle] = useState("");
    const [expCompany, setExpCompany] = useState("");
    const [expDescription, setExpDescription] = useState("");

    const profileImage=useRef();
    const coverImage=useRef();

    const[frontendProfileImg,setFrontendProfileImg]=useState(userData?.profileImage|| profile)
    const[backendProfileImg,setBackendProfileImg]=useState(null);
    const[frontendCoverImg,setFrontendCoverImg]=useState(userData.coverImage||null)
    const[backendCoverImg,setBackendCoverImg]=useState(null);

    const [saving,setSaving]=useState(false);

    const handleProfileImg=(e)=>{
        const file=e.target.files[0];
        setBackendProfileImg(file);
        setFrontendProfileImg(URL.createObjectURL(file))
    }
    const handleCoverImg=(e)=>{
        const file=e.target.files[0];
        setBackendCoverImg(file);
        setFrontendCoverImg(URL.createObjectURL(file))
    }

    const handleScroll = (e) => {
        setScrolled(e.target.scrollTop > 0);
    };

    const handleSave=async()=>{
        setSaving(true)
        try {
            const formdata=new FormData();
            formdata.append("firstName",firstName)
            formdata.append("lastName",lastName)
            formdata.append("username",username)
            formdata.append("headline",headline)
            formdata.append("gender",gender)
            formdata.append("location",location)
            formdata.append("skills",JSON.stringify(skills))
            formdata.append("education",JSON.stringify(education))
            formdata.append("experience",JSON.stringify(experience))

            if(backendProfileImg){
                formdata.append("profileImage",backendProfileImg)
            }
            if(backendCoverImg){
                formdata.append("coverImage",backendCoverImg)
            }
            const result=await axios.put(serverUrl+"/api/user/updateprofile",formdata,{withCredentials:true})
            setUserData(result.data.data);
            setSaving(false);
            setEdit(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='w-full h-screen fixed top-0 z-100 flex justify-center items-center'>
            <input type="file" accept='image/*' hidden ref={profileImage} onChange={handleProfileImg} />
            <input type="file" accept='image/*' hidden ref={coverImage} onChange={handleCoverImg} />
            <div className='bg-black opacity-[0.7] w-full h-screen absolute top-0 z-100'></div>
            <div className='bg-white w-130 max-h-150 z-200 absolute rounded-xl border border-zinc-600 scale-70 sm:scale-100'>
                <div className={`h-12 bg- bg-zinc-100 flex justify-between items-center p-3 border-b border-zinc-300 sticky top-0 z-250 transition-shadow duration-75 ${scrolled ? 'shadow-md' : ''} rounded-t-lg`}>
                    <h2 className='text-xl font-semibold text-zinc-800 flex justify-center items-center gap-2'><FaPencilAlt size={15} /> Edit Profile</h2>
                    <button className='font-semibold text-zinc-800 text-xl' onClick={() => setEdit(!edit)}><RxCross2 /></button>
                </div>
                <div className='overflow-y-auto max-h-120' onScroll={handleScroll}>
                    <div className='bg-gray-200 rounded-b-md h-30 relative' onClick={()=>coverImage.current.click()}>
                        <img
                            src={frontendCoverImg}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                        <div className={'absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors'}>
                            <TbCameraPlus className='text-zinc-700' size={16} />
                        </div>
                    </div>

                    {/* Profile picture with plus badge */}
                    <div className='w-[90px] h-[90px] relative -mt-11 ml-5' onClick={()=>profileImage.current.click()}>
                        <img
                            src={frontendProfileImg}
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
                            <label className="text-xs font-medium text-zinc-600">First Name*</label>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors"
                                value={firstName} onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-zinc-600">Last Name*</label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors"
                                value={lastName} onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-zinc-600">Username*</label>
                            <input
                                type="text"
                                placeholder="Username"
                                className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors"
                                value={username} onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-zinc-600">Headline*</label>
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
                            <label className="text-xs font-medium text-zinc-600">Gender*</label>
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
                        {/* Education section */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-zinc-600">Education</label>

                            <div className="flex flex-col gap-2 border border-zinc-300 rounded-md p-3">
                                <input
                                    type="text"
                                    placeholder="College"
                                    className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors"
                                    value={college}
                                    onChange={(e) => setCollege(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Degree"
                                    className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors"
                                    value={degree}
                                    onChange={(e) => setDegree(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Field of Study"
                                    className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors"
                                    value={fieldOfStudy}
                                    onChange={(e) => setFieldOfStudy(e.target.value)}
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (college.trim() || degree.trim() || fieldOfStudy.trim()) {
                                            setEducation([
                                                ...education,
                                                { college: college.trim(), degree: degree.trim(), fieldOfStudy: fieldOfStudy.trim() }
                                            ]);
                                            setCollege("");
                                            setDegree("");
                                            setFieldOfStudy("");
                                        }
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-[#0a66c2] border border-[#0a66c2] rounded-md hover:bg-[#e8f3f8] transition-colors"
                                >
                                    Add Education
                                </button>
                            </div>

                            {education.length > 0 && (
                                <div className="flex flex-col gap-2 mt-1">
                                    {education.map((edu, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start justify-between bg-[#e8f3f8] rounded-md px-3 py-2"
                                        >
                                            <div className="text-xs text-zinc-700">
                                                <div className="font-semibold text-[#0a66c2]">{edu.college}</div>
                                                <div>{edu.degree}{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ""}</div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setEducation(education.filter((_, i) => i !== idx))}
                                                className="text-[#0a66c2] hover:text-[#004182] font-bold leading-none ml-2 shrink-0"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Experience section */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-zinc-600">Experience</label>

                            <div className="flex flex-col gap-2 border border-zinc-300 rounded-md p-3">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors"
                                    value={expTitle}
                                    onChange={(e) => setExpTitle(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Company"
                                    className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors"
                                    value={expCompany}
                                    onChange={(e) => setExpCompany(e.target.value)}
                                />
                                <textarea
                                    placeholder="Description"
                                    rows={3}
                                    className="border border-zinc-400 rounded-md px-3 py-2 text-sm outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-colors resize-none"
                                    value={expDescription}
                                    onChange={(e) => setExpDescription(e.target.value)}
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (expTitle.trim() || expCompany.trim() || expDescription.trim()) {
                                            setExperience([
                                                ...experience,
                                                { title: expTitle.trim(), company: expCompany.trim(), description: expDescription.trim() }
                                            ]);
                                            setExpTitle("");
                                            setExpCompany("");
                                            setExpDescription("");
                                        }
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-[#0a66c2] border border-[#0a66c2] rounded-md hover:bg-[#e8f3f8] transition-colors"
                                >
                                    Add Experience
                                </button>
                            </div>

                            {experience.length > 0 && (
                                <div className="flex flex-col gap-2 mt-1">
                                    {experience.map((exp, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start justify-between bg-[#e8f3f8] rounded-md px-3 py-2"
                                        >
                                            <div className="text-xs text-zinc-700">
                                                <div className="font-semibold text-[#0a66c2]">{exp.title}</div>
                                                <div className="font-medium">{exp.company}</div>
                                                {exp.description && <div className="mt-1 text-zinc-600">{exp.description}</div>}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setExperience(experience.filter((_, i) => i !== idx))}
                                                className="text-[#0a66c2] hover:text-[#004182] font-bold leading-none ml-2 shrink-0"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
                <div className='bg-zinc-100 flex justify-end items-center p-2.5 px-3 border-t border-zinc-200 z-250 rounded-b-lg'>
                    <button
                        type="submit"
                        className={`w-15 bg-[#0a66c2] text-white font-medium text-sm py-1.5 rounded-full hover:bg-[#004182] disabled:${saving} transition-colors`} onClick={handleSave}
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
