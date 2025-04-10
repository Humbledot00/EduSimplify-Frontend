import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Hero from '../components/Hero';
import InputBox from '../components/InputBox';
import config from './config';
const Summarization = () => {
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryStats, setSummaryStats] = useState({
    originalLength: 0,
    summaryLength: 0,
    keyPoints: 0,
    reductionPercent: 0
  });

  const handleGenerate = async (input) => {
    if (!input) {
      setGeneratedContent("Please enter some text to generate a summary.");
      return;
    }
    setLoading(true);

    try {
      // Send a POST request to the backend
      const response = await fetch(`${config.baseUrl}/generate-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      // Parse the JSON response
      const data = await response.json();

      // Update the generated content with the response from the backend
      if (data.summary) {
        setGeneratedContent(data.summary);
        setSummaryStats(data.stats); // Update summary statistics
      } else if (data.error) {
        setGeneratedContent(`**Error:** ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setGeneratedContent('**Error:** An error occurred while generating the summary. Please try again.');
    }finally {
      setLoading(false); // 👈 End loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Use ReactMarkdown to render the generated content */}
        <Hero 
          title="Text Summarization" 
          content={generatedContent}
        />
        
        {/* Summary Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-blue-600 mb-1">Original Length</h3>
            <p className="text-2xl font-bold text-blue-800">{summaryStats.originalLength}</p>
            <p className="text-xs text-blue-400">characters</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-blue-600 mb-1">Summary Length</h3>
            <p className="text-2xl font-bold text-blue-800">{summaryStats.summaryLength}</p>
            <p className="text-xs text-blue-400">characters</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-blue-600 mb-1">Key Points</h3>
            <p className="text-2xl font-bold text-blue-800">{summaryStats.keyPoints}</p>
            <p className="text-xs text-blue-400">identified</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-blue-600 mb-1">Reduction</h3>
            <p className="text-2xl font-bold text-blue-800">{summaryStats.reductionPercent}%</p>
            <p className="text-xs text-blue-400">shorter</p>
          </div>
        </motion.div>

      </div>
      
      <InputBox 
        onGenerate={handleGenerate}
      />
    </div>
  );
};

export default Summarization;