import React from 'react'
import {Routes,Route,Navigate} from 'react-router-dom'
import HomePage from './page/HomePage'
import LoginPage from './page/LoginPage'
import SignUpPage from './page/SignUpPage'
function App() {
  let authUser=null
  return (
    <div className='flex flex-col items-center justify-start'>
    <Routes>
      <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to={"/"}/>}/>
      <Route path="/signUp" element={authUser?<Navigate to={"/"}/>:<SignUpPage/>}/>
      <Route path="/" element={authUser?<HomePage/>:<Navigate to={"/login"}/>}/>
      
    </Routes>
    </div>
  )
}

export default App
