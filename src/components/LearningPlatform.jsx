import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LearningPlatform = () => {
  const navigate = useNavigate();

  const learningOptions = [
    { title: 'Mnemonic Magic', icon: '✨ ', path: '/keyword' },
    { title: 'Mnemonic Generation', icon: '🧠', path: '/mnemonic' },
    { title: 'Story Based Learning', icon: '📚', path: '/story' },
    { title: 'Flash Cards', icon: '🎴', path: '/flashcards' },
    { title: 'Visual Aids & Diagrams', icon: '📊', path: '/visual-aids' },
    { title: 'Summarization', icon: '📝', path: '/summarization' },
    { title: 'Gamification', icon: '🎮', path: '/gamification' },
  ];

   const [username, setUsername] = useState(''); // State to store the username
  
    // Fetch the username from localStorage when the component loads
    useEffect(() => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-blue-600 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-white text-2xl font-bold cursor-pointer"
            onClick={() => navigate('/home')}
          >
            BodhiMent
          </motion.div>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-x-6"
          >
            <button onClick={() => navigate('/home')} className="text-white hover:text-blue-200 transition-colors">Home</button>
            <button onClick={() => navigate('/about')} className="text-white hover:text-blue-200 transition-colors">About</button>
            <button onClick={() => navigate('/profile')} className="text-white hover:text-blue-200 transition-colors">Profile</button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl lg:text-6xl text-center font-bold text-blue-800 mb-16"
        >
        Hi {username}, what would you like to learn today?
        </motion.h1>

        {/* Learning Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 max-w-8xl mx-auto">
          {learningOptions.map((option, index) => (
            <motion.button
              key={option.title}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(option.path)}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow
                        border-2 border-blue-100 hover:border-blue-300
                        flex flex-col items-center justify-center
                        min-h-[200px] w-full"
            >
              <span className="text-4xl mb-4">{option.icon}</span>
              <h3 className="text-xl font-semibold text-blue-800 text-center">
                {option.title}
              </h3>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPlatform;