import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from './components/Header'
import { Circle, CircleCheck, LoaderCircle } from 'lucide-react'
import { useGetSingleTaskQuery, useUpdateTaskMutation } from './api/tasks/taskApi'
import { skipToken } from '@reduxjs/toolkit/query'

const EditTask = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const singleTask = useGetSingleTaskQuery(id ?? skipToken)
    const [updateTask] = useUpdateTaskMutation()
    const [errMsg, setErrMsg] = useState(null)
    const [isUpdating, setIsUpdating] = useState(null)
    const [formData, setFormData] = useState({
        taskname: "",
        note: "",
        id
    })

    useEffect(() => {
        if(singleTask.data){
            setFormData(prev => ({...prev, taskname: singleTask.data.taskname, note: singleTask.data.note}))
        }
    }, [singleTask])

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
            setIsUpdating(true)
            const result = await updateTask(formData);
            if(result.data){
                setIsUpdating(false)
                setFormData({
                    taskname: "",
                    note: "",
                    id: ""         
                })
                navigate("/dashboard")
            }
        } catch(err) {
            setIsUpdating(false)
            console.log(err);
        }
    }
    
  return (
    <>
        <Header />
        <main className='flex flex-col items-center justify-center gap-2 h-screen pt-14 px-3 bg-linear-90 from-indigo-600 to-pink-600'>
            <form onSubmit={(e) => handleSubmit(e)} className='bg-[#F3F0E8] p-4 flex flex-col items-end gap-2 w-full shadow-sm max-w-sm rounded-xl'>
                <h2 className='font-bold mb-2 w-full text-center'>Update Task</h2>
                {errMsg && <p className='text-[0.9rem] text-red-600 bg-red-100 border-2 border-red-600 w-full text-center px-3 py-2 rounded-md'>{errMsg}</p>}
                <div className='w-full'>
                    <label htmlFor="taskname" className='absolute -left-100000'>Task name</label>
                    <input type='taskname' name='taskname' required value={formData.taskname} onChange={(e) => handleInputChange(e)} autoFocus placeholder='Task name' className='border-1 border-[#ccc] p-2 rounded-md w-full text-[0.9rem]'/>
                </div>
                <div className='w-full'>
                    <label htmlFor="note" className='absolute -left-100000'>Note</label>
                    <textarea type='note' name='note' required value={formData.note} onChange={(e) => handleInputChange(e)} placeholder='Note' className='border-1 border-[#ccc] p-2 rounded-md w-full text-[0.9rem]'></textarea>
                </div>
                <button className='bg-indigo-600 text-[#F3F0E8] text-[0.9rem] px-2 py-2 -mt-1 rounded-sm w-18 cursor-pointer flex justify-center items-center'>
                    {isUpdating ? <LoaderCircle className='animate-spin' size={18}/> : "Update"}
                </button>
            </form>
        </main>
    </>
  )
}

export default EditTask