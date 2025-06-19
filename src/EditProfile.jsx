import { useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import { useSelector } from 'react-redux'
import { useUpdateUserMutation } from './api/tasks/taskApi'
import { LoaderCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const EditProfile = () => {
    const navigate = useNavigate()
    const [errMsg, setErrMsg] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [updateUser] = useUpdateUserMutation()
    const profileRef = useRef()
    const user = useSelector(state => state.taskSlice.user)
    const [successMsg, setSuccessMsg] = useState(null)
    const [formState, setFormState] = useState({
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        profilephoto: ""
    })

    useEffect(() => {
        const errorTimeout = setTimeout(() => {
            setErrMsg(null)
        }, 4000)

        return () => clearTimeout(errorTimeout)
    }, [errMsg]);

    useEffect(() => {
        const successTimeout = setTimeout(() => {
            setSuccessMsg(null)
        }, 6000)

        return () => clearTimeout(successTimeout)
    }, [successMsg]);

    const handleInputChange = (e) => {
        if(e.target.name === "profilephoto"){
            const url = URL.createObjectURL(e.target.files?.[0]);
            profileRef.current.src = url
            setFormState({...formState, profilephoto: e.target.files?.[0]})
            return
        }
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append('id', formState.id)
        formData.append('firstname', formState.firstname)
        formData.append('lastname', formState.lastname)
        if(formState.profilephoto){
            formData.append('profilephoto', formState.profilephoto)
        }
        try{
            setIsUpdating(true)
            const result = await updateUser(formData);
            if(result){
                setIsUpdating(false)
                navigate("/profile")
            }
        }catch(err){
            console.log(err)
            setIsUpdating(false)
        }
        // setFormState({
        //     firstname: "",
        //     lastname: "",
        //     confirmpassword: ""            
        // })
    }

  return (
    <>
        <Header />
        <main className='flex flex-col items-center justify-center gap-2 pt-16 pb-4 min-h-screen px-5 bg-linear-90 from-indigo-600 to-pink-600'>
            <form onSubmit={(e) => handleSubmit(e)} className='bg-[#F3F0E8] p-4 flex flex-col items-center gap-2 w-full max-w-sm rounded-md'>
                <h2 className='font-pacifico font-medium text-indigo-600 mb-2'>Be apart of Routine Node</h2>
                {errMsg && <p className='text-[0.8rem] text-red-600 bg-red-100 border-2 border-red-600 w-full text-center px-3 py-2 rounded-md'>{errMsg}</p>}
                {successMsg && <p className='text-[0.8rem] text-green-600 bg-green-100 border-2 border-green-600 w-full text-center px-3 py-2 rounded-md'>{successMsg}</p>}
                <div className='w-full flex flex-col items-center'>
                    <img ref={profileRef} src={user.imageUrl || '/profile.jpg'} alt="" />
                    <label htmlFor="profilephoto" className='bg-indigo-600 text-[#F3F0E8] w-full py-2 flex items-center justify-center text-[0.9rem] font-bold cursor-pointer'>Change Photo</label>
                    <input type='file' id="profilephoto" name='profilephoto' onChange={(e) => handleInputChange(e)} placeholder='First name' className='border-1 border-[#ccc] p-2 rounded-md w-full text-[0.9rem] hidden'/>
                </div>
                <div className='w-full'>
                    <label htmlFor="firstname" className='absolute -left-100000'>First name</label>
                    <input type='text' required name='firstname' value={formState.firstname} onChange={(e) => handleInputChange(e)} autoFocus placeholder='First name' className='border-1 border-[#ccc] p-2 rounded-md w-full text-[0.9rem]'/>
                </div>
                <div className='w-full'>
                    <label htmlFor="lastname" className='absolute -left-100000'>First name</label>
                    <input type='text' required name='lastname' value={formState.lastname} onChange={(e) => handleInputChange(e)} placeholder='Last name' className='border-1 border-[#ccc] p-2 rounded-md w-full text-[0.9rem]'/>
                </div>
                <button type="submit" className='bg-pink-600 text-[#F3F0E8] w-full py-2 rounded-md text-[0.9rem] font-bold flex justify-center items-center cursor-pointer'>
                    {isUpdating ? <LoaderCircle className='animate-spin' size={20} /> : "Update"}
                </button>
            </form>
        </main>
    </>
  )
}

export default EditProfile