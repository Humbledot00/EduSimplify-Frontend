import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InputBox = ({ onGenerate, loading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim() || loading) return;
    onGenerate(input); // Pass input to parent
    setInput(''); // Clear local input
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-blue-100 p-4"
    >
      <div className="flex gap-4 w-full max-w-2xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your text here..."
          className="flex-1 p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-3 rounded-lg transition-colors shadow-md flex items-center justify-center
            ${loading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95 transform duration-100 text-white'
            }`}
        >
          {loading ? (
            <div className="loader border-t-2 border-white w-8 h-8 rounded-full animate-spin"></div>
          ) : (
            'Generate'
          )}
        </button>
      </div>

      {/* Spinner style */}
      <style>{`
        .loader {
          border: 2px solid transparent;
          border-top-color: white;
          border-radius: 50%;
          width: 30px;  /* Adjusted size */
          height: 30px; /* Adjusted size */
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default InputBox;
