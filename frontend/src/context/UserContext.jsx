import React from 'react'
import { useState } from 'react';
import { createContext } from 'react'
import { authContext } from './AuthContext';
import axios from 'axios';
import { useEffect } from 'react';
import { useContext } from 'react';
export const userContext=createContext();
function UserContext({children}) {
    const [userData,setUserData]=useState(null)
    const {serverUrl}=useContext(authContext)
    const [edit,setEdit]=useState(false)

    const getCurrentUser=async()=>{
        try {
            const result=await axios.get(serverUrl+"/api/user/currentuser",{withCredentials:true})
            setUserData(result.data.data)
        } catch (error) {
            console.log(error)
            setUserData(null)
        }
    }
    const value={
        userData,setUserData,edit,setEdit
    }
    useEffect(()=>{
        getCurrentUser()
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
