import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserComponent = ({ addUser, editUser, userToEdit, clearEdit }) => {
  const [name, setName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Default to empty initially
  const [status, setStatus] = useState('active');
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]); // State to store roles from localStorage

  // Load roles from localStorage
  useEffect(() => {
    const savedRoles = JSON.parse(localStorage.getItem('roles')) || [];
    setRoles(savedRoles);
    if (savedRoles.length > 0) {
      setRole(savedRoles[0].name); // Set the first role as default, or handle it as needed
    }
  }, []);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setContactNo(userToEdit.contactNo);
      setEmail(userToEdit.email);
      setUsername(userToEdit.username);
      setPassword(userToEdit.password);
      setRole(userToEdit.role);
      setStatus(userToEdit.status);
    } else {
      setName('');
      setContactNo('');
      setEmail('');
      setUsername('');
      setPassword('');
      setRole(roles[0]?.name || ''); // Set default role based on roles from localStorage
      setStatus('active');
    }
  }, [userToEdit, roles]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateContactNo = (contactNo) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(contactNo);
  };

  const sanitizeInput = (input) => {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    if (!validateContactNo(contactNo)) {
      setError('Invalid contact number format. It should be 10 digits.');
      return;
    }

    const user = {
      name: sanitizeInput(name),
      contactNo: sanitizeInput(contactNo),
      email: sanitizeInput(email),
      username: sanitizeInput(username),
      password: sanitizeInput(password),
      role,
      status,
    };

    let usersFromStorage = JSON.parse(localStorage.getItem('users')) || [];

    if (userToEdit) {
      const updatedUsers = usersFromStorage.map((u) =>
        u.username === userToEdit.username ? user : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      editUser(user); // Trigger editing in the parent component
    } else {
      const usernameExists = usersFromStorage.some((u) => u.username === username);

      if (usernameExists) {
        setError('Username already exists');
        toast.error('Username already exists!');
        return;
      }

      usersFromStorage.push(user);
      localStorage.setItem('users', JSON.stringify(usersFromStorage));
      //toast.success('User registered successfully!');
      addUser(user);
    }

    setName('');
    setContactNo('');
    setEmail('');
    setUsername('');
    setPassword('');
    setRole(roles[0]?.name || ''); // Reset role after form submission
    setStatus('active');
    clearEdit(); // Clear the editing session
    setError('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg shadow-lg mb-4">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="mb-2">
          <label className="block text-gray-700 mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1">Contact Number:</label>
          <input
            type="text"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1">Password:</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
          >
            {roles.map((role, index) => (
              <option key={index} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white rounded-md py-2">
          {userToEdit ? 'Update User' : 'Add User'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UserComponent;
