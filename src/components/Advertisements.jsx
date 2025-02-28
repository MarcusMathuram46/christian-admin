import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Advertisement.css'
import { Modal, Button, Table, Form } from 'react-bootstrap'

function Advertisements() {
  const [advertisements, setAdvertisements] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAds, setSelectedAds] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    image: null,
  })
  const [adToUpdate, setAdToUpdate] = useState(null)
  useEffect(() => {
    fetchAdvertisements()
  }, [])
  const fetchAdvertisements = async () => {
    try {
      const response = await axios.get(
        'http://localhost:4000/api/advertisements'
      )
      setAdvertisements(response.data)
    } catch (error) {
      console.error('Error fetching advertisements:', error.message)
    }
  }
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }
  const handleSelectAd = (id) => {
    setSelectedAds((prev) =>
      prev.includes(id) ? prev.filter((ad) => ad !== id) : [...prev, id]
    )
  }
  const handleSelectAll = () => {
    setSelectedAds(
      selectedAds.length === advertisements.length
        ? []
        : advertisements.map((ad) => ad._id)
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

      await axios.delete(
        `http://localhost:4000/api/advertisements?ids=${selectedAds.join(',')}`,
        config
      )

      alert('Selected advertisements deleted successfully!')
      fetchAdvertisements()
      setSelectedAds([])
    } catch (error) {
      console.error(
        'Error deleting advertisements:',
        error.response?.data || error.message
      )
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
      await axios.delete(
        `http://localhost:4000/api/advertisements/${id}`,
        config
      )
      alert('Advertisement deleted successfully!')
      fetchAdvertisements()
    } catch (error) {
      console.error(
        'Error deleting advertisement:',
        error.response?.data || error.message
      )
    }
  }
  const handleAddNewAdvertisement = () => {
    setShowAddModal(true)
  }
  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setNewAd({ title: '', description: '', image: null })
  }
  const handleUpdateAd = (ad) => {
    setAdToUpdate({
      ...ad,
      image: ad.image || '', // Ensure image exists
    })
    setShowUpdateModal(true)
  }
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false)
    setAdToUpdate(null)
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewAd((prev) => ({ ...prev, [name]: value }))
  }
  const handleFileChange = (e) => {
    setNewAd((prev) => ({ ...prev, image: e.target.files[0] }))
  }
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0]
  //   setAdToUpdate((prev) => ({
  //     ...prev,
  //     image: file || prev.image, // If no new file, keep old image
  //   }))
  // }
  const handleSaveNewAd = async () => {
    const formData = new FormData()
    formData.append('title', newAd.title)
    formData.append('description', newAd.description)
    if (newAd.image) formData.append('image', newAd.image)
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('authToken')
      if (!token) {
        alert('Authorization token is missing.')
        return
      }
      // Make the POST request to the backend
      const response = await axios.post(
        'http://localhost:4000/api/advertisements',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Add the appropriate content type
          },
        }
      )
      // Handle successful response
      alert('New advertisement added successfully!')
      fetchAdvertisements() // Refresh advertisements
      handleCloseAddModal() // Close the modal
    } catch (error) {
      console.error(
        'Error adding advertisement:',
        error.response ? error.response.data : error.message
      )
    }
  }
  const handleSaveUpdateAd = async () => {
    if (!adToUpdate) return
    const formData = new FormData()
    formData.append('title', adToUpdate.title)
    formData.append('description', adToUpdate.description)
    if (adToUpdate.image instanceof File) {
      formData.append('image', adToUpdate.image) // Append new image if selected
    } else {
      formData.append('existingImage', adToUpdate.image) // Preserve existing image
    }
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        alert('Authorization token is missing.')
        return
      }
      await axios.patch(
        `http://localhost:4000/api/advertisements/${adToUpdate._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      alert('Advertisement updated successfully!')
      fetchAdvertisements()
      handleCloseUpdateModal()
    } catch (error) {
      console.error(
        'Error updating advertisement:',
        error.response?.data || error.message
      )
    }
  }
  const filteredAds = advertisements.filter((ad) =>
    ad.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <div className="container">
      <div className="slider-list">
        <h2>Advertisement List</h2>
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
              {selectedAds.length === advertisements.length
                ? 'Deselect All'
                : 'Select All'}
            </Button>
            <Button
              className="btn btn-danger"
              onClick={handleDeleteSelected}
              disabled={selectedAds.length === 0}
            >
              Delete Selected
            </Button>
            <Button
              className="btn btn-success"
              onClick={handleAddNewAdvertisement}
            >
              Add New Advertisement
            </Button>
          </div>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Select</th>
              <th>Sno</th>
              <th>Title</th>
              <th>Description</th>
              <th>Image</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAds.map((ad) => (
              <tr key={ad._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedAds.includes(ad._id)}
                    onChange={() => handleSelectAd(ad._id)}
                  />
                </td>
                <td>{ad.title}</td>
                <td>{ad.description}</td>
                <td>
                  <img src={ad.image} alt={ad.title} width="50" height="50" />
                </td>
                <td>{ad.type}</td>
                <td>
                  <Button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleUpdateAd(ad)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteSingle(ad._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {/* Add Advertisement Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Advertisement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newAd.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newAd.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Form.Group controlId="formAdsType">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={newAd.type}
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
          <Button variant="primary" onClick={handleSaveNewAd}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Update Advertisement Modal */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Advertisement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Title Input */}
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={adToUpdate?.title || ''}
                onChange={(e) =>
                  setAdToUpdate((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </Form.Group>

            {/* Description Textarea */}
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={adToUpdate?.description || ''}
                onChange={(e) =>
                  setAdToUpdate((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Form.Group>

            {/* Image Upload */}
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange} // Assuming handleFileChange is defined
              />
            </Form.Group>
            <Form.Group controlId="formAdsType">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={newAd.type}
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
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveUpdateAd}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Advertisements
