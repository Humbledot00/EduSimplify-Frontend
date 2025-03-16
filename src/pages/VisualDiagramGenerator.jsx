import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import InputBox from '../components/InputBox';
import config from './config';

const VisualDiagramGenerator = () => {
  const [generatedContent, setGeneratedContent] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const [inputText, setInputText] = useState("");
  const [diagramType, setDiagramType] = useState("flowchart");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const diagramRef = useRef(null);
  const diagramId = useRef(`diagram-${Date.now()}`);

  // Initialize mermaid when component mounts
  useEffect(() => {
    if (window.mermaid) {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        flowchart: { 
          useMaxWidth: false,
          htmlLabels: true
        },
        mindmap: {
          padding: 50,
          curve: 'basis'
        }
      });
    } else {
      console.error('Mermaid library not loaded');
      setError('Diagram rendering library not loaded. Please check your internet connection.');
    }
  }, []);
  
  // Render diagram when mermaidCode changes
  useEffect(() => {
    if (mermaidCode && diagramRef.current && window.mermaid) {
      try {
        diagramRef.current.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'mermaid-diagram';
        container.textContent = mermaidCode;
        diagramRef.current.appendChild(container);
        window.mermaid.init(undefined, '.mermaid-diagram');
      } catch (err) {
        console.error('Error rendering diagram:', err);
        setError(`Error rendering diagram: ${err.message}`);
        diagramRef.current.innerHTML = `
          <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p class="font-bold text-yellow-800 mb-2">Diagram rendering failed. Here's the code:</p>
            <pre class="bg-gray-100 p-3 rounded overflow-auto text-sm">${mermaidCode}</pre>
          </div>
        `;
      }
    }
  }, [mermaidCode]);

  const handleGenerate = async (input) => {
    try {
      setIsLoading(true);
      setError(null);
      setGeneratedContent("Generating diagram...");
      diagramId.current = `diagram-${Date.now()}`;
      
      const response = await fetch(`${config.baseUrl}/generate-diagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          input_text: input,
          diagram_type: diagramType 
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (data.mermaid_code) {
        setGeneratedContent(`Generated ${diagramType} for: ${input}`);
        setMermaidCode(data.mermaid_code);
        setInputText(input);
      } else if (data.error) {
        setError(`Error: ${data.error}`);
        setGeneratedContent(`Error: ${data.error}`);
      } else {
        setError('Received invalid response from server');
        setGeneratedContent('Received invalid response from server');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(`${error.message}`);
      setGeneratedContent('An error occurred while generating the diagram. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const user_id = localStorage.getItem('user_id');
    try {
      const response = await fetch(`${config.baseUrl}/save-diagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          input_text: inputText, 
          mermaid_code: mermaidCode,
          diagram_type: diagramType,
          user_id 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save diagram');
      }

      const data = await response.json();
      showNotification(data.message, 'green');
    } catch (error) {
      console.error('Error:', error);
      showNotification('An error occurred while saving the diagram. Please try again.', 'red');
    }
  };

  const handleRegenerate = async () => {
    await handleGenerate(inputText);
  };

  const handleDiagramTypeChange = (type) => {
    setDiagramType(type);
  };

  const downloadSVG = () => {
    if (diagramRef.current) {
      try {
        const svgElement = diagramRef.current.querySelector('svg');
        if (!svgElement) {
          showNotification('No SVG diagram found to download', 'red');
          return;
        }
        
        const svgClone = svgElement.cloneNode(true);
        const viewBox = svgClone.getAttribute('viewBox');
        if (!viewBox) {
          const bbox = svgElement.getBBox();
          svgClone.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
        }
        
        const svgData = new XMLSerializer().serializeToString(svgClone);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${inputText.replace(/\s+/g, '-')}-${diagramType}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('SVG downloaded successfully', 'green');
      } catch (err) {
        console.error('Error downloading SVG:', err);
        showNotification('Failed to download diagram', 'red');
      }
    }
  };

  const showNotification = (message, color) => {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 bg-${color}-600`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-24">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Flex container for two columns */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Visual Diagram Generator and Select Diagram Type */}
          <div className="w-full lg:w-1/2">
            <Hero 
              title="Visual Diagram Generator" 
              subtitle="Simplify complex ideas with visual representations"
              content={generatedContent}
              saveHandler={mermaidCode ? handleSave : null}
              regenerateHandler={inputText ? handleRegenerate : null}
            />
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Diagram Type</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <button 
                  onClick={() => handleDiagramTypeChange("flowchart")}
                  className={`px-5 py-3 rounded-lg transition-all duration-300 flex items-center ${
                    diagramType === "flowchart" 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  Flowchart
                </button>
                <button 
                  onClick={() => handleDiagramTypeChange("mindmap")}
                  className={`px-5 py-3 rounded-lg transition-all duration-300 flex items-center ${
                    diagramType === "mindmap" 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  Mind Map
                </button>
                <button 
                  onClick={() => handleDiagramTypeChange("timeline")}
                  className={`px-5 py-3 rounded-lg transition-all duration-300 flex items-center ${
                    diagramType === "timeline" 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  Timeline
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-medium">Error Occurred</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <InputBox 
              onGenerate={handleGenerate} 
              placeholder="Enter a concept or process (e.g., 'Water Cycle', 'Photosynthesis')"
            />
          </div>

          {/* Right Column: Generated Diagram */}
          <div className="w-full lg:w-1/2">
            {isLoading && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 flex justify-center items-center" style={{minHeight: "300px"}}>
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-blue-600 mx-auto mb-6"></div>
                  <p className="text-lg text-gray-700 font-medium">Generating your {diagramType}...</p>
                </div>
              </div>
            )}

            {mermaidCode && !isLoading && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Generated {diagramType.charAt(0).toUpperCase() + diagramType.slice(1)}
                  </h2>
                  <div className="flex gap-3">
                    <button 
                      onClick={downloadSVG}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Download 
                    </button>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-xl p-6 overflow-auto bg-white shadow-inner" style={{minHeight: "450px"}}>
                  <div ref={diagramRef} className="flex justify-center items-center w-full h-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualDiagramGenerator;