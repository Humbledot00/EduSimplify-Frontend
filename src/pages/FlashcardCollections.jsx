import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit, Trash2, RefreshCcw, Book, Shuffle, BookmarkIcon, Timer, ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import config from './config';
const FlashcardCollections = () => {
  const [flippedCards, setFlippedCards] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showTags, setShowTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [difficulty, setDifficulty] = useState({});
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const user_id = localStorage.getItem('user_id');
        const response = await fetch(`${config.baseUrl}/get-flashcards/${user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch flashcards');
        }
        const data = await response.json();
        console.log('Flashcards:', data);
        
        setFlashcards(data);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    fetchFlashcards();
  }, []);

  // Get unique tags from flashcards
  const allTags = [...new Set(flashcards.flatMap(card => card.tags || []))];

  const handleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFlashcards = flashcards.filter(card => {
    const matchesSearch = card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.back.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => card.tags && card.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const handleEdit = (e, card) => {
    e.stopPropagation();
    console.log('Edit card:', card);
  };

  const handleDelete = async (e, card) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${config.baseUrl}/delete-flashcards/${card._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete flashcard');
      }
      setFlashcards(prev => prev.filter(f => f._id !== card._id));
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  const handleNextCard = () => {
    setCurrentCardIndex(prev => 
      prev < filteredFlashcards.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevCard = () => {
    setCurrentCardIndex(prev => prev > 0 ? prev - 1 : prev);
  };

  const shuffleCards = () => {
    setCurrentCardIndex(0);
    // Implement Fisher-Yates shuffle algorithm here
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleDifficulty = (cardId, level) => {
    setDifficulty(prev => ({
      ...prev,
      [cardId]: level
    }));
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Control Panel */}
        <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-blue-800"
          >
            My Flashcards
          </motion.h1>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setStudyMode(!studyMode)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Book size={20} />
              {studyMode ? 'Exit Study Mode' : 'Study Mode'}
            </button>
            
            <button 
              onClick={shuffleCards}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
            >
              <Shuffle size={20} />
              Shuffle
            </button>

            <button 
              onClick={toggleTimer}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
            >
              <Timer size={20} />
              {formatTime(timer)}
            </button>
          </div>
        </div>

        {/* Search and Tags */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
              <input
                type="text"
                placeholder="Search flashcards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <button 
              onClick={() => setShowTags(!showTags)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
            >
              <BookmarkIcon size={20} />
              Tags
              <ChevronDown size={16} className={`transform transition-transform ${showTags ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showTags && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2"
            >
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTags(prev => 
                    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                  )}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag) 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Study Mode */}
        {studyMode ? (
          <div className="max-w-2xl mx-auto">
            <motion.div className="relative h-96">
              <motion.div
                className="w-full h-full cursor-pointer"
                onClick={() => handleFlip(filteredFlashcards[currentCardIndex].id)}
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={flippedCards[filteredFlashcards[currentCardIndex].id] ? 'back' : 'front'}
                    initial={{ rotateY: flippedCards[filteredFlashcards[currentCardIndex].id] ? -90 : 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: flippedCards[filteredFlashcards[currentCardIndex].id] ? 90 : -90 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full bg-white rounded-xl shadow-lg p-6 absolute backface-hidden"
                  >
                    <div className="h-full flex flex-col">
                      <div className="text-sm text-blue-400 mb-4">
                        Card {currentCardIndex + 1} of {filteredFlashcards.length}
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center text-center">
                        <p className="text-xl text-blue-800">
                          {flippedCards[filteredFlashcards[currentCardIndex].id] 
                            ? filteredFlashcards[currentCardIndex].back 
                            : filteredFlashcards[currentCardIndex].front}
                        </p>
                      </div>

                      {flippedCards[filteredFlashcards[currentCardIndex].id] && (
                        <div className="flex justify-center gap-2 mt-4">
                          <button 
                            onClick={() => handleDifficulty(filteredFlashcards[currentCardIndex].id, 'easy')}
                            className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                          >
                            Easy
                          </button>
                          <button 
                            onClick={() => handleDifficulty(filteredFlashcards[currentCardIndex].id, 'medium')}
                            className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
                          >
                            Medium
                          </button>
                          <button 
                            onClick={() => handleDifficulty(filteredFlashcards[currentCardIndex].id, 'hard')}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          >
                            Hard
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevCard}
                disabled={currentCardIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={20} />
                Previous
              </button>
              <button
                onClick={handleNextCard}
                disabled={currentCardIndex === filteredFlashcards.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlashcards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-64"
              >
                <motion.div
                  className="w-full h-full cursor-pointer"
                  onClick={() => handleFlip(card.id)}
                >
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={flippedCards[card.id] ? 'back' : 'front'}
                      initial={{ rotateY: flippedCards[card.id] ? -90 : 90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: flippedCards[card.id] ? 90 : -90 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full bg-white rounded-xl shadow-lg p-6 absolute backface-hidden"
                    >
                      <div className="h-full flex flex-col">
                        <div className="flex justify-between mb-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={(e) => handleEdit(e, card)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={(e) => handleDelete(e, card)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <div className="flex gap-2">
                            {(card.tags || []).map(tag => (
                              <span key={tag} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex-1 flex items-center justify-center text-center">
                          <p className="text-lg text-blue-800">
                            {flippedCards[card.id] ? card.back : card.front}
                          </p>
                        </div>
                        
                        <p className="text-sm text-blue-400 text-center mt-4">
                          Click to see {flippedCards[card.id] ? 'question' : 'answer'}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format timer
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default FlashcardCollections;