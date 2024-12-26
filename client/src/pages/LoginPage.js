import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router's useNavigate
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Navigation hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/users/login', formData);
      const { token, username } = response.data;

      // JWT 저장
      localStorage.setItem('token', token);

      // 성공 메시지 설정 및 홈페이지로 리다이렉트
      setMessage(`Welcome, ${username}`);
      setTimeout(() => {
        navigate('/'); // Navigate to homepage
      }, 1500); // 1.5초 후 리다이렉트
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;
