import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import NewsTicker from './components/NewsTicker';
import NoticeTicker from './components/NoticeTicker';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Register from './pages/Register';
import Schemes from './pages/Schemes';
import ANCCenters from './pages/ANCCenters';
import ANCDashboard from './pages/anc/ANCDashboard';
import ProtectedLayout from './components/ProtectedLayout';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();

  const handleLogin = (credentials: { username: string; password: string }) => {
    const userObj = { username: credentials.username };
    setUser(userObj);
    localStorage.setItem('user', JSON.stringify(userObj));
    setIsLoginModalOpen(false);
    navigate('/anc');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <Routes>
        {/* Main layout routes */}
        <Route
          path="/"
          element={
            <MainLayout onLoginClick={() => setIsLoginModalOpen(true)}>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout onLoginClick={() => setIsLoginModalOpen(true)}>
              <About />
            </MainLayout>
          }
        />
        <Route
          path="/register"
          element={
            <MainLayout onLoginClick={() => setIsLoginModalOpen(true)}>
              <Register />
            </MainLayout>
          }
        />
        <Route
          path="/schemes"
          element={
            <MainLayout onLoginClick={() => setIsLoginModalOpen(true)}>
              <Schemes />
            </MainLayout>
          }
        />
        <Route
          path="/anc-centers"
          element={
            <MainLayout onLoginClick={() => setIsLoginModalOpen(true)}>
              <ANCCenters />
            </MainLayout>
          }
        />
        
        {/* Dashboard route without main layout */}
        <Route path="/anc" element={<ANCDashboard />} />
      </Routes>
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
}

const MainLayout = ({ 
  onLoginClick, 
  children 
}: { 
  onLoginClick: () => void;
  children: React.ReactNode;
}) => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <Navbar onLoginClick={onLoginClick} />
    <NewsTicker />
    <NoticeTicker />
    {children}
    <Footer />
  </div>
);

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}