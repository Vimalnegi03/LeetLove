import React from 'react'
import {Routes,Route,Navigate} from 'react-router-dom'
import HomePage from './page/HomePage'
import LoginPage from './page/LoginPage'
import SignUpPage from './page/SignUpPage'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import Layout from './layout/Layout'
import AdminRoute from './components/AdminRoute'
import AddProblem from './page/AddProblemPage'
import ProblemPage from './page/ProblemPage'
function App() {
  const {authUser,checkAuth,isCheckingAuth} = useAuthStore()
  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if (isCheckingAuth && !authUser)
  {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  
  return (
    <div className='flex flex-col items-center justify-start'>
     <Toaster/>
    <Routes>
      <Route path="/" element={<Layout />}>
          <Route
            index
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
        </Route>
      <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to={"/"}/>}/>
      <Route path="/signUp" element={authUser?<Navigate to={"/"}/>:<SignUpPage/>}/>
       <Route
          path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to={"/login"} />}
        />
       <Route element={<AdminRoute />}>
          <Route
            path="/add-problem"
            element={authUser ? <AddProblem /> : <Navigate to="/login" />}
          />
        </Route>
    </Routes>
    </div>
  )
}

export default App
