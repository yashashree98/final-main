import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import Loading from '../components/Loading';
import MessageBox from '../components/MessageBox';
import { useNavigate } from 'react-router-dom';

const tokenFromLocalStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")): null


export default function AddServicePage() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const userInfo = state;
  const [newService, setNewService] = useState({
    name: '',
    slug: '',
    image: '',
    imagePath: '',
    price: '',
    countInStock: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService((prevService) => ({
      ...prevService,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {

    const body = {name: newService.name, slug: newService.slug, image: newService.image, price: newService.price, countInStock: newService.countInStock, description: newService.description}
    console.log(userInfo.token);
    const response = await axios.post('/api/services/addservice', body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenFromLocalStorage.token}`,
      }
    });

    if (response.data && response.data.success) {
      console.log('Service added successfully!');
      navigate('/admin/services');
    } else {
      console.error('Error adding service:', response.message);
    }
  } catch (error) {
    console.error('Error adding service:', error.response.message || error.message);
  }
};

  const handleUpload = (e) => {
    if (e.target.name === 'imageFile') {
      const file = e.target.files[0];
      const imagePath = URL.createObjectURL(file);
      setNewService({
        ...newService,
        image: file,
        imagePath: imagePath
      });
    } else {
      setNewService({ ...newService, [e.target.name]: e.target.value });
    }
  };

  return (
    <div>
      <Helmet>
        <title>Create Service</title>
      </Helmet>
      <h2>Create a New Service Here</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={newService.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="slug">
          <Form.Label>Slug</Form.Label>
          <Form.Control
            type="text"
            name="slug"
            value={newService.slug}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="image">
          <Form.Label>Image Path</Form.Label>
          <Form.Control
            type="text"
            name="image"
            value={newService.image}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            name="price"
            value={newService.price}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="countInStock">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="text"
            name="countInStock"
            value={newService.countInStock}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={newService.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button type="submit">Create Service</Button>
      </Form>
    </div>
  );
}