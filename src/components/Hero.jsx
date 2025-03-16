import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Hero = ({ title, content = "", saveHandler, regenerateHandler }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset typewriter effect when content changes
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [content]);

  // Typewriter effect
  useEffect(() => {
    if (content && currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + content[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
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
            aria-label="Regenerate content"
          >
            <RefreshCcw size={24} />
          </button>
          <button
            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
            onClick={saveHandler}
            aria-label="Save content"
          >
            <Save size={24} />
          </button>
        </div>
      </motion.div>

      {/* Wrap ReactMarkdown in a div and apply className here */}
      <div className="max-h-96 overflow-auto p-4 bg-blue-50 rounded">
        <div className="text-blue-900 leading-relaxed">
          {content ? (
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-2xl font-bold mb-4" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold text-blue-800" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-6 mb-4" {...props} />
                ),
                li: ({ node, ...props }) => <li className="mb-2" {...props} />,
              }}
            >
              {displayText}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-500">No content available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;