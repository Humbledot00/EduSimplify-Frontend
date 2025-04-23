import { useState } from 'react';
import { BookOpen, Sparkles, Send, Loader2, RefreshCw } from 'lucide-react';
import config from './config';
import Header from '../components/Header';

export default function KeywordMnemonicGenerator() {
  const [concept, setConcept] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [animation, setAnimation] = useState(false);

  // API call to generate mnemonic
  const generateMnemonic = async (conceptText) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${config.baseUrl}/keyword-mnemonic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: conceptText }),
      });

      if (!response.ok) throw new Error('Failed to generate mnemonic');

      const data = await response.json();
      
      
      if (data.success) {
        console.log(data.mnemonic);
        
        setMnemonic(data.mnemonic);
        setAnimation(true);
        setTimeout(() => setAnimation(false), 1500);
      } else {
        setError(data.error || 'Failed to generate mnemonic. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while connecting to the server.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (concept.trim()) {
      generateMnemonic(concept);
    }
  };

  const examples = [
    "Software Development Life Cycle: Planning, defining, designing, building, testing, deployment",
    "Planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune",
    "Seven layers of OSI model: Physical, Data Link, Network, Transport, Session, Presentation, Application"
  ];

  const handleExampleClick = (example) => {
    setConcept(example);
  };

  return (
    <>
    <Header />
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Mnemonic Magic
            </h1>
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <p className="mt-2 opacity-90">Transform complex concepts into memorable phrases</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <label className="block text-gray-700 mb-2 font-medium">Enter your concept:</label>
            <textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              rows={4}
              placeholder="Enter concepts, steps, or items you want to remember..."
              required
            />
            
            <button
              type="submit"
              disabled={isLoading || !concept.trim()}
              className={`mt-4 flex items-center justify-center gap-2 py-2 px-6 rounded-lg text-white font-medium transition-all ${
                isLoading || !concept.trim() 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Generate Mnemonic
                </>
              )}
            </button>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          {mnemonic && (
            <div className="mt-6">
              <h2 className="text-md md:text-lg font-medium text-gray-700 mb-2">Your Mnemonic:</h2>
              <div className={`bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-6 rounded-lg border border-purple-100 transition-all duration-500 ${
                animation ? 'scale-105 shadow-lg' : ''
              }`}>
                {/* Words display - flexible for mobile */}
                <div className="flex flex-wrap items-center mb-4 justify-center relative">
                  <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full">
                    {mnemonic.split(' ').map((word, index) => (
                      <span 
                        key={index} 
                        className={`inline-block text-lg md:text-xl font-bold ${
                          index % 2 === 0 ? 'text-purple-600' : 'text-blue-600'
                        }`}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                  <div className="absolute right-0 top-0">
                    <RefreshCw 
                      className="h-4 w-4 md:h-5 md:w-5 text-gray-400 hover:text-purple-600 cursor-pointer transition-all" 
                      onClick={() => concept && generateMnemonic(concept)}
                    />
                  </div>
                </div>

                {/* Circles display - adaptive grid */}
                <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 justify-items-center">
                  {mnemonic.split(' ').map((word, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                        {word[0]}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500 mt-1">{index + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Try these examples:</h3>
            <div className="space-y-2">
              {examples.map((example, index) => (
                <div 
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-all text-sm"
                >
                  {example}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}