import { useContext, useState } from 'react';
import { Store } from '../Store'
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

export default function CartPage() {
    const navigate = useNavigate();

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart : { cartItems },
    } = state;

    const updateCartHandler = async (item, newQuantity) => {
        const existingItemIndex = cartItems.findIndex((cartItem) => cartItem._id === item._id);
    
        if (existingItemIndex !== -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex].quantity = newQuantity;
    
            ctxDispatch({
                type: 'UPDATE_CART_ITEM',
                payload: updatedCartItems,
            });
        } else {
            ctxDispatch({
                type: 'CART_ADD_ITEM',
                payload: { ...item, quantity: 1 },
            });
        }
    };
    const removeItemHandler = (item) => {
        ctxDispatch({
            type: 'CART_REMOVE_ITEM', 
            payload: item,
        });
    };

    const checkoutHandler = () => {
        navigate('/signin?redirect=/order');
    };

    return (
        <div>
            <Helmet>
                <title>Shopping Cart</title>
            </Helmet>
            <h1>Shopping Cart</h1>
            <Row>
                <Col md={8}>
                    {cartItems.length === 0 ? (
                        <MessageBox>
                            Cart is Empty. <Link to="/">Go Shopping</Link>
                        </MessageBox>
                    ):(
                        <ListGroup>
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className="align-items-center">
                                    <Col md={4}>
                                        <img 
                                        src={item.image}
                                        alt={item.name}
                                        className="img-thumbnail"></img>{' '}
                                        <Link to={`/service/${item.slug}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={3}>
                                      <Button variant="light" onClick={()=> updateCartHandler(item, item.quantity-1)} disabled={item.quantity === 1}><i className="fas fa-minus-circle"></i></Button>{' '}
                                      <span>{item.quantity}</span>{' '}
                                      <Button variant="light" onClick={()=> updateCartHandler(item, item.quantity+1)} disabled={item.quantity === item.countInStock}><i className="fas fa-plus-circle"></i></Button>{' '}
                                    </Col>
                                    <Col md={3}>${item.price}</Col>
                                    <Button variant="light" onClick={()=> removeItemHandler(item)}><i className="fas fa-trash"></i></Button>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>
                                        SubTotal ({cartItems.reduce((a,c) =>a + c.quantity, 0)}{' '}
                                        items) : $
                                        {cartItems.reduce((a,c) => a + c.price * c.quantity, 0)}
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className='d-grid'>
                                        <Button 
                                        type="button"
                                        variant="primary"
                                        onClick={checkoutHandler} disabled={cartItems.length === 0}>
                                            Proceed to Checkout
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}