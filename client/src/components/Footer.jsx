import React from 'react';
import styled from 'styled-components';
import { Github, Twitter, Mail } from 'lucide-react';

const FooterContainer = styled.footer`
  background-color: #1a1a1a;
  color: white;
  padding: 3rem 2rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const BrandColumn = styled.div`
  h3 { font-size: 1.5rem; margin-bottom: 1rem; color: #3b82f6; }
  p { color: #9ca3af; line-height: 1.6; }
`;

const LinkColumn = styled.div`
  h4 { font-size: 1.1rem; margin-bottom: 1rem; color: #fff; }
  ul { list-style: none; padding: 0; }
  li { margin-bottom: 0.8rem; }
  a { color: #9ca3af; text-decoration: none; transition: color 0.2s; }
  a:hover { color: #3b82f6; }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  svg { cursor: pointer; color: #9ca3af; transition: color 0.2s; }
  svg:hover { color: #fff; }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid #333;
  color: #666;
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <BrandColumn>
          <h3>SolveNOW</h3>
          <p>
            Bridging the gap between static PDFs and active recall. 
            Master university mathematics with AI-generated quizzes and step-by-step solutions.
          </p>
          <SocialIcons>
            <Github size={20} />
            <Twitter size={20} />
            <Mail size={20} />
          </SocialIcons>
        </BrandColumn>

        <LinkColumn>
          <h4>Platform</h4>
          <ul>
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">For Universities</a></li>
          </ul>
        </LinkColumn>

        <LinkColumn>
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </LinkColumn>
      </FooterContent>
      <Copyright>
        © {new Date().getFullYear()} SolveNOW. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;