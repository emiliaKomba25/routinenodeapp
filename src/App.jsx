import { Route, Routes, useNavigate } from "react-router-dom"
import Home from "./Home"
import Register from "./Register"
import Login from "./Login"
import Dashboard from "./Dashboard"
import EditTask from "./EditTask"
import ProtectedRoutes from "./components/ProtectedRoutes"
import { useEffect } from "react"
import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { useDispatch } from "react-redux"
import { clearCredentials, setCredentials, setIsAuthLoading } from "./api/auth/authSlice"
import Profile from "./Profile"
import EditProfile from "./EditProfile"


function App() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: "http://localhost:5000",
      credentials: "include"
    })
    const refreshApp = async () => {
      dispatch(setIsAuthLoading(true))
      const refreshResult = await rawBaseQuery('/refresh', {}, {});
      if(refreshResult?.data){
        dispatch(setCredentials(refreshResult?.data));
      }
      if(refreshResult?.error){
        dispatch(clearCredentials());
      }
    }
    refreshApp();
  }, [dispatch, navigate])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login/:token" element={<Login />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/edit-task/:id" element={<EditTask />} />
      </Route>
    </Routes>
  )
}

export default App
