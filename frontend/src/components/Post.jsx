import React, { useState } from 'react'
import profile from '../assets/profile.svg'
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";
import { LuRepeat2 } from "react-icons/lu";
import { RiSendPlaneLine } from "react-icons/ri";
import moment from 'moment'

function Post({ id, author, likes, comments, description, image, createdAt }) {
    const [liked, setLiked] = useState(false);
    const [expanded, setExpanded] = useState(false);

    // Only show "read more" if description is long enough to actually be truncated
    const isLong = description && description.length > 150;

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
                    {likes?.length > 0 && (
                        <>
                            <span className='w-4 h-4 rounded-full bg-[#0a66c2] flex items-center justify-center text-white text-[9px]'>
                                👍
                            </span>
                            <span>{likes.length}</span>
                        </>
                    )}
                </div>
                {comments?.length > 0 && (
                    <span>{comments.length} comment{comments.length > 1 ? "s" : ""}</span>
                )}
            </div>

            {/* Action buttons */}
            <div className='flex items-center justify-between mt-2 pt-2 border-t border-zinc-200'>
                <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${liked ? "text-[#0a66c2]" : "text-zinc-600"}`}
                >
                    {liked ? <AiFillLike size={18} /> : <AiOutlineLike size={18} />}
                    Like
                </button>
                <button className='flex items-center gap-2 text-sm font-medium text-zinc-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors'>
                    <FaRegCommentAlt size={16} />
                    Comment
                </button>
                <button className='flex items-center gap-2 text-sm font-medium text-zinc-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors'>
                    <LuRepeat2 size={18} />
                    Repost
                </button>
                <button className='flex items-center gap-2 text-sm font-medium text-zinc-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors'>
                    <RiSendPlaneLine size={16} />
                    Send
                </button>
            </div>
        </div>
    )
}

export default Post