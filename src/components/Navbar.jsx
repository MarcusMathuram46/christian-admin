import React, { useState } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/Navbar.css'

function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const isAuthenticated = localStorage.getItem('authToken')

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    navigate('/')
  }

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="custom-navbar w-100 d-flex justify-content-between"
    >
      {/* Brand Name (Left) */}
      <motion.div
        className="brand-name"
        whileHover={{ scale: 1.1, rotate: 2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/')}
      >
        KINGDOM CONNECT
      </motion.div>

      {/* Toggle Button (Mobile) */}
      <Navbar.Toggle onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes color="white" /> : <FaBars color="white" />}
      </Navbar.Toggle>

      {/* Navbar Links (Centered) */}
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mx-auto d-flex justify-content-center align-items-center nav-links">
          {isAuthenticated && (
            <>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Nav.Link as={Link} to="/advertisement">
                  ADVERTISEMENT
                </Nav.Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Nav.Link as={Link} to="/news">
                  NEWS
                </Nav.Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Nav.Link as={Link} to="/church">
                  CHURCH
                </Nav.Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Nav.Link as={Link} to="/enquiry">
                  ENQUIRY
                </Nav.Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Nav.Link as={Link} to="/visitors">
                  VISITORS
                </Nav.Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Nav.Link as={Link} to="/video">
                  VIDEO
                </Nav.Link>
              </motion.div>
            </>
          )}
        </Nav>

        {/* Login/Logout Button (Right) */}
        <motion.button
          className="btn-subscribe"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={isAuthenticated ? handleLogout : () => navigate('/')}
        >
          {isAuthenticated ? 'Logout' : 'Login'}
        </motion.button>
      </Navbar.Collapse>

      {/* Mobile Dropdown (Animated) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Nav className="flex-column text-center">
              {isAuthenticated && (
                <>
                  <Nav.Link
                    as={Link}
                    to="/advertisement"
                    onClick={() => setIsOpen(false)}
                  >
                    ADVERTISEMENT
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/news"
                    onClick={() => setIsOpen(false)}
                  >
                    NEWS
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/church"
                    onClick={() => setIsOpen(false)}
                  >
                    CHURCH
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/enquiry"
                    onClick={() => setIsOpen(false)}
                  >
                    ENQUIRY
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/visitors"
                    onClick={() => setIsOpen(false)}
                  >
                    VISITORS
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/video"
                    onClick={() => setIsOpen(false)}
                  >
                    VIDEO
                  </Nav.Link>
                </>
              )}
            </Nav>
          </motion.div>
        )}
      </AnimatePresence>
    </Navbar>
  )
}

export default NavBar
