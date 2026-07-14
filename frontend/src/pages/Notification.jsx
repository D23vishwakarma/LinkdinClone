import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../components/Header/Header'
import { useNavigate } from 'react-router-dom'
import profile from '../assets/profile.svg'
import { authContext } from '../context/AuthContext'

function Notification() {
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState([])
    const { serverUrl } = useContext(authContext)

    const fetchNotifications = async () => {
        try {
            const result = await axios.get(serverUrl + '/api/notification/get', { withCredentials: true })
            setNotifications(result.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const handleDelete = async (id) => {
        try {
            await axios.delete(serverUrl + `/api/notification/delete/${id}`, { withCredentials: true })
            setNotifications((prev) => prev.filter((n) => n._id !== id))
        } catch (err) {
            console.log(err)
        }
    }

    const handleDeleteAll = async () => {
        try {
            await axios.delete(serverUrl + '/api/notification/clearall', { withCredentials: true })
            setNotifications([])
        } catch (err) {
            console.log(err)
        }
    }

    const getMessage = (n) => {
        switch (n.type) {
            case 'like':
                return 'liked your post'
            case 'comment':
                return 'commented on your post'
            case 'connectionRequest':
                return 'sent you a connection request'
            case 'connectionAccepted':
                return 'accepted your connection request'
            default:
                return 'interacted with your activity'
        }
    }

    return (
        <div className='min-h-screen bg-[#f0efe7]'>
            <Header />

            <div className='max-w-2xl mx-auto pt-23 px-4'>
                <div className='bg-white rounded-lg border border-zinc-200 overflow-hidden'>
                    <div className='flex items-center justify-between px-5 py-3 border-b border-zinc-200'>
                        <h2 className='text-lg font-semibold text-zinc-900'>
                            Notifications
                        </h2>
                        {notifications.length > 0 && (
                            <button
                                onClick={handleDeleteAll}
                                className='text-xs font-semibold text-zinc-500 hover:text-red-600 transition-colors'
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className='flex flex-col'>
                        {notifications.length === 0 ? (
                            <div className='px-5 py-10 text-center text-sm text-zinc-500'>
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n._id}
                                    className='flex items-start gap-3 px-5 py-4 border-b border-zinc-100 hover:bg-zinc-50 transition-colors group'
                                >
                                    <img
                                        src={n.sender?.profileImage || profile}
                                        alt={n.sender?.firstName}
                                        onClick={() => navigate(`/profile/${n.sender?.username}`)}
                                        className='w-11 h-11 rounded-full object-cover flex-shrink-0 cursor-pointer'
                                    />

                                    <div
                                        onClick={() => {
                                            if (n.relatedPost) navigate(`/post/${n.relatedPost._id}`)
                                            else if (n.sender?.username) navigate(`/profile/${n.sender.username}`)
                                        }}
                                        className='flex-1 min-w-0 cursor-pointer'
                                    >
                                        <p className='text-sm text-zinc-800 leading-snug'>
                                            <span className='font-semibold'>
                                                {n.sender?.firstName} {n.sender?.lastName}
                                            </span>{' '}
                                            {getMessage(n)}
                                        </p>
                                        {n.relatedPost?.description && (
                                            <p className='text-xs text-zinc-500 truncate mt-0.5'>
                                                "{n.relatedPost.description}"
                                            </p>
                                        )}
                                        <span className='text-xs text-zinc-400'>
                                            {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                                        </span>
                                    </div>

                                    {n.relatedPost?.image && (
                                        <img
                                            src={n.relatedPost.image}
                                            alt='post'
                                            className='w-10 h-10 rounded object-cover flex-shrink-0'
                                        />
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(n._id)
                                        }}
                                        className='opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-600 text-xs transition-opacity flex-shrink-0'
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notification