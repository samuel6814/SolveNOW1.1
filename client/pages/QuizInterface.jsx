import React from 'react';
import { useParams } from 'react-router-dom';

const QuizInterface = () => {
  const { id } = useParams(); // Grabs the ID from the URL (e.g., /quiz/101)
  return (
    <div>
      <h1>Quiz Session: {id}</h1>
      <p>Exam Mode / Study Mode</p>
    </div>
  );
};

export default QuizInterface;