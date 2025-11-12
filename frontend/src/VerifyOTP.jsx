import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getApiUrl } from './config/api';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(getApiUrl('/api/auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ ' + data.message);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(getApiUrl('/api/auth/resend-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ ' + data.message);
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (err) {
      setMessage('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-3xl font-bold text-gray-800">Verify Your Email</h2>
          <p className="text-gray-600 mt-2">
            We've sent a 6-digit OTP to<br />
            <strong className="text-purple-600">{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              maxLength="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-2xl tracking-widest font-bold"
              required
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-center ${
              message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="text-purple-600 hover:text-purple-800 font-medium disabled:opacity-50"
            >
              Didn't receive? Resend OTP
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
