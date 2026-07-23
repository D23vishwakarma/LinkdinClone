import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import profile from '../assets/profile.svg'
import { userContext } from '../context/UserContext'
import { FaPencilAlt } from "react-icons/fa";
import EditProfile from '../components/EditProfile';
import Post from '../components/Post';
import ConnectionBtn from '../components/ConnectionBtn';
import { useParams } from 'react-router-dom';

function Profile() {
    const {username}=useParams();
    const { userData, edit, setEdit, post,profileData,setProfileData,handleGetProfile } = useContext(userContext);
    const [activeTab, setActiveTab] = useState("posts");

    const myPosts = post?.filter((p) => p.author?._id === profileData?._id) || [];
    useEffect(()=>{
        if(username){
            handleGetProfile({username})
        }
    },[username])
    return (
        <div className='bg-[#f0efe7] w-full min-h-screen flex flex-col items-start'>
            {edit && <EditProfile />}
            <Header />
            <div className='w-full max-w-3xl mx-auto mt-16 md:mt-20 px-3 md:px-4 pb-10'>

                {/* Cover + profile image + basic info */}
                <div className='bg-white rounded-lg border border-zinc-200 overflow-hidden relative'>
                    <div className='w-full h-28 md:h-48 bg-gray-200 relative overflow-hidden'>
                        {profileData.coverImage && (
                            <img
                                src={profileData.coverImage}
                                alt="Cover"
                                className='w-full h-full object-cover object-top block'
                            />
                        )}
                    </div>

                    <div className='px-4 md:px-6 pb-4 md:pb-6'>
                        <div className='-mt-10 md:-mt-17 relative w-fit'>
                            <img
                                src={profileData.profileImage ? profileData.profileImage : profile}
                                alt="Profile"
                                className='w-20 h-20 md:w-32 md:h-32 rounded-full object-cover border-4 border-white'
                            />
                        </div>

                        <div className='flex flex-col sm:flex-row sm:items-start justify-between mt-3 gap-2 sm:gap-0'>
                            <div className='min-w-0'>
                                <h1 className='text-xl md:text-2xl font-semibold text-zinc-900 truncate'>
                                    {profileData.firstName} {profileData.lastName}
                                </h1>
                                <p className='text-zinc-500 text-xs mt-0.5'>
                                    @{profileData.username}
                                </p>
                                {profileData.headline && (
                                    <p className='text-zinc-600 text-sm mt-1'>
                                        {profileData.headline}
                                    </p>
                                )}
                                {profileData.location && (
                                    <p className='text-zinc-500 text-xs mt-1'>
                                        {profileData.location}
                                    </p>
                                )}
                                <p className='text-[#0a66c2] text-sm font-medium mt-2'>
                                    {profileData.connection?.length || 0} connections
                                </p>
                            </div>

                            <div className='shrink-0 self-end sm:self-auto'>
                               {profileData._id==userData._id ? <button
                                    onClick={() => setEdit(true)}
                                    className='p-2 md:p-4 absolute top-3 right-3 md:top-50 md:right-2'
                                >
                                    <FaPencilAlt className='text-zinc-700' size={18} />
                                </button>: <ConnectionBtn userId={profileData._id}/>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity / Posts section */}
                <div className='bg-white rounded-lg border border-zinc-200 p-4 md:p-5 mt-4'>
                    <div className='flex items-center justify-between mb-1'>
                        <h2 className='text-lg font-semibold text-zinc-900'>Activity</h2>
                    </div>
                    <p className='text-[#0a66c2] text-sm font-medium mb-3'>
                        {myPosts.length} post{myPosts.length !== 1 ? "s" : ""}
                    </p>

                    {/* Tabs */}
                    <div className='flex items-center gap-2 mb-4 overflow-x-auto'>
                        <button
                            onClick={() => setActiveTab("posts")}
                            className={`shrink-0 px-4 py-1.5 text-sm font-semibold rounded-full border transition-colors ${
                                activeTab === "posts"
                                    ? "bg-[#0a66c2] text-white border-[#0a66c2]"
                                    : "bg-white text-zinc-700 border-zinc-400 hover:bg-zinc-100"
                            }`}
                        >
                            Posts
                        </button>
                        <button
                            onClick={() => setActiveTab("comments")}
                            className={`shrink-0 px-4 py-1.5 text-sm font-semibold rounded-full border transition-colors ${
                                activeTab === "comments"
                                    ? "bg-[#0a66c2] text-white border-[#0a66c2]"
                                    : "bg-white text-zinc-700 border-zinc-400 hover:bg-zinc-100"
                            }`}
                        >
                            Comments
                        </button>
                        <button
                            onClick={() => setActiveTab("images")}
                            className={`shrink-0 px-4 py-1.5 text-sm font-semibold rounded-full border transition-colors ${
                                activeTab === "images"
                                    ? "bg-[#0a66c2] text-white border-[#0a66c2]"
                                    : "bg-white text-zinc-700 border-zinc-400 hover:bg-zinc-100"
                            }`}
                        >
                            Images
                        </button>
                    </div>

                    {/* Posts tab content — horizontal scroll */}
                    {activeTab === "posts" && (
                        myPosts.length === 0 ? (
                            <p className='text-zinc-500 text-sm text-center py-6'>No posts yet.</p>
                        ) : (
                            <div className='flex flex-row gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent'>
                                {myPosts.map((p) => (
                                    <div key={p._id} className='w-72 md:w-80 shrink-0'>
                                        <Post
                                            id={p._id}
                                            author={p.author}
                                            likes={p.likes}
                                            comments={p.comments}
                                            description={p.description}
                                            image={p.image}
                                            createdAt={p.createdAt}
                                        />
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {/* Comments tab — placeholder */}
                    {activeTab === "comments" && (
                        <p className='text-zinc-500 text-sm text-center py-6'>Coming soon.</p>
                    )}

                    {/* Images tab */}
                    {activeTab === "images" && (
                        myPosts.filter((p) => p.image).length === 0 ? (
                            <p className='text-zinc-500 text-sm text-center py-6'>No image posts yet.</p>
                        ) : (
                            <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                                {myPosts.filter((p) => p.image).map((p) => (
                                    <img
                                        key={p._id}
                                        src={p.image}
                                        alt="Post"
                                        className='w-full aspect-square object-cover rounded-lg'
                                    />
                                ))}
                            </div>
                        )
                    )}
                </div>

                {/* Skills */}
                {profileData.skills?.length > 0 && (
                    <div className='bg-white rounded-lg border border-zinc-200 p-4 md:p-5 mt-4'>
                        <h2 className='text-lg font-semibold text-zinc-900 mb-3'>Skills</h2>
                        <div className='flex flex-wrap gap-2'>
                            {profileData.skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className='px-3 py-1 bg-zinc-100 text-zinc-700 text-sm rounded-full border border-zinc-200'
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience */}
                {profileData.experience?.length > 0 && (
                    <div className='bg-white rounded-lg border border-zinc-200 p-4 md:p-5 mt-4'>
                        <h2 className='text-lg font-semibold text-zinc-900 mb-3'>Experience</h2>
                        <div className='flex flex-col gap-4'>
                            {profileData.experience.map((exp, idx) => (
                                <div key={idx}>
                                    <h3 className='font-semibold text-zinc-800 text-sm'>{exp.title}</h3>
                                    <p className='text-zinc-600 text-sm'>{exp.company}</p>
                                    {exp.description && (
                                        <p className='text-zinc-500 text-xs mt-1'>{exp.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {profileData.education?.length > 0 && (
                    <div className='bg-white rounded-lg border border-zinc-200 p-4 md:p-5 mt-4'>
                        <h2 className='text-lg font-semibold text-zinc-900 mb-3'>Education</h2>
                        <div className='flex flex-col gap-4'>
                            {profileData.education.map((edu, idx) => (
                                <div key={idx}>
                                    <h3 className='font-semibold text-zinc-800 text-sm'>{edu.college}</h3>
                                    <p className='text-zinc-600 text-sm'>
                                        {edu.degree}
                                        {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gender (optional display) */}
                {profileData.gender && (
                    <div className='bg-white rounded-lg border border-zinc-200 p-4 md:p-5 mt-4'>
                        <h2 className='text-lg font-semibold text-zinc-900 mb-3'>Basic Info</h2>
                        <p className='text-zinc-600 text-sm capitalize'>{profileData.gender}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile