import React from "react";
import logo from "../assets/logo.svg";
import { useState } from "react";
import { BiSolidShow } from "react-icons/bi";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "../context/AuthContext";
import axios from "axios";
import { userContext } from "../context/UserContext";
function Signup() {
    const [show,setShow]=useState(false);
    const navigate=useNavigate();
    const {serverUrl}=useContext(authContext)
    const [loading,setLoading]=useState(false)
    
    const {userData,setUserData}=useContext(userContext)
    const [firstName,setFirstName]=useState("");
    const [lastName,setLastName]=useState("");
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const[error,setError]=useState("");

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        try {
            const result=await axios.post(serverUrl+"/api/auth/signup",{
                firstName,
                lastName,
                username,
                email,
                password
            },{withCredentials:true})
            setUserData(result.data)
            navigate("/")
            setLoading(false)
            setFirstName("")
            setLastName("")
            setPassword("")
            setUsername("")
            setEmail("")
            console.log(result)
        } catch (error) {
            console.log(error)
            setError(error.response.data.message)
            setLoading(false)
        }
    }

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Logo */}
      <div className="px-6 sm:px-9 md:px-12 py-5">
        <img src={logo} alt="LinkedIn" className="w-28 sm:w-32" />
      </div>

      {/* Form */}
      <div className="flex justify-center items-center px-4 pb-10">
        <form className="w-full max-w-[400px] bg-white rounded-md shadow-lg px-6 sm:px-8 py-8 scale-80 md:scale-100" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-semibold mb-8">Sign Up</h1>

          <input
            type="text"
            placeholder="Firstname"
            className="w-full border border-gray-400 rounded-sm px-4 py-3 mb-4 outline-none focus:border-[#0A66C2]"
            value={firstName}
            onChange={(e)=>setFirstName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Lastname"
            className="w-full border border-gray-400 rounded-sm px-4 py-3 mb-4 outline-none focus:border-[#0A66C2]"
             value={lastName}
            onChange={(e)=>setLastName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-400 rounded-sm px-4 py-3 mb-4 outline-none focus:border-[#0A66C2]"
             value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-400 rounded-sm px-4 py-3 mb-4 outline-none focus:border-[#0A66C2]"
             value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <div className="flex items-center border border-gray-400 rounded-sm px-4 py-3 mb-8 focus-within:border-[#0A66C2]">
            <input
              type={show ? "text":"password"}
              placeholder="Password"
              className="flex-1 outline-none"
               value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <button
              type="button"
              className="text-zinc-600 hover:text-[#0A66C2] font-semibold text-sm"
              onClick={()=>{setShow(!show)}}
            >
            {show ? <IoMdEyeOff size={25}/>:<BiSolidShow size={25}/>}
            </button>
          </div>
            {error&&<p className="text-[0.9rem] text-center text-red-500 -mt-4 mb-4">*{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#0A66C2] hover:bg-[#004182] transition text-white font-medium py-3 rounded-full"
            disabled={loading}
          >
           {loading?"Loading...":"Sign Up"}
          </button>
        
          <p className="text-center text-sm mt-5 cursor-pointer" onClick={()=>navigate("/login")}>
            Already have an account?{" "}
            <span className="text-[#0A66C2] font-semibold cursor-pointer hover:underline">
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;