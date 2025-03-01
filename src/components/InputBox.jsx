import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InputBox = ({ onGenerate }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    onGenerate(input);
    setInput('');
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
        />
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
                   shadow-md hover:shadow-lg active:scale-95 transform duration-100"
        >
          Generate
        </button>
      </div>
    </motion.div>
  );
};

export default InputBox;