import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './AppRouter';
import Header from './components/Header';
import Footer from './components/Footer';
import { setAuthToken } from './api';

const App = () => {
  // Function to check if a token is present in local storage and set it in axios headers
  const checkAuthToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  };

  useEffect(() => {
    checkAuthToken(); // Check for the token on initial mount
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <AppRouter />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
