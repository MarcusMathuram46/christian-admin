import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/News.css";
import { Modal, Button, Table, Form } from "react-bootstrap";

function News() {
    const [advertisements, setAdvertisements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAds, setSelectedAds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [adToUpdate, setAdToUpdate] = useState(null);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/advertisements");
      setAdvertisements(response.data);
    } catch (error) {
      console.error("Error fetching advertisements:", error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectAd = (id) => {
    setSelectedAds((prev) =>
      prev.includes(id) ? prev.filter((ad) => ad !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedAds(
      selectedAds.length === advertisements.length
        ? []
        : advertisements.map((ad) => ad._id)
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await axios.delete("http://localhost:4000/api/advertisements", {
        data: { ids: selectedAds },
      });
      alert("Selected advertisements deleted successfully!");
      fetchAdvertisements();
      setSelectedAds([]);
    } catch (error) {
      console.error("Error deleting advertisements:", error.message);
    }
  };

  const handleDeleteSingle = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/advertisements/${id}`);
      alert("Advertisement deleted successfully!");
      fetchAdvertisements();
    } catch (error) {
      console.error("Error deleting advertisement:", error.message);
    }
  };

  const handleAddNewAdvertisement = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewAd({ title: "", description: "", image: null });
  };

  const handleUpdateAd = (ad) => {
    setAdToUpdate(ad);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setAdToUpdate(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAd((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewAd((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSaveNewAd = async () => {
    const formData = new FormData();
    formData.append("title", newAd.title);
    formData.append("description", newAd.description);
    if (newAd.image) formData.append("image", newAd.image);

    try {
      await axios.post("http://localhost:4000/api/advertisements", formData);
      alert("New advertisement added successfully!");
      fetchAdvertisements();
      handleCloseAddModal();
    } catch (error) {
      console.error("Error adding advertisement:", error.message);
    }
  };

  const handleSaveUpdateAd = async () => {
    const formData = new FormData();
    formData.append("title", adToUpdate.title);
    formData.append("description", adToUpdate.description);
    if (adToUpdate.image) formData.append("image", adToUpdate.image);

    try {
      await axios.put(
        `http://localhost:4000/api/advertisements/${adToUpdate._id}`,
        formData
      );
      alert("Advertisement updated successfully!");
      fetchAdvertisements();
      handleCloseUpdateModal();
    } catch (error) {
      console.error("Error updating advertisement:", error.message);
    }
  };

  const filteredAds = advertisements.filter((ad) =>
    ad.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
            {selectedAds.length === advertisements.length
              ? "Deselect All"
              : "Select All"}
          </Button>
          <Button
            className="btn btn-danger ms-2"
            onClick={handleDeleteSelected}
            disabled={!selectedAds.length}
          >
            Delete Selected
          </Button>
          <Button
            className="btn btn-success ms-2"
            onClick={handleAddNewAdvertisement}
          >
            Add New
          </Button>
        </div>
      </div>

      <div className="table-container">
        <Table striped bordered hover responsive="sm">
          <thead>
            <tr>
              <th>Sno</th>
              <th>Heading</th>
              <th>Description</th>
              <th>Image</th>
              <th>Action</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {filteredAds.map((ad, index) => (
              <tr key={ad._id}>
                <td>{index + 1}</td>
                <td>{ad.title}</td>
                <td>{ad.description}</td>
                <td>
                  {ad.image ? (
                    <img src={ad.image} alt={ad.title} className="ad-image" />
                  ) : (
                    "No image"
                  )}
                </td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleUpdateAd(ad)}
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
                    checked={selectedAds.includes(ad._id)}
                    onChange={() => handleSelectAd(ad._id)}
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
          <Modal.Title>Add New Advertisement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAdTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newAd.title}
                onChange={handleInputChange}
                placeholder="Title"
              />
            </Form.Group>
            <Form.Group controlId="formAdDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newAd.description}
                onChange={handleInputChange}
                placeholder="Description"
              />
            </Form.Group>
            <Form.Group controlId="formAdImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
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

      {/* Modal for Update Advertisement */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Advertisement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAdTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={adToUpdate?.title || ""}
                onChange={(e) =>
                  setAdToUpdate({
                    ...adToUpdate,
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
                value={adToUpdate?.description || ""}
                onChange={(e) =>
                  setAdToUpdate({
                    ...adToUpdate,
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
                  setAdToUpdate({
                    ...adToUpdate,
                    image: e.target.files[0],
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveUpdateAd}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  </div>
  )
}

export default News