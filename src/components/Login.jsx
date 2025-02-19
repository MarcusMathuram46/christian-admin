import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { motion } from 'framer-motion'
import Form from 'react-bootstrap/Form'
import { Link } from 'react-router-dom'
import '../styles/Login.css'

function Login() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        'http://localhost:4000/api/user/login',
        loginData
      )
      const info = response.data

      if (info.token) {
        localStorage.setItem('authToken', info.token) // Store token in localStorage
        setMsg('Login successful!')
        navigate('/advertisement') // Redirect to advertisement page after login
      } else {
        setMsg(info.message)
      }
      setLoginData({ email: '', password: '' })
    } catch (error) {
      setMsg(error.response?.data?.message || 'Login failed. Please try again.')
      console.error(error)
    }
  }

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.div
        className="login-box"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.h2
          className="text-center mb-4 text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Login
        </motion.h2>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="text-black">Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="text-black">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </Form.Group>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button className="btn-animated" variant="primary" type="submit">
              Login
            </Button>
          </motion.div>
          <p className="mt-3">
            Don't have an account?{' '}
            <Link className="link-register" to="/register">
              Register here
            </Link>
          </p>
          {msg && (
            <motion.p
              className="text-danger mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {msg}
            </motion.p>
          )}
        </Form>
      </motion.div>
    </motion.div>
  )
}

export default Login
