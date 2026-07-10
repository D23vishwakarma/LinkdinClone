import React, { useContext, useEffect, useState } from 'react'
import { authContext } from '../context/AuthContext'
import axios from 'axios'
import Header from '../components/Header/Header';
import profile from '../assets/profile.svg'
import moment from 'moment'

function Network() {
    const { serverUrl } = useContext(authContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const handleAllreq = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/connection/getrequests`, { withCredentials: true });
            setRequests(result.data.data);
        } catch (error) {
            console.log(error?.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleAllreq();
    }, []);

    const handleAccept = async (connectionId) => {
        setActionLoadingId(connectionId);
        try {
            await axios.put(`${serverUrl}/api/connection/accept/${connectionId}`, {}, { withCredentials: true });
            setRequests((prev) => prev.filter((req) => req._id !== connectionId));
        } catch (error) {
            console.log(error?.response?.data || error.message);
        } finally {
            setActionLoadingId(null);
        }
    }

    const handleReject = async (connectionId) => {
        setActionLoadingId(connectionId);
        try {
            await axios.put(`${serverUrl}/api/connection/reject/${connectionId}`, {}, { withCredentials: true });
            setRequests((prev) => prev.filter((req) => req._id !== connectionId));
        } catch (error) {
            console.log(error?.response?.data || error.message);
        } finally {
            setActionLoadingId(null);
        }
    }

    return (
        <div className='bg-[#f0efe7] w-full min-h-screen flex items-start'>
            <Header />
            <div className='w-full mt-23 max-w-2xl mx-auto px-4'>
                <div className='bg-white rounded-lg border border-zinc-200 p-4 mb-4'>
                    <h1 className='text-xl font-semibold text-zinc-900'>
                        Invitations {requests.length > 0 && `(${requests.length})`}
                    </h1>
                </div>

                {loading ? (
                    <div className='bg-white rounded-lg border border-zinc-200 p-6 text-center text-zinc-500'>
                        Loading requests...
                    </div>
                ) : requests.length === 0 ? (
                    <div className='bg-white rounded-lg border border-zinc-200 p-6 text-center text-zinc-500'>
                        No pending connection requests.
                    </div>
                ) : (
                    <div className='flex flex-col gap-3'>
                        {requests.map((req) => (
                            <div
                                key={req._id}
                                className='bg-white rounded-lg border border-zinc-200 p-4 flex items-center justify-between gap-4'
                            >
                                <div className='flex items-center gap-3 flex-1 min-w-0'>
                                    <img
                                        src={req.sender?.profileImage ? req.sender.profileImage : profile}
                                        alt="Profile"
                                        className='w-14 h-14 rounded-full object-cover shrink-0'
                                    />
                                    <div className='min-w-0'>
                                        <div className='font-semibold text-zinc-900 text-[15px] truncate'>
                                            {req.sender?.firstName} {req.sender?.lastName}
                                        </div>
                                        {req.sender?.headline && (
                                            <p className='text-xs text-zinc-500 truncate'>
                                                {req.sender.headline}
                                            </p>
                                        )}
                                        <p className='text-xs text-zinc-400 mt-0.5'>
                                            {moment(req.createdAt).fromNow()}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-2 shrink-0'>
                                    <button
                                        onClick={() => handleReject(req._id)}
                                        disabled={actionLoadingId === req._id}
                                        className='px-4 py-1.5 text-sm font-semibold rounded-full border border-zinc-400 text-zinc-700 hover:bg-zinc-100 transition-colors disabled:opacity-50'
                                    >
                                        Ignore
                                    </button>
                                    <button
                                        onClick={() => handleAccept(req._id)}
                                        disabled={actionLoadingId === req._id}
                                        className='px-4 py-1.5 text-sm font-semibold rounded-full bg-[#0a66c2] text-white hover:bg-[#004182] transition-colors disabled:opacity-50'
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Network