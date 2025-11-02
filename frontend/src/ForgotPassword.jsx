import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', phone: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || 'Failed to process request');
        return;
      }

      setMessage(data.message);
      // In a real app, user would receive an email with reset link
      // For demo purposes, we'll show the token
      if (data.resetToken) {
        setTimeout(() => {
          navigate(`/reset-password/${data.resetToken}`);
        }, 2000);
      }
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

        {/* Forgot Password Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-[#374151] p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-2 text-white">Reset Password</h2>
          <p className="text-[#9CA3AF] mb-6 text-sm">
            Enter your email address and phone number to verify your identity.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
              <p className="text-green-400 text-sm text-center">{message}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-[#9CA3AF] text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-[#1F2937] border border-[#374151] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition placeholder-[#6B7280]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9CA3AF] text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="1234567890 (10 digits)"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-[#1F2937] border border-[#374151] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition placeholder-[#6B7280]"
                  pattern="[0-9]{10}"
                  title="Phone number must be exactly 10 digits"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white py-3 rounded-lg font-semibold hover:from-[#2563EB] hover:to-[#1D4ED8] transition-all duration-300 shadow-lg shadow-[#3B82F6]/50 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#9CA3AF] text-sm">
              Remember your password?{' '}
              <span
                className="text-[#3B82F6] cursor-pointer hover:text-[#60A5FA] transition font-semibold"
                onClick={() => navigate('/')}
              >
                Sign In
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#6B7280] text-xs mt-6">
          © 2025 ClassroomHub. Secure & Reliable.
        </p>
      </div>
    </div>
  );
}
