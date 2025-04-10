import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Trophy, Timer, Star,
  Award, Target, CheckCircle, XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import config from './config';

const Gamification = () => {
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState(null);
  const [inputText, setInputText] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [showResults, setShowResults] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state

  const generateQuestions = async (text) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.baseUrl}/generate-mcqs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: text }),
      });

      if (!response.ok) throw new Error('Failed to generate questions');

      const data = await response.json();
      const formattedQuestions = data.mcqs.map((mcq) => {
        const correctLetter = mcq.correct_answer.trim();
        const correctIndex = { A: 0, B: 1, C: 2, D: 3 }[correctLetter] ?? 0;

        return {
          question: mcq.question,
          options: mcq.options.map(opt => opt.trim()),
          correct: correctIndex,
          points: 10,
          difficulty: "medium",
        };
      });

      setQuestions(formattedQuestions);
      return formattedQuestions;
    } catch (error) {
      console.error("Error generating questions:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setShowResults(false);
    setCurrentQuestion(0);
    setScore(0);
    setTimer(30);
    setStreakCount(0);
    setMaxStreak(0);
    setSelectedAnswer(null);
    setTimerActive(false);
    setQuestions([]);
  };

  const startGame = async () => {
    resetGame();
    if (inputText) {
      const generatedQuestions = await generateQuestions(inputText);
      if (generatedQuestions.length > 0) {
        setGameStarted(true);
        setTimerActive(true);
      }
    }
  };

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === questions[currentQuestion].correct;

    if (correct) {
      setScore(prev => prev + questions[currentQuestion].points);
      setStreakCount(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streakCount + 1));
    } else {
      setStreakCount(0);
    }

    setTimerActive(false);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setTimer(30);
        setTimerActive(true);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const handleTimerEnd = () => {
    if (selectedAnswer === null) setStreakCount(0);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setTimer(30);
      setTimerActive(true);
    } else {
      setShowResults(true);
      setTimerActive(false);
    }
  };

  useEffect(() => {
    if (gameStarted && timerActive && !showResults && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && timerActive) {
      setTimerActive(false);
      handleTimerEnd();
    }
  }, [gameStarted, showResults, timer, timerActive, currentQuestion]);

  useEffect(() => {
    return () => resetGame();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-blue-800">Learning Games</h1>
        </div>

        {!gameMode ? (
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer"
              onClick={() => setGameMode('quiz')}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Target className="text-blue-600" size={32} />
                </div>
                <h2 className="text-xl font-semibold text-blue-800">Quiz Challenge</h2>
                <p className="text-blue-600">Test your knowledge with timed questions and earn points!</p>
              </div>
            </motion.div>
          </div>
        ) : !gameStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Enter Your Learning Content</h2>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-4 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none min-h-[200px]"
                placeholder="Paste your text content here to generate questions..."
              />
              <button
                onClick={startGame}
                className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {loading ? (
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </div>
                ) : (
                  "Start Game"
                )}
              </button>
            </div>
          </motion.div>
        ) : showResults ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Award className="text-blue-600 mx-auto mb-4" size={48} />
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Game Complete!</h2>
              <p className="text-xl text-blue-600 mb-6">Your Score: {score} points</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Trophy className="text-blue-600 mx-auto mb-2" size={24} />
                  <p className="text-sm text-blue-600">Highest Streak: {maxStreak}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Star className="text-blue-600 mx-auto mb-2" size={24} />
                  <p className="text-sm text-blue-600">
                    Accuracy: {questions.length > 0 ? Math.round((score / (questions.length * 10)) * 100) : 0}%
                  </p>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setGameStarted(false);
                    setShowResults(false);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  New Game
                </button>
                <button
                  onClick={() => {
                    setGameMode(null);
                    resetGame();
                  }}
                  className="px-6 py-3 bg-gray-200 text-blue-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {questions.length > 0 && currentQuestion < questions.length ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Trophy size={20} className="text-blue-600" />
                    <span className="text-blue-800 font-semibold">{score} points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer size={20} className="text-blue-600" />
                    <span className={`font-semibold ${timer < 10 ? 'text-red-600' : 'text-blue-800'}`}>{timer}s</span>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-sm text-blue-600 mb-2">
                    Question {currentQuestion + 1} of {questions.length}
                  </h3>
                  <p className="text-xl text-blue-800 font-semibold">
                    {questions[currentQuestion].question}
                  </p>
                </div>
                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-lg text-left transition-colors ${
                        selectedAnswer === null
                          ? 'bg-blue-50 hover:bg-blue-100 text-blue-800'
                          : selectedAnswer === index
                          ? index === questions[currentQuestion].correct
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          : index === questions[currentQuestion].correct
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-50 text-blue-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {selectedAnswer !== null && index === questions[currentQuestion].correct && (
                          <CheckCircle size={20} className="text-green-600" />
                        )}
                        {selectedAnswer === index && index !== questions[currentQuestion].correct && (
                          <XCircle size={20} className="text-red-600" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <p>Loading questions...</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Gamification;
