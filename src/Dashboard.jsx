import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from './components/Header'
import { Circle, CircleCheck, LoaderCircle } from 'lucide-react'
import { useAddTaskMutation, useCheckTaskMutation, useDeleteTaskMutation, useGetTaskQuery } from './api/tasks/taskApi'
import { useDispatch, useSelector } from 'react-redux'
import { skipToken } from '@reduxjs/toolkit/query'
import { format } from 'date-fns'
import { setStateTasks } from './api/tasks/taskSlice'

const Dashboard = () => {
    const dispatch = useDispatch()
    const [addTask] = useAddTaskMutation()
    const [deleteTask] = useDeleteTaskMutation()
    const [checkTask] = useCheckTaskMutation()
    const user = useSelector(state => state.authSlice.user)
    const taskResult = useGetTaskQuery(user?.id ?? skipToken)
    const [errMsg, setErrMsg] = useState(null)
    const [tasks, setTasks] = useState(null)
    const [isAdding, setIsAdding] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState({
        status: false, id: null
    })
    const [formData, setFormData] = useState({
        userId: "",
        taskname: "",
        note: ""
    })

    useEffect(() => {
        if(user){
            setFormData(prev => ({...prev, userId: user.id}))
        }
    }, [user])

    useEffect(() => {
        setIsLoading(false)
        if(taskResult?.data){
            const sortedTasks = [...taskResult.data].sort((a,b) => a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0);
            const readyTask = sortedTasks.sort((a, b) => a.completed && !b.completed ? 1 : !a.completed && b.completed ? -1 : 0)
            dispatch(setStateTasks(readyTask))
            setTasks(sortedTasks);
        }
    }, [taskResult])

    useEffect(() => {
        const errorTimeout = setTimeout(() => {
            setErrMsg(null)
        }, 4000)

        return () => clearTimeout(errorTimeout)
    }, [errMsg]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            setIsAdding(true)
            const result = await addTask(formData);
            if(result?.data){
                setIsAdding(false)
                setFormData({
                    ...formData,
                    taskname: "",
                    note: ""         
                })
            }
            if(result?.error){
                setIsAdding(false)
                setErrMsg(result?.error?.data?.message)
            }
        } catch(err){
            setIsAdding(false)
            console.log(err)
        }
    }

    const handleDelete = async (id) => {
        try{
            setIsDeleting({status: true, id})
            const result = await deleteTask(id);
            if(result.data){
                setIsDeleting({status: false, id: null})
            }
        } catch(err){
            setIsDeleting({status: false, id: null})
            console.log(err)
        }
    }

    const handleCheck = async (id) => {
        try{
            await checkTask(id)
        } catch(err) {
            console.log(err)
        }
    } 
    
    return (
        <>
            <Header />
            <main className='flex flex-col md:flex-row md:items-start md:justify-center items-center justify-start gap-2 min-h-screen md:max-h-screen pt-14 md:pt-16 md:px-3 bg-linear-90 from-indigo-600 to-pink-600 overflow-hidden'>
                <form onSubmit={(e) => handleSubmit(e)} className='bg-[#F3F0E8] p-5 flex flex-col items-end gap-2 w-full max-w-md shadow-sm rounded-b-xl md:rounded-sm fixed md:static'>
                    {errMsg && <p className='text-[0.8rem] text-red-600 bg-red-100 border-2 border-red-600 w-full text-center px-3 py-2 rounded-md'>{errMsg}</p>}
                    <div className='w-full'>
                        <label htmlFor="taskname" className='absolute -left-100000'>Task name</label>
                        <input type='taskname' name='taskname' required value={formData.taskname} onChange={(e) => handleInputChange(e)} autoFocus placeholder='Task name' className='border-1 border-[#ccc] p-2 rounded-md w-full text-[0.9rem]'/>
                    </div>
                    <div className='w-full'>
                        <label htmlFor="note" className='absolute -left-100000'>Note</label>
                        <textarea type='note' name='note' required value={formData.note} onChange={(e) => handleInputChange(e)} placeholder='Note' className='border-1 border-[#ccc] p-2 rounded-md w-full text-[0.9rem]'></textarea>
                    </div>
                    <button className='bg-indigo-600 text-[#F3F0E8] text-[0.9rem] px-2 py-2 -mt-1 rounded-sm cursor-pointer flex justify-center items-center w-22'>
                        {isAdding ? <LoaderCircle className='animate-spin' /> : "Add Task"}
                    </button>
                </form>
                <section style={{height: 'calc(100vh - 56px)'}} className='px-2 md:pt-0 pt-51 pb-2 md:pb-4 flex flex-col gap-2 w-full max-w-md overflow-y-scroll scrollbar-hidden'>
                    {isLoading ? <LoaderCircle className='animate-spin' /> : tasks && tasks.map(task => <article key={task._id} className='bg-[#F3F0E8] text-[0.8rem] p-3 rounded w-full'>
                        <div className='flex items-center gap-1 font-bold text-[0.9rem]'>
                            <div onClick={() => handleCheck(task._id)}>
                                {task.completed ? <CircleCheck size={15} strokeWidth={4} color='#4f46e5'/> : <Circle size={15} strokeWidth={4} color='#4f46e5'/>}
                            </div>
                            {task.taskname}
                        </div>
                        <p className='mb-1'>{task.note}</p>
                        <div className='flex justify-between text-[0.7rem]'>
                            <p className='text-[#999] mb-1'>{format(new Date(task.createdAt), "hh:mm aaa - do MMM, yyy")}</p>
                            <p className='text-[#999] mb-1'>{task.createdAt !== task.updatedAt && `Updated: ${format(new Date(task.updatedAt), "hh:mm aaa - do MMM, yyy")}`}</p>
                        </div>
                        
                        <div className='flex gap-2'>
                            <Link to={`/edit-task/${task._id}`} className='bg-indigo-600 text-[#F3F0E8] text-[0.9rem] px-2 py-1 rounded-sm w-17 text-center'>Edit</Link>
                            <button onClick={() => handleDelete(task._id)} className='bg-pink-600 text-[#F3F0E8] text-[0.9rem] px-2 py-1 rounded-sm flex justify-center items-center w-17'>{(isDeleting.status && isDeleting.id === task._id) ? <LoaderCircle className='animate-spin' size={18}/> :"Delete"}</button>
                        </div>
                    </article>)}
                </section>
            </main>
        </>
    )
}

export default Dashboard