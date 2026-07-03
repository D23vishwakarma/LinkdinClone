import React from 'react'
import logo from '../../assets/logo.svg'
import { Link } from 'react-router-dom'
function Navbar1() {
    return (
        <nav className='bg-gray-100 w-full border-t-4 border-[#2dd2c9] flex items-center justify-between md:px-[100px] px-[20px] box-border'>
            <div className="py-5">
                <img src={logo} alt="LinkedIn" className="w-28 sm:w-32" />
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
                <Link to={"/signup"} className="text-sm sm:text-base text-zinc-800 font-medium hover:bg-gray-200 px-3 py-1.5 rounded transition-colors">
                    Join now
                </Link>
                <Link to={"/login"} className="text-sm sm:text-base text-[#0a66c2] font-medium border border-[#0a66c2] rounded-full px-5 py-1.5 hover:bg-[#e8f3f8] transition-colors">
                    Sign in
                </Link>
            </div>
        </nav>
    )
}

export default Navbar1