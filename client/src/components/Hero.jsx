import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion'; // Animation library
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Imported inside Hero as requested

// --- Styled Components ---

const HeroSection = styled.section`
  min-height: 90vh;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
`;

const Badge = styled(motion.div)`
  background-color: #dbeafe;
  color: #1e40af;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: inline-block;
`;

const Headline = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  
  span {
    color: #2563eb; /* Brand Blue */
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subheadline = styled(motion.p)`
  font-size: 1.2rem;
  color: #4b5563;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 600px;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
`;

const PrimaryButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  transition: all 0.2s;

  &:hover {
    background-color: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
  }
`;

const SecondaryButton = styled.button`
  background-color: white;
  color: #374151;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  border: 1px solid #d1d5db;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
`;

// --- Animated Background Elements (Abstract Math Geometry) ---
const Circle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(37,99,235,0.1) 0%, rgba(147,197,253,0.1) 100%);
  z-index: 1;
`;

const Hero = () => {
  const navigate = useNavigate();

  return (
    <HeroSection>
      {/* Navbar nested inside Hero container */}
      <Navbar transparent={true} />

      {/* Floating Geometry Background */}
      <Circle 
        style={{ width: 400, height: 400, top: -50, right: -100 }}
        animate={{ y: [0, 20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <Circle 
        style={{ width: 300, height: 300, bottom: -50, left: -50, background: 'rgba(236, 72, 153, 0.05)' }}
        animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <ContentWrapper>
        <Badge
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          v1.2 Public Beta
        </Badge>

        <Headline
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Master University Math <br />
          with <span>AI-Powered</span> Recall
        </Headline>

        <Subheadline
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Stop passively reading textbooks. Drag and drop your lecture notes 
          to instantly generate exam-level quizzes with step-by-step proofs.
        </Subheadline>

        <ButtonGroup
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <PrimaryButton onClick={() => navigate('/login')}>
            Start Solving Now
          </PrimaryButton>
          <SecondaryButton>
            View Demo
          </SecondaryButton>
        </ButtonGroup>
      </ContentWrapper>
    </HeroSection>
  );
};

export default Hero;