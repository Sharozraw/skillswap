import { useState } from 'react';
import { register } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Signup = ({ setUser }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register(formData);
      localStorage.setItem('token', data.token);
      setUser(true);
      navigate('/dashboard');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Signup</button>
      <p>Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
    </form>
  );
};

export default Signup;