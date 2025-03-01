import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBrain, FaLightbulb, FaBookOpen, FaUsers } from 'react-icons/fa';

const AboutUs = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">About BodhiMent</h1>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              At BodhiMent, we're revolutionizing the way you learn and retain information. Our name combines "Bodhi" (enlightenment) 
              with "Ment" (mind), reflecting our mission to enlighten minds through innovative learning technologies.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We believe that everyone deserves access to powerful learning tools that adapt to their unique needs. 
              By harnessing the power of artificial intelligence, we've created a platform that transforms complex 
              information into memorable, engaging content tailored just for you.
            </p>
          </div>
          
          {/* Features Section */}
          <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">Our Learning Tools</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <FaLightbulb className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-blue-700">Mnemonics Generator</h3>
              </div>
              <p className="text-gray-600">
                Create powerful memory hooks with our AI-powered mnemonic generator, making it easier 
                to recall complex sequences, lists, and facts.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 rounded-full mr-3">
                  <FaBookOpen className="text-green-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-green-700">Story-Based Learning</h3>
              </div>
              <p className="text-gray-600">
                Transform dry facts into engaging narratives that make learning enjoyable and 
                memorable, leveraging the power of storytelling.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 rounded-full mr-3">
                  <FaBrain className="text-purple-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-purple-700">Smart Flashcards</h3>
              </div>
              <p className="text-gray-600">
                Create concise, effective flashcards instantly for quick review and reinforcement 
                of key concepts and information.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-yellow-100 rounded-full mr-3">
                  <FaUsers className="text-yellow-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-yellow-700">Personalized Learning</h3>
              </div>
              <p className="text-gray-600">
                Our platform adapts to your learning style with summaries, quizzes, and 
                interactive content tailored to your specific needs.
              </p>
            </div>
          </div>
          
          {/* How It Works */}
          <div className="bg-blue-50 rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">How BodhiMent Works</h2>
            <ol className="space-y-4">
              <li className="flex">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</span>
                <div>
                  <h3 className="font-semibold text-blue-800 text-lg">Input Your Content</h3>
                  <p className="text-gray-600">Enter the information or topic you want to learn.</p>
                </div>
              </li>
              <li className="flex">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</span>
                <div>
                  <h3 className="font-semibold text-blue-800 text-lg">Choose Your Learning Tool</h3>
                  <p className="text-gray-600">Select from mnemonics, stories, flashcards, summaries, or quizzes.</p>
                </div>
              </li>
              <li className="flex">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</span>
                <div>
                  <h3 className="font-semibold text-blue-800 text-lg">Get Personalized Content</h3>
                  <p className="text-gray-600">Our AI transforms your input into effective learning materials.</p>
                </div>
              </li>
              <li className="flex">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">4</span>
                <div>
                  <h3 className="font-semibold text-blue-800 text-lg">Save & Review</h3>
                  <p className="text-gray-600">Store your materials in your profile for continuous learning and recall.</p>
                </div>
              </li>
            </ol>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Ready to Transform Your Learning?</h2>
            <p className="text-gray-700 mb-6">
              Join thousands of students who have already discovered the power of BodhiMent's learning tools.
            </p>
            <button 
              onClick={() => navigate('/home')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;