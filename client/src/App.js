import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GameProvider, WalletProvider } from './contexts';
import { GamePage, WalletPage, LoginPage } from './pages';
import { Navbar } from './components/UI';
import { registerUser } from './services/apiService';
import styled from 'styled-components';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = async (username) => {
    try {
      // Register user on server
      const response = await registerUser(username);
      
      const newUser = { 
        username: response.data.username, 
        userId: response.data.userId 
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <AppContainer>
        {user && <Navbar username={user.username} onLogout={handleLogout} />}
        <MainContent>
          <Routes>
            <Route 
              path="/" 
              element={
                user ? (
                  <WalletProvider>
                    <GameProvider>
                      <GamePage userId={user.userId} />
                    </GameProvider>
                  </WalletProvider>
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            <Route 
              path="/wallet" 
              element={
                user ? (
                  <WalletProvider>
                    <WalletPage userId={user.userId} />
                  </WalletProvider>
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            <Route 
              path="/login" 
              element={
                user ? (
                  <Navigate to="/" />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              } 
            />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
`;

export default App;