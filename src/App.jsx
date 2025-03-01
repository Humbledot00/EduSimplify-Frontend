import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import pages
import LearningPlatform from './components/LearningPlatform';
import MnemonicGenerator from './pages/MnemonicGenerator';
import StoryLearning from './pages/StoryLearning';
import Flashcards from './pages/Flashcards';
import VisualAids from './pages/VisualAids';
import Summarization from './pages/Summarization';
import Gamification from './pages/Gamification';
import Profile from './pages/Profile';
import FlashcardCollections from './pages/FlashcardCollections';
import LoginPage from './pages/LoginPage';
import AboutUs from './pages/AboutUs';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const App = () => {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route 
            path="/home" 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                <LearningPlatform />
              </motion.div>
            } 
          />
          <Route 
            path="/mnemonic" 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                <MnemonicGenerator />
              </motion.div>
            } 
          />
          <Route 
            path="/story" 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                <StoryLearning />
              </motion.div>
            } 
          />
          <Route 
            path="/" 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                <LoginPage />
              </motion.div>
            } 
          />
          <Route 
            path="/flashcards" 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                <Flashcards />
              </motion.div>
            } 
          />
          <Route 
            path="/visual-aids" 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                <VisualAids />
              </motion.div>
            } 
          />
          <Route 
            path="/summarization" 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                <Summarization />
              </motion.div>
            } 
          />
          <Route 
            path="/gamification" 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                <Gamification />
              </motion.div>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                <Profile />
              </motion.div>
            } 
          />

          <Route 
            path="/collections" 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                <FlashcardCollections />
              </motion.div>
            } 
          />

<Route 
            path="/about" 
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                <AboutUs />
              </motion.div>
            } 
          />
          {/* 404 Page */}
        
          {/* Redirect unknown routes to 404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default App;