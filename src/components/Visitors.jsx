import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import '../styles/Visitor.css'

function Visitors() {
  const [visitors, setVisitors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVisitors, setSelectedVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Fetch visitors from the backend
  const fetchVisitors = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:4000/api/visitors')
      if (Array.isArray(response.data)) {
        setVisitors(response.data)
      } else {
        setErrorMessage('Unexpected data format received.')
      }
    } catch (error) {
      setErrorMessage('Failed to fetch visitors. Please try again.')
      console.error('Error fetching visitors:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch visitors when the component mounts
    fetchVisitors()

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchVisitors()
    }, 30000)

    // Cleanup the interval on component unmount
    return () => clearInterval(interval)
  }, [])

  // Record a new visitor when the component is loaded
  useEffect(() => {
    const recordVisitor = async () => {
      try {
        const res = await axios.post('http://localhost:4000/api/visitors', {
          // Collect visitor data such as IP, city, region, country, etc.
          ipAddress: '127.0.0.1', // Example IP, replace with actual visitor IP
          city: 'Chennai', // Example city
          region: 'TN', // Example region
          country: 'India', // Example country
          visitTime: new Date(),
        })
      } catch (error) {
        console.error('Error recording visitor:', error)
      }
    }

    recordVisitor()
  }, []) // Empty dependency array ensures this runs only once on mount

  // Search handler
  const handleSearchChange = (e) => setSearchTerm(e.target.value)

  // Select individual visitor
  const handleSelectVisitor = (id) => {
    setSelectedVisitors((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  // Select/Deselect all visitors
  const handleSelectAll = () => {
    setSelectedVisitors(
      selectedVisitors.length === visitors.length
        ? []
        : visitors.map((v) => v._id)
    )
  }

  // Delete selected visitors
  const handleDeleteSelected = async () => {
    if (!selectedVisitors.length) return

    if (
      window.confirm('Are you sure you want to delete the selected visitors?')
    ) {
      setDeleteLoading(true)
      try {
        await axios.delete('http://localhost:5000/api/visitors', {
          params: { ids: selectedVisitors },
        })
        setVisitors((prevVisitors) =>
          prevVisitors.filter(
            (visitor) => !selectedVisitors.includes(visitor._id)
          )
        )
        setSelectedVisitors([])
        alert('Selected visitors deleted successfully!')
      } catch (error) {
        setErrorMessage('Error deleting selected visitors. Please try again.')
        console.error('Error deleting visitors:', error.message)
      } finally {
        setDeleteLoading(false)
      }
    }
  }

  // Filter visitors based on search term
  const filteredVisitors = visitors.filter((visitor) =>
    [visitor.ipAddress, visitor.city, visitor.region, visitor.country].some(
      (field) => field && field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
  return (
    <div className="visitor-container">
      <div className="visitor-list">
        <h2 className="text-center mb-4">Visitor List</h2>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}

        {/* Search Bar and Controls */}
        <div className="visitor-list-controls d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            placeholder="Search visitors..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control search-bar"
            aria-label="Search visitors"
          />
          <div>
            <button
              className="btn btn-primary me-2"
              onClick={handleSelectAll}
              aria-label={
                selectedVisitors.length === visitors.length
                  ? 'Deselect all visitors'
                  : 'Select all visitors'
              }
            >
              {selectedVisitors.length === visitors.length
                ? 'Deselect All'
                : 'Select All'}
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDeleteSelected}
              disabled={!selectedVisitors.length || deleteLoading}
              aria-label="Delete selected visitors"
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <p>Loading visitors...</p>
        ) : (
          <table className="table table-hover table-bordered text-center">
            <thead className="table-primary">
              <tr>
                <th scope="col">Sno</th>
                <th scope="col">IP Address</th>
                <th scope="col">City</th>
                <th scope="col">Region</th>
                <th scope="col">Country</th>
                <th scope="col">Visit Time</th>
                <th scope="col">Select</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.length > 0 ? (
                filteredVisitors.map((visitor, index) => (
                  <tr key={visitor._id}>
                    <td>{index + 1}</td>
                    <td>{visitor.ipAddress}</td>
                    <td>{visitor.city}</td>
                    <td>{visitor.region}</td>
                    <td>{visitor.country}</td>
                    <td>{new Date(visitor.visitTime).toLocaleString()}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedVisitors.includes(visitor._id)}
                        onChange={() => handleSelectVisitor(visitor._id)}
                        aria-label={`Select visitor ${visitor.ipAddress}`}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No visitors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Visitors
