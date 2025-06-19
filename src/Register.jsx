import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from './components/Header'
import { useRegisterUserMutation } from './api/auth/authApi'
import { LoaderCircle } from 'lucide-react'

const Register = () => {
    const [registerUser] = useRegisterUserMutation();
    const [showPassword, setShowPassword] = useState(false)
    const [errMsg, setErrMsg] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmpassword: ""
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.password !== formData.confirmpassword){
            setErrMsg("Passwords don't match!")
            return
        }
        setIsLoading(true)
        const result = await registerUser(formData);
        if(result)setIsLoading(false)
        if(result?.data){
            setSuccessMsg("We've sent a verification message to your email!");
        }
        setFormData({
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirmpassword: ""            
        })
    }

  return (
    <>
        <Header />
        <main className='flex flex-col items-center justify-center gap-2 h-screen px-5 bg-linear-90 from-indigo-600 to-pink-600'>
            <form onSubmit={(e) => handleSubmit(e)} className='bg-[#F3F0E8] p-4 flex flex-col items-center gap-2 w-full max-w-[21rem] rounded-md'>
                <h2 className='font-pacifico font-medium text-indigo-600 mb-2'>Be apart of Routine Node</h2>
                {errMsg && <p className='text-[0.8rem] text-red-600 bg-red-100 border-2 border-red-600 w-full text-center px-3 py-2 rounded-md'>{errMsg}</p>}
                {successMsg && <p className='text-[0.8rem] text-green-600 bg-green-100 border-2 border-green-600 w-full text-center px-3 py-2 rounded-md'>{successMsg}</p>}
                <div className='w-full'>
                    <label htmlFor="firstname" className='absolute -left-100000'>First name</label>
                    <input type='text' required name='firstname' value={formData.firstname} onChange={(e) => handleInputChange(e)} autoFocus placeholder='First name' className='border-1 border-[#ccc] p-2 rounded-md w-full text-[0.9rem]'/>
                </div>
                <div className='w-full'>
                    <label htmlFor="lastname" className='absolute -left-100000'>First name</label>
                    <input type='text' required name='lastname' value={formData.lastname} onChange={(e) => handleInputChange(e)} placeholder='Last name' className='border-1 border-[#ccc] p-2 rounded-md w-full text-[0.9rem]'/>
                </div>
                <div className='w-full'>
                    <label htmlFor="email" className='absolute -left-100000'>First name</label>
                    <input type='email' name='email' required value={formData.email} onChange={(e) => handleInputChange(e)} placeholder='Email' className='border-1 border-[#ccc] p-2 rounded-md w-full text-[0.9rem]'/>
                </div>
                <div className='w-full'>
                    <label htmlFor="password" className='absolute -left-100000'>First name</label>
                    <input type={showPassword ? "text" : "password"} name='password' required value={formData.password} onChange={(e) => handleInputChange(e)} placeholder='Password' className='border-1 border-[#ccc] p-2 rounded-md w-full text-[0.9rem]'/>
                </div>
                <div className='w-full'>
                    <label htmlFor="confirmpassword" className='absolute -left-100000'>First name</label>
                    <input type={showPassword ? "text" : "password"} name='confirmpassword' required value={formData.confirmpassword} onChange={(e) => handleInputChange(e)} placeholder='Confirm password' className='border-1 border-[#ccc] p-2 rounded-md w-full text-[0.9rem]'/>
                </div>
                <div className='w-full flex gap-1 text-[0.9rem]'>
                    <input type="checkbox" htmlFor="showpassword" onChange={() => setShowPassword(prev => !prev)}/>
                    <label htmlFor="showpassword">Show Password</label>
                </div>
                <button type="submit" className='bg-pink-600 text-[#F3F0E8] w-full py-2 rounded-md text-[0.9rem] font-bold cursor-pointer flex justify-center items-center'>
                    {isLoading ? <LoaderCircle className='animate-spin'/> : "Register"}
                </button>
                <div className='text-[0.8rem] flex gap-1'>
                    <p>Already have an account?</p>
                    <Link to="/login" className='font-semibold underline underline-offset-2 cursor-pointer'>Login</Link>
                </div>
            </form>
        </main>
    </>
  )
}

export default Register