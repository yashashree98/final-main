import React, { useEffect, useReducer, useContext } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Store } from '../Store';
import Loading from '../components/Loading';
import MessageBox from '../components/MessageBox';


const tokenFromLocalStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")): null
// console.log(tokenFromLocalStorage.token);

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {...state, services: action.payload.services, page: action.payload.page, pages: action.payload.pages, loading: false, };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false, };
    case 'DELETE_SUCCESS':
      return {...state, loadingDelete: false, successDelete: true, };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false, };
    
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false, };
    default:
      return state;
  }
};

export default function ServiceListPage () {
  const [{ loading, error, services, pages, loadingCreate, loadingDelete, successDelete }, dispatch,] = useReducer(reducer, {
    services: [], loading: true, error: '',
  });


  const { search } = useLocation();

  const param = new URLSearchParams(search);
  const page = param.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state; 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      dispatch({type: 'FETCH_REQUEST'});
      try 
      {
        const result = await axios.get(`/api/services/admin/?page=${page}`, {
          headers: { Authorization: `Bearer ${tokenFromLocalStorage.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data});
      } 
      catch (error) 
      {
        dispatch({type: 'FETCH_FAIL', payload: error.message });
      }
    };
    
    if(successDelete)
    {
      dispatch({ type: 'DELETE_RESET'});
    } else {
      fetchServices();
    }
  }, [page, userInfo, successDelete]);

  const handleAddService = async () => {
    navigate('/services/addservice')
};

  const handleDeleteService = async (service) => {
    if(window.confirm('Are you sure you want to Delete? '))
    {
      try 
    {
      await axios.delete(`/api/services/${service}`,
      { headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    console.log('Service Deleted Successfully! ');
    dispatch({ type: 'DELETE_SUCCESS' });
    } 
    catch (error) 
    {
      console.error('Error deleting service:', error);
      dispatch({ type: 'DELETE_FAIL', });
    }
    }
  };

  return (
    <div>
      <h2>Service List</h2>
      <Row>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={handleAddService}>
              Create Service
            </Button>
          </div>
        </Col>
      </Row>

      {loadingCreate && <Loading></Loading>}
      {loadingDelete && <Loading></Loading>}

      {loading ? (<Loading></Loading>) : error ? (<MessageBox variant="danger">{error}</MessageBox>) : 
      (<>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => 
            <tr key={service._id}>
              <td>{service._id}</td>
              <td>{service.name}</td>
              <td>{service.slug}</td>
              <td>{service.price}</td>
              <td>{service.description}</td>
              <td>
                <Button type="button" variant="light" onClick={() => navigate(`/admin/services/${service._id}`)} >
                  Edit
                </Button>
                &nbsp;
                &nbsp;
                <Button type="button" variant="light" onClick={() => handleDeleteService(service._id)} >
                  Delete
                </Button>
              </td>
            </tr>
            )}
          </tbody>
        </table>
        <div>
          {[...Array(pages).keys()].map((x) => (
            <Link className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
            key={x + 1}
            to={`/admin/services?page=${x + 1}`}>  {x + 1}
            </Link>
          ))}
        </div>
      </>
      )}
    </div>
  );
};
