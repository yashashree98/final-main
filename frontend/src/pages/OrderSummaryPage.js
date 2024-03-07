import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../Store.js';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { getError } from '../utils.js';
import Loading from '../components/Loading';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

const OrderSummaryPage = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { cartItems }, userInfo } = state;
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const sendDataToBackend = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const orderItems = cartItems.map(item => ({
        _id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const response = await axios.post('/api/order', { orderItems });
      
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      toast.success('Order has been placed successfully!');
      navigate('/');
    } catch (error) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(error));
    }
  };

  return (
    <div>
      <Helmet>
        <title>Order Summary</title>
      </Helmet>
      
      <h1 className="my-3">Preview Order</h1>
      
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              {cartItems.map((item) => (
                <div key={item._id}>
                  <Card.Text>
                    <strong>Name:</strong> {item.name} <br />
                    <strong>Quantity:</strong> {item.quantity} <br />
                    <strong>Total Price:</strong> ${item.price * item.quantity}
                  </Card.Text>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Link to="/cart">Back to Cart</Link>&nbsp; &nbsp; <Link to="/">Home</Link>&nbsp;

      <div>
        <Button
          type="button"
          variant="primary"
          onClick={sendDataToBackend}
          disabled={cartItems.length === 0 || loading}
        >
          Place Order
        </Button>
      </div>

      {loading && <Loading />}
    </div>
  );
};

export default OrderSummaryPage;