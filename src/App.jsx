import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import RepoDetail from './pages/RepoDetail';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<LandingPage />} />
            <Route path="/search/:query" element={<SearchPage />} />
            <Route path="/category/:categoryId" element={<Home />} />
            <Route path="/category" element={<Home />} />
            <Route path="/repo/:owner/:repoName" element={<RepoDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
