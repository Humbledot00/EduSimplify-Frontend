import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import InputBox from '../components/InputBox';
import config from './config';

const MnemonicGenerator = () => {
  const [generatedContent, setGeneratedContent] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false); // 👈 new loading state

  const handleGenerate = async (input) => {
    setLoading(true); // 👈 Start loading
    try {
      const response = await fetch(`${config.baseUrl}/generate-mnemonic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: input }),
      });

      if (!response.ok) throw new Error('Failed to generate mnemonic');

      const data = await response.json();

      if (data.mnemonic) {
        setGeneratedContent(`Generated mnemonic for: ${input}\n${data.mnemonic}`);
        setMnemonic(data.mnemonic);
        setInputText(input);
      } else if (data.error) {
        setGeneratedContent(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setGeneratedContent('An error occurred while generating the mnemonic. Please try again.');
    } finally {
      setLoading(false); // 👈 End loading
    }
  };

  const handleSave = async () => {
    const user_id = localStorage.getItem('user_id');
    try {
      const response = await fetch(`${config.baseUrl}/save-mnemonic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: inputText, mnemonic, user_id }),
      });

      if (!response.ok) throw new Error('Failed to save mnemonic');

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the mnemonic. Please try again.');
    }
  };

  const handleRegenerate = async () => {
    await handleGenerate(inputText);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Hero 
          title="Mnemonic Generator" 
          content={generatedContent}
          saveHandler={handleSave}
          regenerateHandler={handleRegenerate}
        />
      </div>
      <InputBox onGenerate={handleGenerate} loading={loading} />
    </div>
  );
};

export default MnemonicGenerator;
