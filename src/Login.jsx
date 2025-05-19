import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Login failed');
      localStorage.setItem('user', JSON.stringify(data));
      navigate(data.email === 'admin@admin.com' ? '/admin-dashboard' : '/dashboard');
   } catch {
      setError('Server error. Try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        <input name="email" value={form.email} onChange={handleChange} type="email" required placeholder="Email" className="w-full mb-3 border px-3 py-2 rounded" />
        <input name="password" value={form.password} onChange={handleChange} type="password" required placeholder="Password" className="w-full mb-4 border px-3 py-2 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
        <p className="mt-4 text-center text-sm">
          Don’t have an account? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/register')}>Register here</span>
        </p>
      </form>
    </div>
  );
}
