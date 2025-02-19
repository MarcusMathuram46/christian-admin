import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login'
import './styles/App.css'
import Register from './components/Register'
import Advertisements from './components/Advertisements'
import Navbar from './components/Navbar'
import News from './components/News'

function App() {
  const authToken = localStorage.getItem('authToken')

  return (
    <Router>
      <div className="App">
        {authToken && <Navbar />} {/* Show Navbar only if logged in */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/advertisement" element={<Advertisements />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
