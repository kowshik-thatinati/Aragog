import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import HomePage from './components/HomePage'
import ChatPage from './components/ChatPage'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import AboutARAGOG from './components/AboutARAGOG'

function BackgroundWrapper({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
  const isHomePage = location.pathname === '/'
  
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#F4F1FF', position: 'relative', overflow: 'hidden' }}>
      {/* Background Image - Fixed */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 0, 
        pointerEvents: 'none'
      }}>
        <img 
          src={isHomePage || isAuthPage ? "/home_pag_bg.jpg" : "/bg.png"} 
          alt="Background" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            opacity: 0.8,
            filter: (isHomePage || isAuthPage) ? 'brightness(1.1) saturate(1.0)' : 'hue-rotate(260deg) saturate(0.8)'
          }}
        />
        
        {/* Lavender overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom right, #F4F1FF, transparent, #e9d5ff)',
          opacity: 0.3
        }}></div>
      </div>
      
      {/* Medical Background Pattern */}
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.05,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(147, 51, 234, 0.1) 35px, rgba(147, 51, 234, 0.1) 70px),
                         repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(147, 51, 234, 0.1) 35px, rgba(147, 51, 234, 0.1) 70px)`
      }}></div>
      
      {/* Content Container - Flex Layout */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'flex' }}>
        {/* Sidebar - Fixed */}
        {!isAuthPage && (
          <div style={{ height: '100%', overflowY: 'hidden' }}>
            <Sidebar />
          </div>
        )}
        
        {/* Main Content - Scrollable */}
        <div style={{
          flex: isAuthPage ? 'none' : 1,
          width: isAuthPage ? '100%' : 'auto',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          <div style={{ padding: '24px 16px', minHeight: '100%' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <BackgroundWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/about" element={<AboutARAGOG />} />
          </Routes>
        </BackgroundWrapper>
      </AuthProvider>
    </Router>
  )
}

export default App
