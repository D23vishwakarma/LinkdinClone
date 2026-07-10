import { useState } from 'react'

import './App.css'
import { Navigate, Route, Router, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useContext } from 'react'
import { userContext } from './context/UserContext'
import Network from './pages/Network'
function App() {
  const [count, setCount] = useState(0)
  const {userData}=useContext(userContext)
  return (
    <Routes>
      <Route path='/' element={userData? <Home/>: <Navigate to="/login"/>}/>
      <Route path='/login' element={userData?<Navigate to="/"/>:<Login/>}/>
      <Route path='/signup' element={userData?<Navigate to="/"/>:<Signup/>}/>
      <Route path='/network' element={userData?<Network/>:<Login/>}/>

    </Routes>
  )
}

export default App
