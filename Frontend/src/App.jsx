import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import './styles/theme.css';
import Dashboard from './Components/Dashboard/Dashboard';
import Advisory from './Components/Advisory/Advisory';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard/> }/>
            <Route path="/advisory" element={<Advisory/>} />
            <Route path="/contact" element={<div className="page-container"><h1>Contact - Coming Soon</h1></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;