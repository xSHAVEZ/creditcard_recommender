import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Recommendations from './pages/Recommendations';
import Compare from './pages/Compare';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </motion.main>
    </div>
  );
}

export default App; 