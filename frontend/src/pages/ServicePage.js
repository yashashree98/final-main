import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Store } from "../Store";

const reducer = (state, action) => {
    switch(action.type) {
      case 'FETCH_REQUEST':
        return {...state, loading: true};
      case 'FETCH_SUCCESS':
        return {...state, service: action.payload, loading: false};
      case 'FETCH_FAIL':
        return {...state, loading: false, error: action.payload};
      default:
        return state;
    }
};


function ServicePage(){
    const navigate = useNavigate();
    const params = useParams();
    const { slug } = params;

    const [{loading, error, service}, dispatch] = useReducer((reducer), {
        service: [],
        loading: true, 
        error: '',
      });
  
      useEffect(()=> {
        const fetchData = async () => {
          dispatch({type: 'FETCH_REQUEST'});
          try{
            const result = await axios.get(`/api/services/slug/${slug}`);
            dispatch({type: 'FETCH_SUCCESS', payload: result.data});
          } 
          catch(err){
            dispatch({type: 'FETCH_FAIL', payload: err.message });
          }
        };
        fetchData();
      }, [slug])

    const { state, dispatch: cxtDispatch } = useContext(Store);
    const { cart } = state;

    const addToCartHandler = async() => {
        
        const existItem = cart.cartItems.find((x) => x._id === service._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data: db } =  await axios.get(`/api/services/${service._id}`);
        
        if (db.countInStock < quantity) {
            window.alert('Sorry. Service is currently unavailable!');
            return;
        }
        cxtDispatch({
            type: 'CART_ADD_ITEM', 
            payload:{...service, quantity}, 
      });
      navigate('/cart');
    };

    return (
        loading ? <div>Loading...</div> : error ? <div>{error}</div> :
        <div>
            <Row>
                <Col md={6}>
                    <img
                        className="img-large"
                        src={service.image}
                        alt={service.name}
                    ></img>
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Helmet>
                                <title>{service.name}</title>
                            </Helmet>
                            <h1>{service.name}</h1>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Price : ${service.price}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Description : {service.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price :</Col>
                                        <Col>${service.price}</Col>
                                    </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                    <Row>
                                        <Col>Status :</Col>
                                        <Col>{service.countInStock>0?
                                        <Badge bg="success">In Stock</Badge>
                                    :
                                    <Badge bg="danger">Out of stock</Badge>}</Col>
                                    </Row>
                                    </ListGroup.Item>
                                    {service.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <div className="d-grid">
                                                <Button onClick={addToCartHandler} variant="primary">Add to Cart</Button>
                                            </div>
                                        </ListGroup.Item>
                                    )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
export default ServicePage;