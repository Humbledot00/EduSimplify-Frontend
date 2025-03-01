import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Book, Clipboard, Star, Trash, LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import config from './config';

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    joined: "",
  });

  const [flashcards, setFlashcards] = useState([]);
  const [mnemonics, setMnemonics] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('flashcards');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Fetch saved data from MongoDB
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user_id = localStorage.getItem('user_id');
      const email = localStorage.getItem('userEmail');
      if (!email) {
        throw new Error('User email not found');
      }

      // Fetch user data
      const userResponse = await fetch(`${config.baseUrl}/user/${email}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await userResponse.json();
      setUser({
        name: userData.username,
        email: userData.email,
        joined: userData.created_at.split('T')[0],
      });

      // Fetch flashcards
      const flashcardsResponse = await fetch(`${config.baseUrl}/get-flashcards/${user_id}`);
      if (!flashcardsResponse.ok) {
        throw new Error('Failed to fetch flashcards');
      }
      const flashcardsData = await flashcardsResponse.json();
      setFlashcards(flashcardsData);

      // Fetch mnemonics
      const mnemonicsResponse = await fetch(`${config.baseUrl}/get-mnemonics/${user_id}`);
      if (!mnemonicsResponse.ok) {
        throw new Error('Failed to fetch mnemonics');
      }
      const mnemonicsData = await mnemonicsResponse.json();
      setMnemonics(mnemonicsData);

      // Fetch stories
      const storiesResponse = await fetch(`${config.baseUrl}/get-stories/${user_id}`);
      if (!storiesResponse.ok) {
        throw new Error('Failed to fetch stories');
      }
      const storiesData = await storiesResponse.json();
      setStories(storiesData);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Determine the current collection based on active tab
  const getCurrentCollection = () => {
    switch (activeTab) {
      case 'flashcards': return flashcards;
      case 'mnemonics': return mnemonics;
      case 'stories': return stories;
      default: return [];
    }
  };

  // Handle item selection
  const handleItemClick = (item, index) => {
    setSelectedItem(item);
    setCurrentIndex(index);
    setShowDetailView(true);
  };

  // Navigate to next item
  const handleNext = () => {
    const collection = getCurrentCollection();
    const nextIndex = (currentIndex + 1) % collection.length;
    setSelectedItem(collection[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  // Navigate to previous item
  const handlePrevious = () => {
    const collection = getCurrentCollection();
    const prevIndex = (currentIndex - 1 + collection.length) % collection.length;
    setSelectedItem(collection[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  // Close detail view
  const handleCloseDetail = () => {
    setShowDetailView(false);
    setSelectedItem(null);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  // Delete functions
  const deleteFlashcard = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${config.baseUrl}/delete-flashcards/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFlashcards(flashcards.filter((flashcard) => flashcard._id !== id));
        if (showDetailView && selectedItem && selectedItem._id === id) {
          handleCloseDetail();
        }
      }
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  const deleteMnemonic = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${config.baseUrl}/delete-mnemonics/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMnemonics(mnemonics.filter((mnemonic) => mnemonic._id !== id));
        if (showDetailView && selectedItem && selectedItem._id === id) {
          handleCloseDetail();
        }
      }
    } catch (error) {
      console.error("Error deleting mnemonic:", error);
    }
  };

  const deleteStory = async (id, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${config.baseUrl}/stories/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setStories(stories.filter((story) => story._id !== id));
        if (showDetailView && selectedItem && selectedItem._id === id) {
          handleCloseDetail();
        }
      }
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  // Date formatting helper
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get appropriate icon for the active tab
  const getActiveIcon = () => {
    switch (activeTab) {
      case 'flashcards': return <Book className="text-blue-600" size={24} />;
      case 'mnemonics': return <Clipboard className="text-blue-600" size={24} />;
      case 'stories': return <Star className="text-blue-600" size={24} />;
      default: return <Book className="text-blue-600" size={24} />;
    }
  };

  // Render detail view based on item type
  const renderDetailView = () => {
    if (!selectedItem) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
        onClick={handleCloseDetail}
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          layout
        >
          {/* Header with navigation */}
          <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
            <div className="flex items-center space-x-2">
              {getActiveIcon()}
              <h3 className="font-bold text-lg">
                {activeTab === 'flashcards' 
                  ? 'Flashcard'
                  : activeTab === 'mnemonics'
                    ? 'Mnemonic'
                    : 'Story'}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePrevious}
                className="p-2 hover:bg-blue-700 rounded-full"
                aria-label="Previous item"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm">
                {currentIndex + 1} of {getCurrentCollection().length}
              </span>
              <button 
                onClick={handleNext}
                className="p-2 hover:bg-blue-700 rounded-full"
                aria-label="Next item"
              >
                <ChevronRight size={20} />
              </button>
              <button 
                onClick={handleCloseDetail}
                className="p-2 hover:bg-blue-700 rounded-full ml-2"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6 max-h-[70vh]">
            {activeTab === 'flashcards' && (
              <div className="space-y-6">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <div className="bg-blue-100 rounded-xl p-6 flex items-center justify-center text-center">
                    <h2 className="text-xl font-bold text-blue-800">{selectedItem.front}</h2>
                  </div>
                </div>
                <div className="border-t border-blue-100 pt-4">
                  <h3 className="text-sm text-blue-600 font-medium mb-2">Answer:</h3>
                  <p className="text-gray-800 whitespace-pre-line">{selectedItem.back}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span>Created: {formatDate(selectedItem.created_at)}</span>
                </div>
              </div>
            )}

            {activeTab === 'mnemonics' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm text-blue-600 font-medium mb-2">Topic:</h3>
                  <p className="text-xl font-bold text-blue-800">{selectedItem.input_text}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-sm text-blue-600 font-medium mb-2">Mnemonic:</h3>
                  <p className="text-gray-800 whitespace-pre-line">{selectedItem.mnemonic}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span>Created: {formatDate(selectedItem.created_at)}</span>
                </div>
              </div>
            )}

            {activeTab === 'stories' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm text-blue-600 font-medium mb-2">Topic:</h3>
                  <p className="text-xl font-bold text-blue-800">{selectedItem.input_text}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-sm text-blue-600 font-medium mb-2">Story:</h3>
                  <p className="text-gray-800 whitespace-pre-line">{selectedItem.story}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span>Created: {formatDate(selectedItem.created_at)}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="p-4 rounded-lg bg-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <span className="text-blue-800 font-medium">Loading your learning materials...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* User Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-800">{user.name}</h2>
                <p className="text-sm text-blue-600">{user.email}</p>
                <p className="text-xs text-blue-400">Joined: {formatDate(user.joined)}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Tabbed Interface */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tab Buttons */}
          <div className="flex border-b border-blue-100">
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`flex-1 p-4 text-center ${
                activeTab === 'flashcards'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              } transition-colors`}
            >
              <Book className="inline-block mr-2" size={18} />
              Flashcards
            </button>
            <button
              onClick={() => setActiveTab('mnemonics')}
              className={`flex-1 p-4 text-center ${
                activeTab === 'mnemonics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              } transition-colors`}
            >
              <Clipboard className="inline-block mr-2" size={18} />
              Mnemonics
            </button>
            <button
              onClick={() => setActiveTab('stories')}
              className={`flex-1 p-4 text-center ${
                activeTab === 'stories'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              } transition-colors`}
            >
              <Star className="inline-block mr-2" size={18} />
              Stories
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'flashcards' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                key="flashcards"
              >
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Your Flashcards</h3>
                {flashcards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {flashcards.map((flashcard, index) => (
                      <motion.div 
                        key={flashcard._id} 
                        className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-md border border-blue-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleItemClick(flashcard, index)}
                      >
                        <div className="p-4 border-b border-blue-100 bg-blue-500 text-white">
                          <div className="flex justify-between items-center">
                            <span className="font-medium truncate">Flashcard</span>
                            <button
                              onClick={(e) => deleteFlashcard(flashcard._id, e)}
                              className="p-1 hover:bg-red-500 rounded-full" 
                              aria-label="Delete flashcard"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 h-32 flex flex-col justify-between">
                          <div>
                            <p className="font-semibold text-blue-800 line-clamp-2">{flashcard.front}</p>
                            <p className="text-xs text-blue-600 mt-1 line-clamp-2">{flashcard.back}</p>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            {formatDate(flashcard.created_at)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-blue-50 rounded-lg">
                    <Book className="mx-auto text-blue-300 mb-2" size={32} />
                    <p className="text-blue-600">No flashcards saved yet.</p>
                    <p className="text-sm text-blue-400">Create flashcards to help you memorize key concepts.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'mnemonics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                key="mnemonics"
              >
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Your Mnemonics</h3>
                {mnemonics.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mnemonics.map((mnemonic, index) => (
                      <motion.div 
                        key={mnemonic._id} 
                        className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleItemClick(mnemonic, index)}
                      >
                        <div className="p-4 border-b border-green-100 bg-green-500 text-white">
                          <div className="flex justify-between items-center">
                            <span className="font-medium truncate">Mnemonic</span>
                            <button
                              onClick={(e) => deleteMnemonic(mnemonic._id, e)}
                              className="p-1 hover:bg-red-500 rounded-full"
                              aria-label="Delete mnemonic"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 h-32 flex flex-col justify-between">
                          <div>
                            <p className="font-semibold text-green-800 line-clamp-2">{mnemonic.input_text}</p>
                            <p className="text-xs text-green-600 mt-1 line-clamp-2">{mnemonic.mnemonic}</p>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            {formatDate(mnemonic.created_at)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-green-50 rounded-lg">
                    <Clipboard className="mx-auto text-green-300 mb-2" size={32} />
                    <p className="text-green-600">No mnemonics saved yet.</p>
                    <p className="text-sm text-green-400">Create mnemonics to remember complex information easily.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'stories' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                key="stories"
              >
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Your Stories</h3>
                {stories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stories.map((story, index) => (
                      <motion.div 
                        key={story._id} 
                        className="bg-gradient-to-br from-purple-50 to-white rounded-lg shadow-md border border-purple-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleItemClick(story, index)}
                      >
                        <div className="p-4 border-b border-purple-100 bg-purple-500 text-white">
                          <div className="flex justify-between items-center">
                            <span className="font-medium truncate">Story</span>
                            <button
                              onClick={(e) => deleteStory(story._id, e)}
                              className="p-1 hover:bg-red-500 rounded-full"
                              aria-label="Delete story"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 h-32 flex flex-col justify-between">
                          <div>
                            <p className="font-semibold text-purple-800 line-clamp-2">{story.input_text}</p>
                            <p className="text-xs text-purple-600 mt-1 line-clamp-2">{story.story}</p>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            {formatDate(story.created_at)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-purple-50 rounded-lg">
                    <Star className="mx-auto text-purple-300 mb-2" size={32} />
                    <p className="text-purple-600">No stories saved yet.</p>
                    <p className="text-sm text-purple-400">Create stories to make learning more engaging and memorable.</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Detail View Modal */}
      <AnimatePresence>
        {showDetailView && renderDetailView()}
      </AnimatePresence>
    </div>
  );
};

export default Profile;