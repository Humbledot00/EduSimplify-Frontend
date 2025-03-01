import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Book, ChevronRight, Database, Loader, X, ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import config from './config';
const Flashcards = () => {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [aiInputText, setAiInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Preview states
  const [showPreview, setShowPreview] = useState(false);
  const [previewFlipped, setPreviewFlipped] = useState(false);
  const [previewContent, setPreviewContent] = useState({ front: '', back: '' });

  const navigate = useNavigate();

  const handleViewCollections = () => {
    navigate('/collections');
  };

  // Show preview for the flashcard
  const showFlashcardPreview = (front, back) => {
    setPreviewContent({ front, back });
    setPreviewFlipped(false); // Always start with front side
    setShowPreview(true);
  };

  // Handle custom flashcard creation
  const handleCreateCustomFlashcard = async () => {
    // Validate inputs
    if (!frontText.trim() || !backText.trim()) {
      setError('Please provide content for both front and back sides');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      // Here you would typically save this to your database
      const user_id = localStorage.getItem('user_id');
      const response = await fetch(`${config.baseUrl}/save-flashcard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          front: frontText,
          back: backText,
          user_id: user_id,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save flashcard');
      }
      // For now, let's just show a success message and preview
      setSuccessMessage('Custom flashcard created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Show preview of the created flashcard
      showFlashcardPreview(frontText, backText);
      
      // Clear the form
      setFrontText('');
      setBackText('');
    } catch (err) {
      setError('Failed to create flashcard. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Handle AI-generated flashcard creation
  const handleGenerateAIFlashcard = async () => {
    // Validate input
    if (!aiInputText.trim()) {
      setError('Please provide text content for AI generation');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const user_id = localStorage.getItem('user_id');
      const response = await fetch(`${config.baseUrl}/generate-flashcard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: aiInputText, user_id:user_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcard');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Success - show the generated flashcard in preview
      const generatedFront = data.flashcard.front;
      const generatedBack = data.flashcard.back;
      
      showFlashcardPreview(generatedFront, generatedBack);
      
      // Also populate the custom form for editing if needed
      setFrontText(generatedFront);
      setBackText(generatedBack);
      
      // Clear the AI input
      setAiInputText('');
      
      setSuccessMessage('Flashcard generated successfully! You can edit it in the Custom Flashcards section.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.message || 'Error generating flashcard. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  // Flashcard Preview Component
  const FlashcardPreview = () => {
    if (!showPreview) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="text-lg font-semibold">Flashcard Preview</h3>
            <button 
              onClick={() => setShowPreview(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6">
            {/* Flashcard */}
            <div 
              className="bg-white border-2 border-blue-300 rounded-xl h-64 w-full flex items-center justify-center p-6 cursor-pointer relative"
              onClick={() => setPreviewFlipped(!previewFlipped)}
            >
              <div className="text-center">
                {previewFlipped ? (
                  <div className="whitespace-pre-wrap">{previewContent.back}</div>
                ) : (
                  <div className="whitespace-pre-wrap">{previewContent.front}</div>
                )}
              </div>
              
              {/* Flip indicator */}
              <div className="absolute bottom-2 right-2 text-blue-500 flex items-center text-sm">
                <span>Click to flip</span>
                {previewFlipped ? <ArrowLeft size={16} className="ml-1" /> : <ArrowRight size={16} className="ml-1" />}
              </div>
            </div>
            
            {/* Indication of which side is showing */}
            <div className="mt-4 text-center text-gray-500">
              {previewFlipped ? "Back side" : "Front side"}
            </div>
          </div>
          
          <div className="p-4 border-t flex justify-end">
            <button 
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Flashcard Preview Modal */}
      <FlashcardPreview />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Collection Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button onClick={handleViewCollections} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Book size={20} />
            View Collections
            <ChevronRight size={20} />
          </button>
        </motion.div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Creation Methods Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Custom Flashcard Creation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Plus className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-blue-800">Custom Flashcards</h2>
            </div>
            <p className="text-blue-600 mb-6">Create your own flashcards by entering content for both sides</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-blue-700 mb-2">Front Side</label>
                <textarea
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none min-h-[100px]"
                  placeholder="Enter the question or front side content..."
                />
              </div>
              <div>
                <label className="block text-blue-700 mb-2">Back Side</label>
                <textarea
                  value={backText}
                  onChange={(e) => setBackText(e.target.value)}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none min-h-[100px]"
                  placeholder="Enter the answer or back side content..."
                />
              </div>
              <button 
                onClick={handleCreateCustomFlashcard}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Flashcard
              </button>
            </div>
          </motion.div>

          {/* AI Generated Flashcards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-blue-800">AI Generated Flashcards</h2>
            </div>
            <p className="text-blue-600 mb-6">Let AI create flashcards from your text content</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-blue-700 mb-2">Your Content</label>
                <textarea
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none min-h-[240px]"
                  placeholder="Paste your text content here and let AI generate flashcards..."
                  disabled={isGenerating}
                />
              </div>
              <button 
                onClick={handleGenerateAIFlashcard}
                disabled={isGenerating}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Generating...
                  </>
                ) : 'Generate Flashcards'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;