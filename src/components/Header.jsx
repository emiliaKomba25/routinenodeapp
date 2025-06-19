import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useLogoutUserMutation } from "../api/auth/authApi";
import { clearCredentials } from "../api/auth/authSlice";
import { LoaderCircle } from "lucide-react";
import { useGetUserQuery } from "../api/tasks/taskApi";
import { skipToken } from "@reduxjs/toolkit/query";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => state.authSlice.user)
    const userData = useGetUserQuery(user?.id ?? skipToken)
    const [logoutUser] = useLogoutUserMutation();
    const [isLoggingout, setIsLoggingout] = useState(false)
    const handleLogout = async () => {
        try{
            setIsLoggingout(true)
            const logoutResult = await logoutUser()
            if(logoutResult?.data){
                setIsLoggingout(false)
                dispatch(clearCredentials())
                navigate("/login");
            }
        } catch (err) {
            setIsLoggingout(false)
            console.log(err)
        }
    }
    return (
        <header className='flex justify-center items-center fixed w-full px-4 h-14 shadow-sm bg-[#F3F0E8] border-b-1 border-[#ccc]'>
            <div className="w-full max-w-7xl flex justify-between items-center">
                <Link to="/dashboard">
                <h1 className='font-pacifico text-indigo-600'>Routine Node</h1>
            </Link>
            {(location.pathname !== '/login' && location.pathname !== '/dashboard' && location.pathname !== '/profile' && location.pathname !== '/edit-profile' && !location.pathname.includes('/edit-task')) && <Link to="/login" className='bg-pink-600 text-[#F3F0E8] text-[0.9rem] px-2 py-1 rounded-sm cursor-pointer'>
                Login
            </Link>}
            {(location.pathname === '/dashboard' || location.pathname === '/profile' || location.pathname === '/edit-profile' || location.pathname.includes('/edit-task')) && <div className="flex gap-2">
                <Link to="/profile">
                    <img src={userData?.data?.imageUrl ?? "/profile.jpg"} width="40px" height="40px" className="rounded-full w-10 h-10 object-cover object-top"/>
                </Link>
                <button onClick={handleLogout} className='bg-pink-600 text-[#F3F0E8] text-[0.9rem] px-2 py-1 rounded-sm flex justify-center items-center cursor-pointer w-17'>
                    {isLoggingout ? <LoaderCircle className="animate-spin" size={18} /> : "Logout"}
                </button>
            </div>}</div>
        </header>
    )
}
export default Header