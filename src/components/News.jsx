import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/News.css'
import { Modal, Button, Table, Form } from 'react-bootstrap'

function News() {
  const [news, setNews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNews, setSelectedNews] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [newNews, setNewNews] = useState({
    title: '',
    description: '',
    image: null,
    type: '',
  })
  const [newsToUpdate, setNewsToUpdate] = useState(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/news')
      setNews(response.data)
    } catch (error) {
      console.error('Error fetching News:', error.message)
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSelectNews = (id) => {
    setSelectedNews((prev) =>
      prev.includes(id) ? prev.filter((ad) => ad !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    setSelectedNews(
      selectedNews.length === news.length ? [] : news.map((ad) => ad._id)
    )
  }

  const handleDeleteSelected = async () => {
    try {
      const token = localStorage.getItem('authToken') // Ensure token is stored
      if (!token) {
        alert('Unauthorized: No token found.')
        return
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      await axios.delete(`http://localhost:4000/api/news?ids=${selectedNews.join(',')}`, {
       config
      })
      alert('Selected News deleted successfully!')
      fetchNews()
      setSelectedNews([])
    } catch (error) {
      console.error('Error deleting News:', error.message)
    }
  }

  const handleDeleteSingle = async (id) => {
    try {
       const token = localStorage.getItem('authToken')
       if (!token) {
         alert('Unauthorized: No token found.')
         return
       }
       const config = {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       }
      await axios.delete(`http://localhost:4000/api/news/${id}`, config)
      alert('News deleted successfully!')
      fetchNews()
    } catch (error) {
      console.error('Error deleting News:', error.message)
    }
  }

  const handleAddNewNews = () => {
    setShowAddModal(true)
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setNewNews({ title: '', description: '', image: null, type: '' })
  }

  const handleUpdateNews = (ad) => {
    setNewsToUpdate({...ad,
      image: ad.image || '', // Ensure image exists
    })
    setShowUpdateModal(true)
  }

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false)
    setNewsToUpdate(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewNews((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setNewNews((prev) => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSaveNewNews = async () => {
    const formData = new FormData()
    formData.append('title', newNews.title)
    formData.append('description', newNews.description)
    if (newNews.image) formData.append('image', newNews.image)

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('authToken')
      if (!token) {
        alert('Authorization token is missing.')
        return
      }
      const response = await axios.post(
        'http://localhost:4000/api/news',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Add the appropriate content type
          },
        }
      )
      alert('New News added successfully!')
      fetchNews()
      handleCloseAddModal()
    } catch (error) {
      console.error(
        'Error adding News:',
        error.response ? error.response.data : error.messagge
      )
    }
  }

  const handleSaveUpdateNews = async () => {
    const formData = new FormData()
    formData.append('title', newsToUpdate.title)
    formData.append('description', newsToUpdate.description)
    if (newsToUpdate.image) formData.append('image', newsToUpdate.image)

    try {
      await axios.patch(
        `http://localhost:4000/api/news/${adToUpdate._id}`,
        formData
      )
      alert('News updated successfully!')
      fetchNews()
      handleCloseUpdateModal()
    } catch (error) {
      console.error('Error updating news:', error.message)
    }
  }

  const filteredNews = news.filter((ad) =>
    ad.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <div className="container">
      <div className="slider-list">
        <h2>News List</h2>
        <div className="d-flex flex-column flex-md-row justify-content-between mb-3">
          <input
            type="text"
            placeholder="Enter your search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control search-bar mb-2 mb-md-0"
          />
          <div className="btn-group">
            <Button className="btn btn-primary" onClick={handleSelectAll}>
              {selectedNews.length === news.length
                ? 'Deselect All'
                : 'Select All'}
            </Button>
            <Button
              className="btn btn-danger ms-2"
              onClick={handleDeleteSelected}
              disabled={!selectedNews.length}
            >
              Delete Selected
            </Button>
            <Button className="btn btn-success ms-2" onClick={handleAddNewNews}>
              Add New
            </Button>
          </div>
        </div>

        <div className="table-container">
          <Table striped bordered hover responsive="sm">
            <thead>
              <tr>
                <th>Select</th>
                <th>Sno</th>
                <th>Heading</th>
                <th>Description</th>
                <th>Image</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.map((ad, index) => (
                <tr key={ad._id}>
                  <td>{index + 1}</td>
                  <td>{ad.title}</td>
                  <td>{ad.description}</td>
                  <td>
                    {ad.image ? (
                      <img src={ad.image} alt={ad.title} className="ad-image" />
                    ) : (
                      'No image'
                    )}
                  </td>
                  <td>{ad.type}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleUpdateNews(ad)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      className="ms-2"
                      onClick={() => handleDeleteSingle(ad._id)} // Added delete button
                    >
                      Delete
                    </Button>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedNews.includes(ad._id)}
                      onChange={() => handleSelectNews(ad._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal for Add New Advertisement */}
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New News</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formAdTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newNews.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                />
              </Form.Group>
              <Form.Group controlId="formAdDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={newNews.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                />
              </Form.Group>
              <Form.Group controlId="formAdImage">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                />
              </Form.Group>
              <Form.Group controlId="formNewsType">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="type"
                  value={newNews.type}
                  onChange={handleInputChange}
                >
                  <option value="">Select Type</option>
                  <option value="important">Important</option>
                  <option value="most-read">Most Read</option>
                  <option value="general">General</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveNewNews}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for Update Advertisement */}
        <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update News</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formAdTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newsToUpdate?.title || ''}
                  onChange={(e) =>
                    setNewsToUpdate({
                      ...newsToUpdate,
                      title: e.target.value,
                    })
                  }
                  placeholder="Title"
                />
              </Form.Group>
              <Form.Group controlId="formAdDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={newsToUpdate?.description || ''}
                  onChange={(e) =>
                    setNewsToUpdate({
                      ...newsToUpdate,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description"
                />
              </Form.Group>
              <Form.Group controlId="formAdImage">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewsToUpdate({
                      ...newsToUpdate,
                      image: e.target.files[0],
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formNewsType">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="type"
                  value={newNews.type}
                  onChange={handleInputChange}
                >
                  <option value="">Select Type</option>
                  <option value="important">Important</option>
                  <option value="most-read">Most Read</option>
                  <option value="general">General</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseUpdateModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveUpdateNews}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

export default News
