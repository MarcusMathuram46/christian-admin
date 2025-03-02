import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/Enquiry.css'
function Enquiry() {
  const [enquiries, setEnquiries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEnquiries, setSelectedEnquiries] = useState(new Set())

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/enquiry')
      setEnquiries(response.data)
    } catch (error) {
      console.error('Error fetching enquiry data:', error)
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  const handleSelect = (id) => {
    const updatedSelection = new Set(selectedEnquiries)
    updatedSelection.has(id)
      ? updatedSelection.delete(id)
      : updatedSelection.add(id)
    setSelectedEnquiries(updatedSelection)
  }

  const handleSelectAll = () => {
    if (selectedEnquiries.size === enquiries.length) {
      setSelectedEnquiries(new Set())
    } else {
      setSelectedEnquiries(new Set(enquiries.map((enquiry) => enquiry._id)))
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await axios.delete('http://localhost:4000/api/enquiry', {
        data: { ids: Array.from(selectedEnquiries) },
      })
      setEnquiries(
        enquiries.filter((enquiry) => !selectedEnquiries.has(enquiry._id))
      )
      setSelectedEnquiries(new Set())
      alert('Selected enquiries deleted successfully')
    } catch (error) {
      console.error('Error deleting selected enquiries:', error)
      alert('Failed to delete selected enquiries.')
    }
  }

  const filteredEnquiries = enquiries.filter(
    (enquiry) =>
      enquiry.name.toLowerCase().includes(searchQuery) ||
      enquiry.email.toLowerCase().includes(searchQuery) ||
      enquiry.subject.toLowerCase().includes(searchQuery)
  )
  return (
    <div className="enquiry-container">
      <div className="enquiry-list">
        <h2 className="text-center mb-4">ENQUIRED LIST</h2>
        <div className="controls d-flex flex-wrap justify-content-between align-items-center mb-3">
          <input
            type="text"
            placeholder="Enter your search..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input form-control me-2 mb-2 mb-md-0"
          />
          <div className="button-group d-flex flex-wrap">
            <button
              onClick={handleSelectAll}
              className="btn btn-outline-primary me-2 mb-2"
            >
              Select All
            </button>
            <button
              onClick={handleDeleteSelected}
              className="btn btn-danger mb-2"
              disabled={selectedEnquiries.size === 0}
            >
              Delete Selected
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedEnquiries.size === enquiries.length}
                  />
                </th>
                <th>Sno</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Subject</th>
                <th>Address</th>
                <th>Message</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enquiry, index) => (
                  <tr key={enquiry._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedEnquiries.has(enquiry._id)}
                        onChange={() => handleSelect(enquiry._id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{enquiry.name}</td>
                    <td>{enquiry.email}</td>
                    <td>{enquiry.mobile}</td>
                    <td>{enquiry.subject}</td>
                    <td>{enquiry.address}</td>
                    <td>{enquiry.message}</td>
                    <td>
                      {new Date(enquiry.time || Date.now()).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Enquiry
