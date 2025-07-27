import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../components/UI';
import styled from 'styled-components';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    try {
      await onLogin(username.trim());
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <h2>Welcome to Crypto Crash</h2>
        <p>Enter a username to start playing</p>
        
        <LoginForm onSubmit={handleSubmit}>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Start Playing</Button>
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  text-align: center;
  
  h2 {
    margin-bottom: 0.5rem;
  }
  
  p {
    margin-bottom: 1.5rem;
    color: #7f8c8d;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
`;

export default LoginPage;