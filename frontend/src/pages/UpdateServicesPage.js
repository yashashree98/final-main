import React, { useEffect, useState, useContext, useReducer } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';
import Loading from '../components/Loading';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type)
  {
    case 'FETCH_REQUEST':
      return {...state, loading: true };
    case 'FETCH_SUCCESS':
      return {...state, loading: false };
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload };

    case 'UPDATE_REQUEST':
      return {...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return {...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return {...state,loadingUpdate: false };

    case 'UPLOAD_REQUEST':
      return {...state, loadingUpload: true, errorUpload: ''};
    case 'UPLOAD_SUCCESS':
      return {...state, loadingUpload: false, errorUpload: ''};
    case 'UPLOAD_FAIL':
      return {...state, loadingUpload: false, errorUpload: action.payload };
    
    default:
      return state;
  }
}

export default function UpdateServicesPage()
{

  const params = useParams();
  const navigate = useNavigate();

  const { id: serviceId } = params;

  console.log(serviceId);

  const { state } = useContext(Store);
  const userInfo = state;
  const [{loading, error, loadingUpdate, loadingUpload }, dispatch ] = useReducer(reducer, { loading: true, error: '',});
  
  const [ name, setName ] = useState('');
  const [ slug, setSlug ] = useState('');
  const [ image, setImage ] = useState('');
  const [ images, setImages ] = useState([]);
  const [ price, setPrice ] = useState(''); 
  const [ countInStock, setCountInStock ] = useState(''); 
  const [ description, setDescription ] = useState('');

  const getData = async () => {
    try
    {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/services/${serviceId}`);
      
      setName(data.name);
      setSlug(data.slug);
      setImage(data.image);
      setImages(data.images);
      setPrice(data.price);
      setCountInStock(data.countInStock);
      setDescription(data.description);
      
      dispatch({ type: 'FETCH_SUCCESS '});
    }
    catch(err)
    {
      dispatch({ type: 'FETCH_FAIL', payload: err });
      console.log(err);
    }
  };

  useEffect(() => {
    
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try
    {
      dispatch({ type: 'UPDATE_REQUEST '});
      await  axios.put(`/api/services/${serviceId}`,
      {
        _id: serviceId,
        name,
        slug,
        image,
        images,
        price,
        countInStock,
        description,
      },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
      );
      dispatch({ type:'UPDATE_SUCCESS', });
      console.log('Service updated successfully!');
      navigate('/admin/services');
    }
    catch(err)
    {
      console.error('Unable to Update service');
      dispatch({ type: 'UPDATE_FAIL '});
    }
  };

  const handleUploadFile = async (e,forImages ) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file',file);
    try
    {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { d } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${userInfo.token}`, },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if(forImages)
      {
        setImages([...images, d.secure_url]);
      }
      else
      {
        setImage(d.secure_url);
      }
      console.log('Image uploaded successfully!');
    }
    catch(err)
    {
      console.log(err);
      dispatch({ type: 'UPLOAD_FAIL', payload: err });
    }
  };

  const handleDeleteFile = async (fileName, f) => {
    console.log(fileName, f);
    console.log(images);
    console.log(images.filter((x) => x !== fileName ));
    setImages(images.filter((x) => x!== fileName));
    console.log('Image removed successfully!');
  };


  return (
    <Container className="container">
      <Helmet>
        <title>Update Service</title>
      </Helmet>
      <h1> Update Service</h1>

      {!loading ? (<Loading></Loading>) : error ? (<MessageBox variant="danger">{error.message}</MessageBox>) : (
        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="slug">
          <Form.Label>Slug</Form.Label>
          <Form.Control value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="image">
          <Form.Label>Image File</Form.Label>
          <Form.Control value={image} onChange={(e) => setImage(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="imageFile">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control type="file" onChange={handleUploadFile} />
          {loadingUpload && <Loading></Loading>}
          </Form.Group>

          {/* <Form.Group className="mb-3" controlId="removeImage">
          <Form.Label>Images</Form.Label>
          {images.length === 0 && <MessageBox>No Image</MessageBox>}
          <ListGroup variant="flush">
            {images.map((i) => (
              <ListGroup.Item key={i}>
                {i}
                <Button variant="light" onClick={() => handleDeleteFile(i)}>
                  <i className="fa fa-times-circle"></i>
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          </Form.Group> */}

          <Form.Group className="mb-3" controlId="addImages">
            <Form.Label>Add New Images</Form.Label>
            <Form.Control type="file" onChange={(e) => handleUploadFile(e, true)} />
            {loadingUpload && <Loading></Loading>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control value={price} onChange={(e) => setPrice(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="countInStock">
          <Form.Label>Count In Stock</Form.Label>
          <Form.Control value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control value={description} onChange={(e) => setDescription(e.target.value)} required />
          </Form.Group>

          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <Loading></Loading>}
          </div>

        </Form>
      )}
    </Container>

  );

}