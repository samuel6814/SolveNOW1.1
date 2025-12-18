import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const AuthCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  font-size: 1.8rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const Button = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: #1d4ed8;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const ToggleText = styled.p`
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
  
  span {
    color: #2563eb;
    font-weight: 600;
    cursor: pointer;
    margin-left: 5px;
    &:hover { text-decoration: underline; }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #ef4444;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  text-align: left;
`;

// --- Logic ---

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- DEBUG LOGS START ---
    console.log("🖱️ Button Clicked!");
    console.log("📝 Form Data:", formData);
    // --- DEBUG LOGS END ---

    setLoading(true);
    setError('');

    // Determine Endpoint based on mode
    const endpoint = isLogin 
      ? 'http://localhost:5000/api/auth/login' 
      : 'http://localhost:5000/api/auth/register';

    try {
      console.log("🚀 Sending Request to:", endpoint); // Log the destination
      
      const response = await axios.post(endpoint, formData);
      
      console.log("✅ Response Received:", response.data); // Log the success

      // Success!
      const { token, user } = response.data;
      
      // Store Token & User Info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to Dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error("❌ Request Failed:", err); // Log the error object
      
      // Handle Error
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <AuthCard>
        <Title>{isLogin ? 'Welcome Back' : 'Join SolveNOW'}</Title>
        <Subtitle>
          {isLogin 
            ? 'Enter your credentials to access your quizzes.' 
            : 'Start mastering university math today.'}
        </Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          
          {/* Username Field - Only show for Register */}
          {!isLogin && (
            <InputGroup>
              <IconWrapper><User size={18} /></IconWrapper>
              <Input 
                type="text" 
                name="username" 
                placeholder="Full Name" 
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
              />
            </InputGroup>
          )}

          <InputGroup>
            <IconWrapper><Mail size={18} /></IconWrapper>
            <Input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </InputGroup>

          <InputGroup>
            <IconWrapper><Lock size={18} /></IconWrapper>
            <Input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </InputGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={18} />}
          </Button>

        </Form>

        <ToggleText>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </ToggleText>

      </AuthCard>
    </Container>
  );
};

export default Login;