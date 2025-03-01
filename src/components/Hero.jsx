import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Import react-markdown

const Hero = ({ title, content, saveHandler, regenerateHandler }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + content[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, content]);

  return (
    <div className="relative p-6 bg-white rounded-lg shadow-md mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-start"
      >
        <h1 className="text-3xl font-bold text-blue-800 mb-4">{title}</h1>
        <div className="flex gap-2">
          <button 
            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
            onClick={regenerateHandler}
          >
            <RefreshCcw size={24} />
          </button>
          <button 
            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
            onClick={saveHandler}
          >
            <Save size={24} />
          </button>
        </div>
      </motion.div>
      
      {/* Wrap ReactMarkdown in a div and apply className here */}
      <div className="max-h-96 overflow-auto p-4 bg-blue-50 rounded">
        <div className="text-blue-900 leading-relaxed">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold text-blue-800" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
              li: ({ node, ...props }) => <li className="mb-2" {...props} />,
            }}
          >
            {displayText}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Hero;