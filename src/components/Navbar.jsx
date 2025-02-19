import React, { useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/Navbar.css'

function NavBar() {
  const [toggleOpen, setToggleOpen] = useState(false)
  const navigate = useNavigate()

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken') // Clear the auth token stored in localStorage
    navigate('/') // Redirect to the login page
  }

  const handleLoginClick = () => {
    navigate('/') // Navigate to the Login page
  }

  const handleBrandClick = () => {
    navigate('/') // Navigate to Home when the brand is clicked
  }

  const toggleVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1 },
  }

  return (
    <div className="navbar-wrapper">
      <Navbar expand="lg" fixed="top" className="custom-navbar">
        <Container className="first-row">
          <motion.div
            className="left-section d-flex align-items-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              onClick={() => setToggleOpen((prev) => !prev)}
            >
              {!toggleOpen && <span>☰</span>}
            </Navbar.Toggle>
            {localStorage.getItem('authToken') ? (
              <button className="btn-subscribe ms-3" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className="btn-subscribe ms-3" onClick={handleLoginClick}>
                Login
              </button>
            )}
          </motion.div>

          <motion.div
            className="brand-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="brand-name"
              onClick={handleBrandClick}
              whileHover={{
                scale: 1.1,
                rotate: 3,
                textShadow: '0px 0px 8px rgba(255, 255, 255, 0.9)',
              }}
              whileTap={{ scale: 0.9 }}
              style={{ cursor: 'pointer' }}
            >
              KINGDOM CONNECT
            </motion.h1>
          </motion.div>
        </Container>
      </Navbar>

      <motion.div
        className="nav-links-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Container>
          <Nav className="justify-content-center nav-links">
            {localStorage.getItem('authToken') && (
              <>
                <Nav.Link as={Link} to="/advertisement">
                  ADVERTISEMENT
                </Nav.Link>
                <Nav.Link as={Link} to="/news">
                  NEWS
                </Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </motion.div>

      <AnimatePresence>
        {toggleOpen && (
          <motion.div
            className="toggle-bar"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{
              x: toggleOpen ? '0%' : '-100%',
              opacity: toggleOpen ? 1 : 0,
            }}
            exit="hidden"
            variants={toggleVariants}
            transition={{ duration: 0.5 }}
          >
            <div className="toggle-bar">
              <div
                className="close-icon"
                onClick={() => setToggleOpen(false)}
                style={{ fontSize: '2rem', cursor: 'pointer' }}
              >
                <FaTimes />
              </div>

              <Nav className="navbar-nav flex-column mt-3">
                {localStorage.getItem('authToken') && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/advertisement"
                      onClick={() => setToggleOpen(false)}
                      className="active"
                    >
                      ADVERTISEMENT
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/news"
                      onClick={() => setToggleOpen(false)}
                    >
                      NEWS
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NavBar
