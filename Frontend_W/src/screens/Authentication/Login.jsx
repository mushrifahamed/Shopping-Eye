import React, { useState } from 'react';
import Cookies from 'js-cookie'; // Import the js-cookie library
import { useNavigate, Link } from 'react-router-dom';
import loginImage from '../../assets/login1.jpg'; // Adjust the path based on your file structure

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Use the useNavigate hook

  // Validate email format
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      // Call the backend API to log in the user
      const response = await fetch('http://localhost:8089/api/admin/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Set the token in cookies
      Cookies.set('token', data.token, { expires: 1, secure: true, sameSite: 'Strict' });

      setSuccess('Login successful');
      setError('');

      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (error) {
      setSuccess('');
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-md">
        {/* Left side - Image */}
        <div className="hidden lg:block w-1/2">
          <img
            src={loginImage}
            alt="Login"
            className="object-cover w-full h-full rounded-l-lg"
          />
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
          {success && <p className="text-sm text-green-500">{success}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-blue-800 hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Only for Admins
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
