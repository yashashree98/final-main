import { useEffect, useReducer } from "react";
import axios from "axios";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Service from "../components/Service";
import { Helmet } from 'react-helmet-async';


const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true};
    case 'FETCH_SUCCESS':
      return {...state, services: action.payload, loading: false};
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload};
    default:
      return state;
  }
}

function HomePage() {
    const [{loading, error, services}, dispatch] = useReducer((reducer), {
      services: [],
      loading: true, 
      error: '',
    });

    useEffect(()=> {
      const fetchData = async () => {
        dispatch({type: 'FETCH_REQUEST'});
        try{
          const result = await axios.get('/api/services');
          dispatch({type: 'FETCH_SUCCESS', payload: result.data});
        } 
        catch(err){
          dispatch({type: 'FETCH_FAIL', payload: err.message });
        }
      };
      fetchData();
    }, [])

    return <div>
      <Helmet>
        <title>SuAmazon</title>
      </Helmet>
        <h1>Featured Services</h1>

        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;

          <div className="services">
            {loading ? (<div>Loading...</div>) : error ? (<div>{error}</div>) : (
            <Row>
              {services.map(service => (
              <Col key={service.slug} sm={6} md={4} lg={3} className="mb-3">
                <Service service={service}></Service>
                </Col>
                ))}
              </Row>
              )}
            </div>
    </div>;
}

export default HomePage;