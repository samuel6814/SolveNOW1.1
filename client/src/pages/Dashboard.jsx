import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, Play, BarChart2, FileText, Clock, X, CheckCircle, Loader } from 'lucide-react';
import Navbar from '../components/Navbar';

// --- Styled Components (Existing + New Modal Styles) ---

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconBox = styled.div`
  background-color: ${props => props.color || '#e0f2fe'};
  color: ${props => props.iconColor || '#0284c7'};
  padding: 12px;
  border-radius: 10px;
`;

const StatInfo = styled.div`
  h4 {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
  }
  p {
    margin: 5px 0 0 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a1a;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ActionCard = styled.div`
  background: white;
  border: 2px dashed #e0e0e0;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #2563eb;
    background-color: #f0f7ff;
    transform: translateY(-2px);
  }

  h3 { margin-top: 1rem; color: #1a1a1a; }
  p { color: #666; font-size: 0.9rem; margin-top: 0.5rem; }
`;

// --- New Upload Modal Styles ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  &:hover { color: #333; }
`;

const PreviewBox = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: left;
  font-family: monospace;
  font-size: 0.85rem;
  color: #444;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
`;

const PrimaryButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 1.5rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  &:hover { background-color: #1d4ed8; }
`;

// --- Logic ---

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Reference to hidden input

  // State Management
  const [user, setUser] = useState({ username: 'Student' });
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success, error
  const [uploadData, setUploadData] = useState(null); // Stores filename/preview from server
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else if (storedUser) setUser(JSON.parse(storedUser));
  }, [navigate]);

  // Trigger hidden file input
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle File Selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate type (Client side check)
    if (file.type !== 'application/pdf') {
      alert("Please upload a valid PDF file.");
      return;
    }

    // Reset state & Start Upload
    setUploadState('uploading');
    setErrorMessage('');
    
    const formData = new FormData();
    formData.append('pdf', file); // 'pdf' must match upload.single('pdf') in backend

    try {
      const token = localStorage.getItem('token');
      // Send to Backend
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Good practice for future protected routes
        }
      });

      // Success
      setUploadData(response.data);
      setUploadState('success');

    } catch (err) {
      console.error(err);
      setUploadState('error');
      setErrorMessage(err.response?.data?.error || 'Failed to upload file.');
    }
  };

  const closeModal = () => {
    setUploadState('idle');
    setUploadData(null);
    // Reset file input so user can select same file again if needed
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const startQuizGeneration = async () => {
    if (!uploadData) return;

    setUploadState('uploading'); // Re-use loading state for generation
    // Optional: Add a specific "generating" text state here if desired

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Call the Quiz Generation Endpoint
      const response = await axios.post('http://localhost:5000/api/quiz/generate', {
        userId: user.id || user.user_id, // Handle potential ID naming diffs
        // In a real app, send the file ID. Here we use the preview text for the MVP demo.
        textContent: uploadData.preview + " (Full text would go here in prod)", 
        title: uploadData.originalName.replace('.pdf', '')
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Redirect to the new Quiz Interface
      const { quizId } = response.data;
      navigate(`/quiz/${quizId}`);

    } catch (err) {
      console.error("Generation failed", err);
      setErrorMessage("Failed to generate quiz. Please try again.");
      setUploadState('error');
    }
  };

  return (
    <PageContainer>
      <Navbar user={user} />
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{display: 'none'}} 
        accept="application/pdf"
        onChange={handleFileChange}
      />

      <ContentWrapper>
        <Header>
          <Title>Welcome back, {user.username}</Title>
          <Subtitle>Ready to solve some problems today?</Subtitle>
        </Header>

        {/* Stats Grid */}
        <StatsGrid>
          <StatCard>
            <IconBox><BarChart2 size={24}/></IconBox>
            <StatInfo><h4>Average Score</h4><p>85%</p></StatInfo>
          </StatCard>
          <StatCard>
            <IconBox color="#f0fdf4" iconColor="#16a34a"><FileText size={24}/></IconBox>
            <StatInfo><h4>Quizzes Taken</h4><p>12</p></StatInfo>
          </StatCard>
          <StatCard>
            <IconBox color="#fff7ed" iconColor="#ea580c"><Clock size={24}/></IconBox>
            <StatInfo><h4>Study Time</h4><p>4h 20m</p></StatInfo>
          </StatCard>
        </StatsGrid>

        <SectionTitle>Quick Actions</SectionTitle>
        <ActionGrid>
          <ActionCard onClick={handleUploadClick}>
            <UploadCloud size={48} color="#2563eb" />
            <h3>Upload New Material</h3>
            <p>Drag & drop textbooks or lecture notes (PDF) to generate a new quiz.</p>
          </ActionCard>

          <ActionCard onClick={() => navigate('/quiz/latest')}>
            <Play size={48} color="#16a34a" />
            <h3>Resume Session</h3>
            <p>Continue your Linear Algebra Exam Simulation.</p>
          </ActionCard>
        </ActionGrid>
      </ContentWrapper>

      {/* --- Upload Status Modal --- */}
      {uploadState !== 'idle' && (
        <ModalOverlay>
          <ModalCard>
            <CloseButton onClick={closeModal}><X size={20}/></CloseButton>

            {uploadState === 'uploading' && (
              <>
                <Loader size={48} className="animate-spin" color="#2563eb" style={{animation: 'spin 1s linear infinite'}} />
                <h3>Processing Document...</h3>
                <p>Analyzing PDF structure and extracting text.</p>
              </>
            )}

            {uploadState === 'success' && uploadData && (
              <>
                <CheckCircle size={48} color="#16a34a" style={{margin: '0 auto'}} />
                <h3 style={{color: '#16a34a'}}>Analysis Complete!</h3>
                <p>Successfully parsed <strong>{uploadData.originalName}</strong></p>
                <p style={{fontSize: '0.9rem', color: '#666'}}>
                  Found {uploadData.pageCount} pages ({uploadData.textLength} characters).
                </p>
                
                {/* Text Preview to prove it worked */}
                <PreviewBox>
                  <strong>Extracted Text Preview:</strong><br/>
                  {uploadData.preview}
                </PreviewBox>

                <PrimaryButton onClick={startQuizGeneration}>
                  Generate Quiz <Play size={16} />
                </PrimaryButton>
              </>
            )}

            {uploadState === 'error' && (
              <>
                <div style={{color: '#ef4444', marginBottom: '1rem'}}>
                  <X size={48} />
                </div>
                <h3>Upload Failed</h3>
                <p>{errorMessage}</p>
                <PrimaryButton onClick={closeModal} style={{backgroundColor: '#ef4444'}}>
                  Try Again
                </PrimaryButton>
              </>
            )}

          </ModalCard>
        </ModalOverlay>
      )}

      {/* Simple spin animation style injection */}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </PageContainer>
  );
};

export default Dashboard;