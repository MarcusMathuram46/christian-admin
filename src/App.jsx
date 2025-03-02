import React, { useState, useEffect } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login'
import Register from './components/Register'
import Advertisements from './components/Advertisements'
import Church from "./components/Church"
import Navbar from './components/Navbar'
import News from './components/News'
import Enquiry from "./components//Enquiry"
import Visitors from "./components/Visitors"
import Video from './components/Video'

import './styles/App.css'

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'))

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthToken(localStorage.getItem('authToken'))
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <Router>
      <div className="App">
        {authToken && <Navbar />} {/* Show Navbar only if logged in */}
        <Routes>
          <Route path="/" element={<Login setAuthToken={setAuthToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/advertisement" element={<Advertisements />} />
          <Route path="/news" element={<News />} />
          <Route path="/church" element={<Church />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/visitors" element={<Visitors />} />
          <Route path="/video" element={<Video />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
