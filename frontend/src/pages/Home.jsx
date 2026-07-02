import React from 'react'
import Header from '../components/Header/Header'

function Home() {
    return (
        <div className='bg-zinc-200 h-screen flex items-start justify-center pt-20 px-5 gap-[20px]'>
            <Header/>
            <div className='h-50 bg-white w-[25%] rounded-xl'></div>
            <div className='h-70 bg-white w-[50%] rounded-xl'></div>
            <div className='h-70 bg-white w-[25%] rounded-xl'></div>
        </div>
    )
}

export default Home
