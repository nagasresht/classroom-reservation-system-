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
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (!res.ok) {
        // Check if user needs email verification
        if (data.needsVerification) {
          alert(data.message);
          navigate('/verify-otp', { state: { email: data.email } });
          return;
        }
        return setError(data.message || 'Login failed');
      }
      
      localStorage.setItem('user', JSON.stringify(data));
      
      // Check if email ends with @admin.com
      const isAdmin = data.email.toLowerCase().endsWith('@admin.com');
      navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
   } catch {
      setError('Server error. Try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#111827] via-[#1e293b] to-[#111827]">
      <div className="w-full max-w-md px-6">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <h1 className="text-4xl font-bold text-white mb-2">
              Classroom<span className="text-[#3B82F6]">Hub</span>
            </h1>
            <div className="h-1 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full"></div>
          </div>
          <p className="text-[#9CA3AF] mt-3 text-sm">Modern Classroom Booking System</p>
        </div>

        {/* Login Form Card */}
        <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-lg border border-[#374151] p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-2 text-white">Welcome Back</h2>
          <p className="text-[#9CA3AF] mb-6 text-sm">Sign in to your account to continue</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-[#9CA3AF] text-sm font-medium mb-2">Email Address</label>
              <input 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                type="email" 
                required 
                placeholder="you@example.com" 
                className="w-full bg-[#1F2937] border border-[#374151] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition placeholder-[#6B7280]"
              />
            </div>
            
            <div>
              <label className="block text-[#9CA3AF] text-sm font-medium mb-2">Password</label>
              <input 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                type="password" 
                required 
                placeholder="Enter your password" 
                className="w-full bg-[#1F2937] border border-[#374151] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition placeholder-[#6B7280]"
              />
            </div>
          </div>

          <div className="text-right mt-3 mb-6">
            <span 
              className="text-sm text-[#3B82F6] cursor-pointer hover:text-[#60A5FA] transition font-medium" 
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </span>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white py-3 rounded-lg font-semibold hover:from-[#2563EB] hover:to-[#1D4ED8] transition-all duration-300 shadow-lg shadow-[#3B82F6]/50 transform hover:scale-[1.02]"
          >
            Sign In
          </button>

          <div className="mt-6 text-center">
            <p className="text-[#9CA3AF] text-sm">
              Don't have an account?{' '}
              <span 
                className="text-[#3B82F6] cursor-pointer hover:text-[#60A5FA] transition font-semibold" 
                onClick={() => navigate('/register')}
              >
                Create Account
              </span>
            </p>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-[#6B7280] text-xs mt-6">
          © 2025 ClassroomHub. Secure & Reliable.
        </p>
      </div>
    </div>
  );
}
