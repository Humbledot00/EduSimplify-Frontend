import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Mail, ArrowRight } from 'lucide-react';
import config from './config';
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = isLogin ? `${config.baseUrl}/login` : `${config.baseUrl}/register`;
      const payload = isLogin ? { email, password } : { username, email, password };

      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.message) {
    console.log(response.data.user);
    
    if (isLogin) {
      // Ensure the user object exists and has the expected properties
      if (response.data.user) {
        localStorage.setItem('user_id', response.data.user.user_id || 'undefined'); 
        localStorage.setItem('userEmail', response.data.user.email || 'undefined');
        localStorage.setItem('username', response.data.user.username || 'undefined');
        navigate('/home'); // Redirect to home page after login
      } else {
        console.error("User object is missing in the response");
      }
    } else {
      setIsLogin(true); // Switch to login after successful registration
    }
  }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm text-blue-600">Username</label>
              <div className="flex items-center border border-blue-200 rounded-lg p-3">
                <User className="text-blue-600 mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-blue-600">Email</label>
            <div className="flex items-center border border-blue-200 rounded-lg p-3">
              <Mail className="text-blue-600 mr-2" size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-blue-600">Password</label>
            <div className="flex items-center border border-blue-200 rounded-lg p-3">
              <Lock className="text-blue-600 mr-2" size={18} />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <span>{isLogin ? 'Login' : 'Sign Up'}</span>
            <ArrowRight className="ml-2" size={18} />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-800 font-semibold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;