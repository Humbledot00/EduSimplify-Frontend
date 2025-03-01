import React from 'react';
import config from './config';
const StoryLearning = () => {
  const handleGenerate = () => {
    alert('Story generated!');
  };

  return (
    <div style={styles.container}>
      <h1>Story-Based Learning</h1>
      <div style={styles.output}>
        <h3>Story Title:</h3>
        <p>The Tale of Mitosis</p>
        <h3>Story Content:</h3>
        <p>Once upon a time, a cell decided to divide itself into two identical cells...</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
  },
  output: {
    marginTop: '20px',
  },
};

export default StoryLearning;