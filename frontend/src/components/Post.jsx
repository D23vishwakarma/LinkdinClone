import React, { useContext, useEffect, useState } from 'react'
import profile from '../assets/profile.svg'
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";
import { LuRepeat2 } from "react-icons/lu";
import { RiSendPlaneLine } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import moment from 'moment'
import { authContext } from '../context/AuthContext';
import axios from 'axios';
import { userContext } from '../context/UserContext';
import {io} from 'socket.io-client'

const socket=io("http://localhost:4000")
function Post({ id, author, likes, comments, description, image, createdAt }) {
    
    const [liked, setLiked] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const { serverUrl } = useContext(authContext);
    const [like, setLike] = useState(likes || []);
    const { getPost, userData } = useContext(userContext);

    const [showComments, setShowComments] = useState(false);
    const [commentList, setCommentList] = useState(comments || []);
    const [commentText, setCommentText] = useState("");
    const [visibleCount, setVisibleCount] = useState(2);

    const isLong = description && description.length > 150;

    const handleLike = async () => {
        try {
            const result = await axios.get(serverUrl + `/api/post/like/${id}`, { withCredentials: true });
            setLike(result.data.data.likes)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        socket.on("likeUpdated",({postId,likes})=>{
            if(postId===id){
                setLike(likes)
            }
            return ()=>{
                socket.off("likeUpdated")
            }
        })
        socket.on("commentAdded",({postId,comment})=>{
            if(postId===id){
                setCommentList(comment)
            }
            return ()=>{
                socket.off("commentAdded")
            }
        })
    },[id])

    useEffect(() => {
        setCommentList(comments || []);
    }, [comments, setCommentList]);

    useEffect(() => {
        getPost()
    }, [like, setLike])

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        try {
            const result = await axios.post(
                serverUrl + `/api/post/comment/${id}`,
                { content: commentText },
                { withCredentials: true }
            );
            console.log(result.data)
            setCommentList(result.data.data.comments);
            setCommentText("");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='w-full bg-white rounded-lg p-4 text-zinc-800 border border-zinc-200 min-h-[30px]'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-start gap-3'>
                    <img
                        src={author?.profileImage ? author.profileImage : profile}
                        alt="Profile"
                        className='w-12 h-12 rounded-full object-cover shrink-0'
                    />
                    <div>
                        <div className='font-semibold text-zinc-900 text-[15px] leading-tight'>
                            {author?.firstName} {author?.lastName}
                        </div>
                        {author?.headline && (
                            <p className='text-xs text-zinc-500 leading-tight line-clamp-1'>
                                {author.headline}
                            </p>
                        )}
                        <p className='text-xs text-zinc-500 flex items-center gap-1'>
                            {moment(createdAt).fromNow()}· 🌐
                        </p>
                    </div>
                </div>
                <button className='text-[#0a66c2] font-semibold text-sm hover:bg-blue-50 px-2 py-1 rounded-full transition-colors'>
                    + Connect
                </button>
            </div>

            {/* Description */}
            {description && (
                <div className='mt-3 text-[15px] leading-snug whitespace-pre-line'>
                    <span className={!expanded && isLong ? "line-clamp-3" : ""}>
                        {description}
                    </span>
                    {isLong && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className='text-zinc-500 font-semibold text-sm ml-1 hover:underline'
                        >
                            {expanded ? "less" : "...more"}
                        </button>
                    )}
                </div>
            )}

            {/* Image */}
            {image && (
                <div className='mt-3 -mx-4'>
                    <img
                        src={image}
                        alt="Post"
                        className='w-full max-h-[500px] object-cover'
                    />
                </div>
            )}

            {/* Likes / Comments count */}
            <div className='flex items-center justify-between mt-3 text-xs text-zinc-500'>
                <div className='flex items-center gap-1'>
                    {like.length > 0 && (
                        <>
                            <span className='w-4 h-4 rounded-full bg-[#0a66c2] flex items-center justify-center text-white text-[9px]'>
                                👍
                            </span>
                            <span>{like.length}</span>
                        </>
                    )}
                </div>
                {commentList?.length > 0 && (
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className='hover:underline'
                    >
                        {commentList.length} comment{commentList.length > 1 ? "s" : ""}
                    </button>
                )}
            </div>

            {/* Action buttons */}
            <div className='flex items-center justify-start mt-2 pt-2 border-t border-zinc-200'>
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${liked ? "text-[#0a66c2]" : "text-zinc-600"}`}
                >
                    {like.includes(userData._id) ? <AiFillLike color='#0a66c2' size={18} /> : <AiOutlineLike size={18} />}
                    Like
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className='flex items-center gap-2 text-sm font-medium text-zinc-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors'
                >
                    <FaRegCommentAlt size={16} />
                    Comment
                </button>
                <button className='flex items-center gap-2 text-sm font-medium text-zinc-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors'>
                    <RiSendPlaneLine size={16} />
                    Send
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className='mt-3 pt-3 border-t border-zinc-200'>
                    {/* Add comment input */}
                    <div className='flex items-start gap-3 py-3'>
                        <img
                            src={userData?.profileImage ? userData.profileImage : profile}
                            alt="Profile"
                            className='w-9 h-9 rounded-full object-cover shrink-0'
                        />
                        <div className='flex-1 flex items-center gap-2 border border-zinc-400 hover:border-zinc-700 rounded-full px-4 py-3'>
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                                placeholder="Add a comment..."
                                className='flex-1 outline-none text-sm bg-transparent'
                            />
                            {commentText.trim() && (
                                <button
                                    onClick={handleAddComment}
                                    className='text-[#0a66c2] hover:bg-blue-50 p-1.5 rounded-full transition-colors shrink-0'
                                >
                                    <RiSendPlaneLine size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Comment list */}
                    <div className='mt-4 flex flex-col gap-4'>
                        {commentList.slice(0, visibleCount).map((comment) => (
                            <div key={comment._id} className='flex items-start gap-3'>
                                <img
                                    src={comment.user?.profileImage ? comment.user.profileImage : profile}
                                    alt="Profile"
                                    className='w-10 h-10 rounded-full object-cover shrink-0'
                                />
                                <div className='flex-1'>
                                    <div className='bg-zinc-100 rounded-xl px-3 py-2'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <span className='font-semibold text-sm text-zinc-900'>
                                                    {comment.user?.firstName} {comment.user?.lastName}
                                                </span>
                                                {comment.user?.headline && (
                                                    <p className='text-xs text-zinc-500 leading-tight'>
                                                        {comment.user.headline}
                                                    </p>
                                                )}
                                            </div>
                                            <BsThreeDots className='text-zinc-500 cursor-pointer' size={16} />
                                        </div>
                                        <p className='text-sm text-zinc-800 mt-1'>
                                            {comment.content}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-4 mt-1 ml-2 text-xs text-zinc-500 font-medium'>
                                        <span>{moment(comment.createdAt).fromNow()}</span>
                                        <button className='hover:underline'>Like</button>
                                        <button className='hover:underline'>Reply</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load more comments */}
                    {commentList.length > visibleCount && (
                        <button
                            onClick={() => setVisibleCount((prev) => prev + 5)}
                            className='flex items-center gap-1 mt-4 text-sm font-semibold text-zinc-600 hover:underline'
                        >
                            <LuRepeat2 size={16} />
                            Load more comments
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default Post