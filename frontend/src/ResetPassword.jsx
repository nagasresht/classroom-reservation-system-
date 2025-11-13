import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from './config/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || 'Failed to reset password');
        return;
      }

      alert('Password reset successfully! Please login with your new password.');
      navigate('/');
    } catch (err) {
      setLoading(false);
      setError('Server error. Try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#111827] via-[#1e293b] to-[#111827]">
      <div className="w-full max-w-md px-6">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <h1 className="text-3xl font-bold text-white mb-2">
              Classroom<span className="text-[#3B82F6]">Hub</span>
            </h1>
            <div className="h-1 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full"></div>
          </div>
        </div>

        {/* Reset Password Card */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg border border-[#374151] p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-2 text-white">New Password</h2>
          <p className="text-[#9CA3AF] mb-6 text-sm">
            Create a strong password for your account.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[#9CA3AF] text-sm font-medium mb-2">New Password</label>
              <input
                name="password"
                type="password"
                placeholder="Enter new password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-[#1F2937] border border-[#374151] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition placeholder-[#6B7280]"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-[#9CA3AF] text-sm font-medium mb-2">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full bg-[#1F2937] border border-[#374151] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition placeholder-[#6B7280]"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white py-3 rounded-lg font-semibold hover:from-[#2563EB] hover:to-[#1D4ED8] transition-all duration-300 shadow-lg shadow-[#3B82F6]/50 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <div className="mt-6 text-center">
            <span
              className="text-[#3B82F6] cursor-pointer hover:text-[#60A5FA] transition font-semibold text-sm"
              onClick={() => navigate('/')}
            >
              ← Back to Login
            </span>
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
