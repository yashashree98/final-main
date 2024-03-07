import React, { useEffect, useReducer } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getError } from '../utils';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import { Helmet } from 'react-helmet-async';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Loading from '../components/Loading.js';
import MessageBox from '../components/MessageBox.js';
import Service from '../components/Service.js';
import LinkContainer from 'react-router-bootstrap/LinkContainer';

const reducer = (state, action) => {
    switch (action.type)
    {
        case 'FETCH_REQUEST':
            return {...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                services: action.payload.services,
                page: action.payload.page,
                pages: action.payload.pages,
                countServices: action.payload.countServices,
                loading: false,
            };
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const prices = [
    {
        name: '$1 to $50',
        value: '1-50',
    },
    {
        name: '$51 to $200',
        value: '51-200',
    },
    {
        name: '$201 to $1000',
        value: '201-1000',
    },
];

export default function SearchPage() {
    
    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    
    const name = sp.get('name') || 'all';
    const price = sp.get('price') || 'all';
    const query = sp.get('query') || 'all';
    const page = sp.get('page') || 1;

    const [{ loading, error, services, pages, countServices }, dispatch ] = useReducer(reducer, { loading: true, error: '', });

    useEffect(() => {
        const fetchData = async () => {
            try
            {
                const { data } = await axios.get(
                    `/api/services/search?page=${page}&query=${query}&name${name}&price=${price}`
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            }
            catch(err)
            {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err),
                })
            }
        };
        fetchData();
    }, [name, error, page, price, query]);

    const getFilterUrl = (filter) => {
        const pageFilter = filter.page || page;
        const nameFilter = filter.name || name;
        const queryFilter = filter.query || query;
        const priceFilter = filter.price || page;

        return `/search?name=${nameFilter}&query=${queryFilter}&price=${priceFilter}&page=${pageFilter}`
    }

    return (
    <div>
        <Helmet>
            <title>Search Page</title>
        </Helmet>
        <Row>
        <Col md={3}>
          <h3>Service Name</h3>
           <div>
            <ul>
                <li>
                <Link className={'all' === name ? 'text-bold' : ''}
                to={ getFilterUrl({ name: 'all' })}>
                    Any
                </Link>
                </li>
                {  Array.isArray(name) && name.map((n) => (
                    <li key={n}>
                        <Link className={n === name ? 'text-bold' : ''}
                        to={getFilterUrl({ name: n })}>
                            {n}
                        </Link>
                    </li>
                ))}
            </ul>
           </div>
           <div>
            <h3>Price</h3>
            <ul>
                <li>
                    <Link className={'all' === price ? 'text-bold' : ''}
                    to={getFilterUrl({price: 'all '})} >
                        Any
                    </Link>
                </li>
                {prices.map((p) => {
                    <li key={p.value}>
                        <Link to={getFilterUrl({ price: p.value })} className={p.value === price ? 'text-bold' : ''} >
                            {p.name}
                        </Link>
                    </li>
                })}
            </ul>
           </div>
        </Col>
        <Col md={9}>
            {loading ? (<Loading></Loading>) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                <Row className="justify-content-between mb-3">
                <Col md={6}>
                    <div>
                        {countServices === 0 ? 'No' : countServices } Results
                        {query !== 'all' && ':' + query}
                        {name !== 'all' && ':' + name}
                        {price !== 'all' && ': Price ' + price}
                        {query !== 'all' ||
                        name !== 'all' ||
                        price !== 'all' ? (
                            <Button variant="light"
                            onClick={() => navigate('/search')}>
                                <i className="fas fa-times-circle"></i>
                            </Button>
                        ): null}
                    </div>
                </Col>
                </Row>
                {services.length === 0 && (
                    <MessageBox>This Service is not available!</MessageBox>
                )}

                <Row>
                    {services.map((service) => (
                        <Col sm={6} lg={4} className="mb-3" key={service._id}>
                            <Service service={service}></Service>
                        </Col>
                    ))}
                </Row>

                <div>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer key={x + 1} className="mx-1"
                    to={{
                      pathname: '/search',
                      seacrh: getFilterUrl({ page: x + 1 }, true),
                    }}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
                </>
            )}
        </Col>
        </Row>
    </div>
  )
}
