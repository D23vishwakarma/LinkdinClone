import React from 'react'
import { useState } from 'react';
import { createContext } from 'react'
import { authContext } from './AuthContext';
import axios from 'axios';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
export const userContext=createContext();
function UserContext({children}) {
    const navigate=useNavigate();
    const [userData,setUserData]=useState(null)
    const {serverUrl}=useContext(authContext)
    const [edit,setEdit]=useState(false)
    const [post,setPost]=useState([])
    const [profileData,setProfileData]=useState([])
    const getCurrentUser=async()=>{
        try {
            const result=await axios.get(serverUrl+"/api/user/currentuser",{withCredentials:true})
            setUserData(result.data.data)
        } catch (error) {
            console.log(error)
            setUserData(null)
        }
    }
    const getPost=async()=>{
        try {
            const result=await axios.get(serverUrl+"/api/post/getpost",{withCredentials:true})
            setPost(result.data.data)
        } catch (error) {
            console.log(error);
        }
    }
    const handleGetProfile=async({username})=>{
        try {
            const result=await axios.get(serverUrl+`/api/user/getprofile/${username}`,{withCredentials:true})
            setProfileData(result.data.data)
            navigate(`/profile/${username}`)
        } catch (error) {
            
        }
    }
    const value={
        userData,setUserData,edit,setEdit,post,setPost,getPost,handleGetProfile,profileData,setProfileData
    }
    useEffect(()=>{
        getCurrentUser()
        getPost()
    },[])
    return (
        <div>
            <userContext.Provider value={value}>
            {children}
            </userContext.Provider>
        </div>
    )
}

export default UserContext
