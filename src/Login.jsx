import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from './components/Header'
import { useLoginUserMutation, useVerifyUserQuery } from './api/auth/authApi'
import { useDispatch } from 'react-redux'
import { setCredentials, setIsAuthLoading } from './api/auth/authSlice'
import { skipToken } from '@reduxjs/toolkit/query'
import { LoaderCircle } from 'lucide-react'

const Login = () => {
    const navigate = useNavigate()
    const { token } = useParams()
    const dispatch = useDispatch()
    const verifyResult = useVerifyUserQuery(token ?? skipToken)
    const [loginUser] = useLoginUserMutation();
    const [showPassword, setShowPassword] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
        }, 4000)

        return () => clearTimeout(successTimeout)
    }, [successMsg]);

    useEffect(() => {
        if(verifyResult.data){
            setSuccessMsg(verifyResult.data.message)
        }
    }, [verifyResult]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        dispatch(setIsAuthLoading(true))
        const result = await loginUser(formData)
        if(result)setIsLoading(false)
        if(result?.data){
            dispatch(setCredentials(result?.data))
            setFormData({
                email: "",
                password: ""          
            })
            navigate('/dashboard')
        }
    }

  return (
    <>
        <Header />
        <main className='flex flex-col items-center justify-center gap-2 h-screen px-5 bg-linear-90 from-indigo-600 to-pink-600'>
            <form onSubmit={(e) => handleSubmit(e)} className='bg-[#F3F0E8] p-4 flex flex-col items-center gap-2 w-full max-w-[21rem] rounded-md'>
                <h2 className='font-pacifico font-medium text-indigo-600 mb-2'>Be apart of Routine Node</h2>
                {errMsg && <p className='-mt-1 text-[0.8rem] text-red-600 bg-red-100 border-2 border-red-600 w-full text-center px-3 py-2 rounded-md'>{errMsg}</p>}
                {successMsg && <p className='-mt-1 text-[0.8rem] text-green-600 bg-green-100 border-2 border-green-600 w-full text-center px-3 py-2 rounded-md'>{successMsg}</p>}
                <div className='w-full'>
                    <label htmlFor="email" className='absolute -left-100000'>First name</label>
                    <input type='email' name='email' required value={formData.email} autoFocus onChange={(e) => handleInputChange(e)} placeholder='Email' className='border-1 border-[#ccc] p-2 rounded-md w-full text-[0.9rem]'/>
                </div>
                <div className='w-full'>
                    <label htmlFor="password" className='absolute -left-100000'>First name</label>
                    <input type={showPassword ? "text" : "password"} name='password' required value={formData.password} onChange={(e) => handleInputChange(e)} placeholder='Password' className='border-1 border-[#ccc] p-2 rounded-md w-full text-[0.9rem]'/>
                </div>
                <div className='w-full flex gap-1 text-[0.9rem]'>
                    <input type="checkbox" htmlFor="showpassword" onChange={() => setShowPassword(prev => !prev)}/>
                    <label htmlFor="showpassword">Show Password</label>
                </div>
                <button type="submit" className='bg-pink-600 text-[#F3F0E8] w-full py-2 rounded-md text-[0.9rem] font-bold flex items-center justify-center cursor-pointer'>
                    {isLoading ? <LoaderCircle className='animate-spin' /> : "Log in"}
                </button>
                <div className='text-[0.8rem] flex gap-1'>
                    <p>Don't have an account?</p>
                    <Link to="/register" className='font-semibold underline underline-offset-2 cursor-pointer'>Register</Link>
                </div>
            </form>
        </main>
    </>
  )
}

export default Login