import { LoaderCircle } from 'lucide-react';
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
    const {token, isAuthLoading} = useSelector(state => state.authSlice);
    if(isAuthLoading) return <div className='w-full h-screen flex items-center justify-center'><img src='/logo.png' className='animate-pulse w-25' /></div>
    return token ? <Outlet /> : <Navigate to="/login" replace/>
}

export default ProtectedRoutes