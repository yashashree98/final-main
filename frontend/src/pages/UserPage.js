import React, { useState, useContext, useEffect } from 'react';
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
//console.log(tokenFromLocalStorage.token);


const UserPage = () => {
  const [users, setUsers] = useState([]);
  const { state } = useContext(Store);
  const userInfo = state;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${tokenFromLocalStorage.token}` // Add your authorization token here if required
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [userInfo.token]);

  return (
    <div>
      <Helmet>
        <title>Users List</title>
      </Helmet>
      <h1>Users List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPage;