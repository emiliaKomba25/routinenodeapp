import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { useGetTaskQuery, useGetUserQuery } from './api/tasks/taskApi'
import { skipToken } from '@reduxjs/toolkit/query'
import { LoaderCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { setStateUser } from './api/tasks/taskSlice'

const Profile = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState(null)
    const user = useSelector(state => state.authSlice.user)
    const taskResponse = useGetTaskQuery(user.id ?? skipToken);
    const [tasks, setTasks] = useState(null)
    const userResponse = useGetUserQuery(user?.id ?? skipToken)

    useEffect(() => {
        if(taskResponse.data){
            setTasks(taskResponse.data)
        }
    }, [taskResponse])

    useEffect(() => {
        if(userResponse.data){
            dispatch(setStateUser(userResponse.data))
            setIsLoading(false)
            setUserData(userResponse.data)
        }
    }, [userResponse])

    return (
        <>
            <Header />
            <main className='w-full h-screen flex justify-center items-center bg-linear-90 from-indigo-600 p-5 to-pink-600'>
                {isLoading && !tasks ? <LoaderCircle className='text-[#F3F0E8] animate-spin' /> : <div className='w-full max-w-sm p-10 rounded-lg flex flex-col items-center gap-2 text-[0.9rem] bg-[#F3F0E8]'>
                    <img src={userData.imageUrl || "/profile.jpg"} alt="" width="100px" height="100px" className='object-cover object-top w-25 h-25 rounded-full'/>
                    <div className='flex flex-col justify-center items-center gap-1 text-[0.9rem]'>
                        <p className='font-bold'>{userData.firstname} {userData.lastname}</p>
                        <p className='text-[0.8rem]'>{userData.email}</p>
                        <Link to="/edit-profile" className='bg-indigo-600 text-[#F3F0E8] text-[0.9rem] px-2 py-1 rounded-sm flex justify-center items-center cursor-pointer w-24'>Edit Profile</Link>
                    </div>
                    <div className='flex flex-col items-center'>
                        <p><span className='font-semibold'>Tasks:</span> {tasks?.length}</p>
                        <p><span className='font-semibold'>Completed:</span> {tasks?.filter(task => task.completed === true).length}</p>
                        <p className='animate-bounce mt-1'><span className='font-semibold'>Still standing:</span> {tasks.filter(task => task.completed === false).length}</p>
                    </div>
                    
                </div>}
            </main>
        </>
    )
}

export default Profile