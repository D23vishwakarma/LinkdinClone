import React, { useEffect } from 'react'
import Header from '../components/Header/Header'
import profile from '../assets/profile.svg'
import { CiCirclePlus } from "react-icons/ci";
import { TbCameraPlus } from "react-icons/tb";
import { useContext } from 'react';
import { userContext } from '../context/UserContext';
import EditProfile from '../components/EditProfile';
import { useState, useRef } from 'react';
import { RxCross2 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import axios from 'axios';
import { authContext } from '../context/AuthContext';
import Post from '../components/Post';
import ConnectionBtn from '../components/ConnectionBtn';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate=useNavigate();
    const { userData, setUserData, edit, setEdit, post, setPost, searchPop, setSearchPop } = useContext(userContext);
    const [addPost, setAddPost] = useState(false);
    const [content, setContent] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [suggestedUser, setSuggestedUser] = useState([]);
    const imageInputRef = useRef();
    const { serverUrl } = useContext(authContext)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };
    const handleSuggestion = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/user/suggestion", { withCredentials: true })
            setSuggestedUser(result.data.data);
            console.log(result.data.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        handleSuggestion()
    }, [])
    const removeImage = () => {
        setSelectedImage(null);
        setPreviewImage(null);
    };

    const uploadPost = async (req, res) => {
        try {
            const formdata = new FormData()
            formdata.append("description", content);
            if (selectedImage) {
                formdata.append("image", selectedImage);
            }
            const result = await axios.post(serverUrl + "/api/post/createpost", formdata, { withCredentials: true })
            setPost(prevPost => [result.data.data, ...prevPost])
            setAddPost(!addPost)
            setContent("")
            setPreviewImage(null)
            setSelectedImage(null);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='w-full bg-[#f0efe7] h-full overflow-hidden flex flex-col md:flex-row items-start justify-center pt-17 md:pt-20 md:px-2 gap-[15px] md:gap-[15px]'>
            {edit && <EditProfile />}
            <Header />
            {/* First Section */}
            <div className='w-full bg-white md:w-[15%] rounded-lg relative border border-zinc-200 overflow-hidden min-h-40 ' onClick={() => { setEdit(!edit) }}>
                {/* Cover photo */}
                <div className='bg-gray-200 rounded-t-md h-15 relative'>
                    {userData.coverImage && <img
                        src={userData.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />}
                    {!userData.coverImage && <button className='absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors'>
                        <TbCameraPlus className='text-zinc-700' size={16} />
                    </button>}
                </div>

                {/* Profile picture with plus badge */}
                <div className='w-[75px] h-[75px] relative -mt-9 ml-5'>
                    <img
                        src={userData.profileImage ? userData.profileImage : profile}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover cursor-pointer shrink-0 border-2 border-white"
                    />
                    {!userData.profileImage && <div className='absolute bottom-0 right-0 text-zinc-600 w-6 h-6 flex justify-center items-center bg-gray-200 rounded-full border-2 border-white'>
                        <CiCirclePlus size={22} />
                    </div>}
                </div>

                {/* Info section */}
                <div className='p-4 pt-2'>
                    <h2 className='font-semibold text-zinc-800 text-[19px] truncate'>
                        {`${userData.firstName} ${userData.lastName}`}
                    </h2>
                    <p className='text-[13px] text-zinc-700 line-clamp-2'>
                        {userData.headline}
                    </p>
                    <p className='text-[12px] text-zinc-500'>
                        {userData.location}
                    </p>

                    {/* Education row */}
                    {userData.education && userData.education.length > 0 && (
                        <div className='flex items-center gap-2 mt-3'>
                            <p className='text-[12px] text-zinc-700 font-medium leading-tight'>
                                {userData.education[0].college}
                                {userData.education[0].degree ? `, ${userData.education[0].degree}` : ""}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {/* middle */}
            {addPost && <div className='w-full h-screen bg-black opacity-70 absolute top-0 z-200'></div>}
            {addPost && (
                <>
                    {/* Backdrop */}
                    <div
                        className='fixed inset-0 bg-black/50 z-[240]'
                        onClick={() => setAddPost(false)}
                    />

                    {/* Modal */}
                    <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[92vw] max-w-[550px] h-[85vh] max-h-[550px] 
                        sm:w-[500px] sm:h-[500px]
                        bg-white z-[250] rounded-xl flex flex-col overflow-hidden'>

                        {/* Header */}
                        <div className='flex items-center justify-between p-3 sm:p-4 border-b border-zinc-200'>
                            <div className='flex items-center gap-2 sm:gap-3'>
                                <img
                                    src={userData.profileImage ? userData.profileImage : profile}
                                    alt="Profile"
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                                />
                                <div>
                                    <div className='font-semibold text-zinc-800 text-sm sm:text-base'>
                                        {userData.firstName} {userData.lastName}
                                    </div>
                                    <button className='flex items-center gap-1 text-xs text-zinc-600 border border-zinc-400 rounded-full px-2 py-0.5 mt-0.5 hover:bg-gray-100'>
                                        Post to Anyone
                                    </button>
                                </div>
                            </div>
                            <button onClick={() => setAddPost(!addPost)} className='text-zinc-600 hover:bg-gray-100 rounded-full p-1'>
                                <RxCross2 size={22} />
                            </button>
                        </div>

                        {/* Description textarea */}
                        <div className='flex-1 overflow-y-auto p-3 sm:p-4'>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What do you want to talk about?"
                                className='w-full h-full min-h-[100px] sm:min-h-[120px] outline-none resize-none text-base sm:text-lg placeholder-zinc-500'
                            />

                            {previewImage && (
                                <div className='relative mt-2'>
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className='w-full max-h-60 sm:max-h-80 object-cover rounded-lg'
                                    />
                                    <button
                                        onClick={removeImage}
                                        className='absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80'
                                    >
                                        <RxCross2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Image add section + Post button */}
                        <div className='flex items-center justify-between p-2 sm:p-3 border-t border-zinc-200'>
                            <button
                                onClick={() => imageInputRef.current.click()}
                                className='text-zinc-600 hover:bg-gray-100 rounded-full p-2'
                            >
                                <BsImage size={22} />
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                ref={imageInputRef}
                                onChange={handleImageChange}
                            />

                            <button
                                disabled={!content.trim() && !selectedImage}
                                className='bg-[#0a66c2] text-white font-medium text-sm px-4 py-1.5 rounded-full disabled:bg-zinc-200 disabled:text-zinc-400 hover:bg-[#004182] disabled:hover:bg-zinc-200 transition-colors'
                                onClick={uploadPost}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </>
            )}
            <div className='w-full md:w-[40%] flex flex-col justify-center items-center gap-5 overflow-hidden overflow-y-auto'>
                <div className='w-full h-22 flex justify-center items-center gap-7 bg-white rounded-lg border border-zinc-200 px-5'>
                    <img
                        src={userData.profileImage ? userData.profileImage : profile}
                        alt="Profile"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover cursor-pointer shrink-0 scale-140"
                    />
                    <div className='w-120 h-12 rounded-full border border-zinc-400 flex justify-start items-center font-semibold text-zinc-800 p-4 cursor-pointer hover:bg-[#f0efe7]' onClick={() => setAddPost(!addPost)}>Start a Post</div>
                </div>
                {post.map((post) => (
                    <Post key={post._id} id={post._id} author={post.author} likes={post.likes} comments={post.comments} description={post.description} image={post.image} createdAt={post.createdAt} />
                ))}
            </div>
            {/* Last section */}
            <div className='min-h-40 max-h-76 w-full bg-white md:w-[19%] rounded-lg border border-zinc-200 hidden md:flex flex-col overflow-hidden'>
                <h3 className='px-4 pt-4 pb-2 font-semibold text-sm text-zinc-800'>
                    Add to your feed
                </h3>

                <div className='flex flex-col overflow-y-auto'>
                    {suggestedUser.map((it) => (
                        <div
                            key={it._id}
                            className='flex items-start gap-3 px-4 py-3 border-t border-zinc-100'
                        >
                            <img
                                src={it.profileImage || profile}
                                alt={it.name}
                                onClick={() => navigate(`/profile/${it.username}`)}
                                className='w-10 h-10 rounded-full object-cover cursor-pointer'
                            />

                            <div className='flex flex-col flex-1 min-w-0'>
                                <span
                                    onClick={() => navigate(`/profile/${it.username}`)}
                                    className='text-sm font-medium text-zinc-800 truncate cursor-pointer hover:underline'
                                >
                                    {it.firstName} {it.lastName}
                                </span>
                                <span className='text-xs text-zinc-500 truncate'>
                                    {it.headline}
                                </span>

                                <button
                                    className='mt-1.5 h-7.5 flex items-center justify-center border border-zinc-400 text-zinc-700 rounded-full px-1 text-xs font-semibold w-20 hover:bg-zinc-100'
                                >
                                <ConnectionBtn userId={it._id} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Home
