import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Views/Home/home';
import Dashboard from './Views/Dashboard/dashboard';
import React from 'react';
import AccountPage from './Views/AccountPage/accountPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} index />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
