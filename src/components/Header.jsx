import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default Header;