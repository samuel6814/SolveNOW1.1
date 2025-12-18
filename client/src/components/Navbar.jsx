import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, LogIn } from 'lucide-react';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  // Transparent background for Hero integration, or white for Dashboard
  background-color: ${props => props.transparent ? 'transparent' : 'white'};
  box-shadow: ${props => props.transparent ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'};
  width: 100%;
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #2563eb;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.primary ? '#2563eb' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: ${props => props.primary ? 'none' : '1px solid #e0e0e0'};
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.primary ? '#1d4ed8' : '#f8f9fa'};
    transform: translateY(-1px);
  }
`;

const Navbar = ({ user, transparent }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <NavContainer transparent={transparent}>
      <Logo onClick={() => navigate('/')}>
        SolveNOW
      </Logo>
      
      <NavActions>
        {user ? (
          <>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500'}}>
              <User size={20} />
              {user.username}
            </div>
            <Button onClick={handleLogout}>
              <LogOut size={16} />
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => navigate('/login')}>
              Log In
            </Button>
            <Button primary onClick={() => navigate('/login')}>
              Get Started <LogIn size={16} />
            </Button>
          </>
        )}
      </NavActions>
    </NavContainer>
  );
};

export default Navbar;