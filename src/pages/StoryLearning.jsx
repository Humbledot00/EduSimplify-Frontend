import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import InputBox from '../components/InputBox';
import config from './config';
const StoryLearning = () => {
  const [generatedContent, setGeneratedContent] = useState(
    "Welcome to Story-Based Learning! This tool transforms complex concepts into memorable stories."
  );
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (input) => {
    setLoading(true);
    if (!input) {
      setGeneratedContent("Please enter a concept or topic to generate a story.");
      return;
    }

    try {
      // Send a POST request to the backend
      const response = await fetch(`${config.baseUrl}/generate-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      // Parse the JSON response
      const data = await response.json();

      // Update the generated content with the response from the backend
      if (data.story) {
        setGeneratedContent(data.story); // Display the story
        setInputText(input);
      } else if (data.error) {
        setGeneratedContent(`**Error:** ${data.error}`); // Display error in Markdown
      }
    } catch (error) {
      console.error('Error:', error);
      setGeneratedContent('**Error:** An error occurred while generating the story. Please try again.');
    }finally {
      setLoading(false); // 👈 End loading
    }
  };

  const handleSave = async () => {
    try {
      const user_id = localStorage.getItem('user_id');
      const response = await fetch(`${config.baseUrl}/save-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: inputText, story: generatedContent,user_id:user_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to save story');
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the story. Please try again.');
    }
  };

  const handleRegenerate = async () => {
    await handleGenerate(inputText);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Use ReactMarkdown to render the generated content */}
        <Hero 
          title="Story Based Learning" 
          content={generatedContent}
          saveHandler={handleSave}
          regenerateHandler={handleRegenerate}
        />
      </div>
      
      <InputBox 
        onGenerate={handleGenerate}
      />
    </div>
  );
};

export default StoryLearning;