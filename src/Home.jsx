import React from 'react'
import Header from './components/Header'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
        <Header />
        <main className='flex flex-col items-center justify-center gap-2 h-screen px-5 bg-linear-90 from-indigo-600 to-pink-600 backdrop-blur-3x'>
            <h2 className='text-center text-3xl font-bold flex flex-col text-[#F3F0E8]'>
                <span>
                    Welcome to
                </span>
                <span className='-mt-1'>
                    Routine Node
                </span>
            </h2>
            <p className='text-center text-[0.9rem] text-[#F3F0E8]'>
                Where your daily routine stays organised and your daily goals remain focused and control. We are here to structure, support and also guide and help turn your daily goals into a lasting habits!
            </p>
            <Link to='/register' className='bg-[#F3F0E8] text-pink-500 px-4 py-2 rounded-sm text-md font-semibold shadow-sm cursor-pointer hover:opacity-90 active:opacity-85'>
                Get Started
            </Link>
        </main>
    </>
  )
}

export default Home