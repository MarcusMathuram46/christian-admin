import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
  Table,
  Form,
  Button,
  Modal,
  Container,
  Row,
  Col,
  Spinner,
} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Church.css' // Your custom styles

const Church = () => {
  const [churches, setChurches] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editChurch, setEditChurch] = useState(null)
  const [selectedChurches, setSelectedChurches] = useState([]) // For bulk delete
  const [newChurch, setNewChurch] = useState({
    name: '',
    pastor: '',
    description: '',
    image: null,
    phone: '',
    location: '',
    address: '',
  })

  useEffect(() => {
    fetchChurches()
  }, [])

  const fetchChurches = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:4000/api/churches')
      setChurches(response.data)
    } catch (error) {
      console.error('Error fetching churches:', error.message)
      alert('Failed to fetch churches.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => setSearch(e.target.value)

  const handleInputChange = (e) => {
    setNewChurch({ ...newChurch, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    setNewChurch({ ...newChurch, image: e.target.files[0] })
  }

  const openModal = (church = null) => {
    setEditChurch(church)
    setNewChurch(
      church
        ? { ...church, image: church.image || '' } // Preserve existing image
        : {
            name: '',
            pastor: '',
            description: '',
            image: null,
            phone: '',
            location: '',
            address: '',
          }
    )
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditChurch(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken')
    if (!token) return alert('Unauthorized: Please log in.')

    const formData = new FormData()
    Object.keys(newChurch).forEach((key) => {
      formData.append(key, newChurch[key])
    })

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } }
      if (editChurch) {
        await axios.patch(
          `http://localhost:4000/api/churches/${editChurch._id}`,
          formData,
          config
        )
        alert('Church updated successfully!')
      } else {
        await axios.post('http://localhost:4000/api/churches', formData, config)
        alert('New church added successfully!')
      }
      fetchChurches()
      closeModal()
    } catch (error) {
      console.error('Error saving church:', error)
      alert('Failed to save church.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this church?')) return
    const token = localStorage.getItem('authToken')
    if (!token) return alert('Unauthorized: Please log in.')

    try {
      await axios.delete(`http://localhost:4000/api/churches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Church deleted successfully!')
      fetchChurches()
    } catch (error) {
      console.error('Error deleting church:', error)
      alert('Failed to delete church.')
    }
  }

  const handleBulkDelete = async () => {
    if (!selectedChurches.length) return alert('No churches selected.')
    if (!window.confirm('Delete selected churches?')) return

    const token = localStorage.getItem('authToken')
    if (!token) return alert('Unauthorized: Please log in.')

    try {
      await axios.delete(
        `http://localhost:4000/api/churches?ids=${selectedChurches.join(',')}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Selected churches deleted successfully!')
      fetchChurches()
      setSelectedChurches([])
    } catch (error) {
      console.error('Error deleting churches:', error)
      alert('Failed to delete churches.')
    }
  }

  const handleSelectChurch = (id) => {
    setSelectedChurches((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const filteredChurches = churches.filter(
    (church) =>
      church.name.toLowerCase().includes(search.toLowerCase()) ||
      church.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Container className="church-container">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mt-4"
      >
        Church Management
      </motion.h2>

      <Row className="my-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by Name or Location..."
            value={search}
            onChange={handleSearch}
          />
        </Col>
        <Col md={6} className="text-end">
          <Button variant="primary" onClick={() => openModal()}>
            Add Church
          </Button>{' '}
          <Button variant="danger" onClick={handleBulkDelete}>
            Delete Selected
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    checked={selectedChurches.length === churches.length}
                    onChange={() =>
                      setSelectedChurches(
                        selectedChurches.length === churches.length
                          ? []
                          : churches.map((c) => c._id)
                      )
                    }
                  />
                </th>
                <th>Name</th>
                <th>Pastor</th>
                <th>Description</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Address</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredChurches.map((church) => (
                <motion.tr key={church._id} whileHover={{ scale: 1.02 }}>
                  <td>
                    <Form.Check
                      checked={selectedChurches.includes(church._id)}
                      onChange={() => handleSelectChurch(church._id)}
                    />
                  </td>
                  <td>{church.name}</td>
                  <td>{church.pastor}</td>
                  <td>{church.description}</td>
                  <td>{church.phone}</td>
                  <td>{church.location}</td>
                  <td>{church.address}</td>
                  <td>
                    <img src={church.image} alt={church.name} className="church-img" />
                  </td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => openModal(church)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(church._id)}>
                      Delete
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
        </motion.div>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editChurch ? 'Edit Church' : 'Add Church'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newChurch.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pastor</Form.Label>
              <Form.Control
                type="text"
                name="pastor"
                value={newChurch.pastor}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newChurch.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newChurch.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newChurch.location}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newChurch.address}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editChurch ? 'Update' : 'Add'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default Church
