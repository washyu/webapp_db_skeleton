import { useEffect, useState } from 'react';
import axios from 'axios';
import './UserTable.css';

const API_BASE_URL = 'http://localhost:5000';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        address,
        age,
      });
      setUsers([...users, response.data]);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setAddress('');
      setAge('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="user-table-container">
      <h2>User Table</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Add User</h3>
      <form className="add-user-form" onSubmit={addUser}>
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default UserTable;