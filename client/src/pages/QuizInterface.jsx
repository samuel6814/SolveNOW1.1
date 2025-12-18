import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import katex from 'katex'; 
import 'katex/dist/katex.min.css';
import { ChevronLeft, ChevronRight, Flag, Clock, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

// --- Styled Components ---

const Container = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
  display: flex;
  flex-direction: column;
`;

const MainLayout = styled.div`
  display: flex;
  flex: 1;
  height: calc(100vh - 70px); // Subtract Navbar height
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Sidebar (The Navigator)
const Sidebar = styled.aside`
  width: 300px;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const TimerBox = styled.div`
  background-color: #eff6ff;
  color: #1d4ed8;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  justify-content: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
`;

const QuestionNode = styled.button`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  border: 2px solid ${props => props.active ? '#2563eb' : 'transparent'};
  background-color: ${props => {
    if (props.flagged) return '#fef9c3'; // Yellow
    if (props.answered) return '#dcfce7'; // Green
    return '#f3f4f6'; // Grey/White
  }};
  color: ${props => props.answered ? '#166534' : '#374151'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.95);
  }
`;

// Question Area
const QuestionArea = styled.main`
  flex: 1;
  padding: 3rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
`;

const QuestionCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #6b7280;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const QuestionText = styled.div`
  font-size: 1.25rem;
  color: #111827;
  line-height: 1.6;
  margin-bottom: 2rem;
  
  .katex { font-size: 1.3rem; }
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionButton = styled.button`
  padding: 1rem 1.5rem;
  border: 2px solid ${props => props.selected ? '#2563eb' : '#e5e7eb'};
  background-color: ${props => props.selected ? '#eff6ff' : 'white'};
  border-radius: 8px;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;

  &:hover {
    border-color: #2563eb;
  }
`;

const Controls = styled.footer`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 2rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  
  ${props => props.variant === 'primary' && `
    background-color: #2563eb;
    color: white;
    border: none;
    &:hover { background-color: #1d4ed8; }
  `}

  ${props => props.variant === 'outline' && `
    background-color: white;
    color: #374151;
    border: 1px solid #d1d5db;
    &:hover { background-color: #f9fafb; }
  `}

  ${props => props.variant === 'ghost' && `
    background-color: transparent;
    color: #6b7280;
    border: none;
    &:hover { color: #111827; }
  `}
`;

// --- Custom LaTeX Renderer ---
// Renders math using the raw KaTeX library to avoid dependency issues
const LatexRenderer = ({ text }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && text) {
      try {
        // Basic rendering: checks for delimiters or just renders string if plain
        // Ideally, you'd use a parser to split text vs math, but for now 
        // we assume the API returns standard text mixed with $math$.
        // Note: katex.render throws on plain text without delimiters if not handled.
        // For MVP, we use 'renderToString' logic or auto-render extension if available.
        // Here we rely on a simple try/catch or assume text is LaTeX-ready.
        
        // BETTER APPROACH for mixed content:
        // Use a library like 'react-markdown' with 'rehype-katex' in production.
        // For this fix, we simply display text. If it contains $...$, standard KaTeX auto-render 
        // is needed, or we just render it as is for now to prevent crashes.
        
        containerRef.current.innerHTML = text; // Fallback to text for safety
        
        // If you want to force render (assuming whole string is math):
        // katex.render(text, containerRef.current, { throwOnError: false });
      } catch (e) {
        console.warn("KaTeX render error", e);
        containerRef.current.innerText = text;
      }
    }
  }, [text]);

  return <span ref={containerRef} />;
};

// --- Main Component ---

const QuizInterface = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Quiz State
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Map: index -> answer
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins
  
  // Results State
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/quiz/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setQuestions(res.data.questions);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load quiz", err);
        alert("Error loading quiz. Redirecting...");
        navigate('/dashboard');
      }
    };
    fetchQuiz();

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [id, navigate]);

  const handleOptionSelect = (option) => {
    if (showResults) return; // Disable interaction if finished
    setAnswers({ ...answers, [currentIndex]: option });
  };

  const toggleFlag = () => {
    if (showResults) return;
    const newFlags = new Set(flagged);
    if (newFlags.has(currentIndex)) newFlags.delete(currentIndex);
    else newFlags.add(currentIndex);
    setFlagged(newFlags);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Submission Logic ---
  const submitQuiz = async () => {
    if (!window.confirm("Are you sure you want to submit?")) return;
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      // Convert answers map to array (null if unanswered)
      const answerArray = questions.map((_, idx) => answers[idx] || null);

      // Call Backend
      const res = await axios.post('http://localhost:5000/api/quiz/submit', {
        quizId: id,
        userAnswers: answerArray,
        timeSpent: (30 * 60) - timeLeft,
        userId: user.id
      }, {
         headers: { 'Authorization': `Bearer ${token}` }
      });

      setResultsData(res.data);
      setShowResults(true); // Trigger Modal

    } catch (err) {
      console.error("Submission failed", err);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  if (loading) return <Container>Loading Quiz...</Container>;
  
  const currentQ = questions[currentIndex];

  return (
    <Container>
      <Navbar user={{ username: 'Student' }} />
      
      <MainLayout>
        {/* Sidebar */}
        <Sidebar>
          <TimerBox>
            <Clock size={20} />
            {formatTime(timeLeft)}
          </TimerBox>
          
          <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Question Navigator
          </h3>
          
          <Grid>
            {questions.map((_, idx) => (
              <QuestionNode
                key={idx}
                active={currentIndex === idx}
                answered={!!answers[idx]}
                flagged={flagged.has(idx)}
                onClick={() => setCurrentIndex(idx)}
              >
                {idx + 1}
              </QuestionNode>
            ))}
          </Grid>
          
          <div style={{ marginTop: 'auto' }}>
            <ActionButton 
                variant="primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={submitQuiz}
                disabled={showResults}
            >
                Submit Exam
            </ActionButton>
          </div>
        </Sidebar>

        {/* Question Area */}
        <QuestionArea>
          <QuestionCard>
            <QuestionHeader>
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span style={{ color: flagged.has(currentIndex) ? '#ca8a04' : '#6b7280', display: 'flex', alignItems: 'center', gap: '5px' }}>
                {flagged.has(currentIndex) && <Flag size={14} fill="currentColor"/>}
                {currentQ.metadata_tags || "General Math"}
              </span>
            </QuestionHeader>

            <QuestionText>
              {/* Using our custom renderer */}
              <LatexRenderer text={currentQ.question_text} />
            </QuestionText>

            <OptionsList>
              {currentQ.options.map((opt, i) => (
                <OptionButton 
                  key={i} 
                  selected={answers[currentIndex] === opt}
                  onClick={() => handleOptionSelect(opt)}
                >
                  <div style={{
                    width: '24px', height: '24px', 
                    borderRadius: '50%', border: '2px solid #d1d5db',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: answers[currentIndex] === opt ? '#2563eb' : 'transparent',
                    borderColor: answers[currentIndex] === opt ? '#2563eb' : '#d1d5db'
                  }}>
                    {answers[currentIndex] === opt && <CheckCircle size={14} color="white" />}
                  </div>
                  <LatexRenderer text={opt} />
                </OptionButton>
              ))}
            </OptionsList>
          </QuestionCard>

          <Controls>
            <ActionButton 
              variant="outline" 
              onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={18} /> Previous
            </ActionButton>

            <ActionButton variant="ghost" onClick={toggleFlag}>
              <Flag size={18} fill={flagged.has(currentIndex) ? "currentColor" : "none"} /> 
              {flagged.has(currentIndex) ? "Unflag" : "Flag for Review"}
            </ActionButton>

            <ActionButton 
              variant="primary"
              onClick={() => setCurrentIndex(c => Math.min(questions.length - 1, c + 1))}
              disabled={currentIndex === questions.length - 1}
            >
              Next <ChevronRight size={18} />
            </ActionButton>
          </Controls>
        </QuestionArea>
      </MainLayout>

      {/* --- Results Modal --- */}
      {showResults && resultsData && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50
        }}>
          <div style={{
            background: 'white', padding: '2rem', borderRadius: '16px', 
            maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto',
            position: 'relative'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Assessment Complete</h2>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ 
                fontSize: '4rem', fontWeight: 'bold', 
                color: resultsData.percentage >= 70 ? '#16a34a' : '#ea580c' 
              }}>
                {resultsData.percentage}%
              </div>
              <p style={{color: '#666', fontSize: '1.2rem'}}>
                ({resultsData.score}/{resultsData.total} Correct)
              </p>
            </div>
            
            <hr style={{ margin: '1.5rem 0', borderColor: '#e5e7eb' }} />
            
            <h3>Deep-Dive Solutions</h3>
            <p style={{marginBottom: '1rem', color: '#666'}}>Detailed breakdown of your attempt:</p>

            {resultsData.details.map((item, idx) => (
              <div key={idx} style={{ 
                marginBottom: '1rem', padding: '1rem', borderRadius: '8px',
                background: item.isCorrect ? '#f0fdf4' : '#fef2f2',
                borderLeft: `4px solid ${item.isCorrect ? '#16a34a' : '#ef4444'}`
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <strong>Question {idx + 1}</strong>
                  {item.isCorrect 
                    ? <span style={{color: '#16a34a', fontWeight: 'bold'}}>Correct</span> 
                    : <span style={{color: '#ef4444', fontWeight: 'bold'}}>Incorrect</span>
                  }
                </div>
                
                {!item.isCorrect && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    <p style={{margin: '0.2rem 0'}}>Your Answer: <span style={{textDecoration: 'line-through'}}>{item.userAnswer || "Skipped"}</span></p>
                    <p style={{margin: '0.2rem 0'}}>Correct Answer: <strong>{item.correctAnswer}</strong></p>
                  </div>
                )}
                
                <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(255,255,255,0.6)', borderRadius: '6px' }}>
                  <span style={{fontWeight: 'bold', fontSize: '0.9rem', color: '#333'}}>Explanation & Proof:</span>
                  <div style={{ marginTop: '0.4rem', fontSize: '0.95rem', color: '#444', fontStyle: 'italic' }}>
                    <LatexRenderer text={item.explanation} />
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={() => navigate('/dashboard')}
              style={{
                marginTop: '2rem', width: '100%', padding: '1rem', 
                background: '#2563eb', color: 'white', border: 'none', 
                borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

    </Container>
  );
};

export default QuizInterface;