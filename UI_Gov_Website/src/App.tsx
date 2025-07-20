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
        <Route
          path="/*"
          element={
            <MainLayout onLoginClick={() => setIsLoginModalOpen(true)} />
          }
        />
        <Route element={<ProtectedLayout user={user} />}>
          <Route path="/anc" element={<ANCDashboard />} />
        </Route>
      </Routes>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
}

const MainLayout = ({ onLoginClick }: { onLoginClick: () => void }) => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <Navbar onLoginClick={onLoginClick} />
    <NewsTicker />
    <NoticeTicker />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/schemes" element={<Schemes />} />
      <Route path="/anc-centers" element={<ANCCenters />} />
    </Routes>
    <Footer/> 
  </div>
);

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}