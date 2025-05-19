import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    staffNumber: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      alert('Registered successfully! Please login.');
      navigate('/');
    } catch (err) {
      setError('Server error. Try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        <input name="name" type="text" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full mb-3 border px-3 py-2 rounded" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full mb-3 border px-3 py-2 rounded" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full mb-3 border px-3 py-2 rounded" required />
        <input name="department" type="text" placeholder="Department" value={form.department} onChange={handleChange} className="w-full mb-3 border px-3 py-2 rounded" required />
        <input name="staffNumber" type="text" placeholder="Staff Number" value={form.staffNumber} onChange={handleChange} className="w-full mb-4 border px-3 py-2 rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
}
