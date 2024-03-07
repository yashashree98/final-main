import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';
import FormControl from 'react-bootstrap/esm/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

export default function SearchBox() {

    const navigate = useNavigate();
    const [ query, setQuery ] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/search/?query=${query}` : '/search');
    }

  return (
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
        <InputGroup>
            <FormControl type="text" 
            name="q"
            id="q" 
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Services.."
            aria-label="Search Services"
            aria-describedby="button-search">
            </FormControl>
            <Button variant="outline-primary" type="submit" id="button-serch">
                <i className="fas fa-search"></i>
            </Button>
        </InputGroup>
    </Form>
  )
}
