import { useNavigate, useLocation } from 'react-router-dom'
import { Home, MessageSquare, Activity, LogOut, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div style={{
      width: '256px',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Logo Section */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={32} color="#9333ea" />
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0,
              fontFamily: 'Inter, system-ui, sans-serif'
            }}>
              ARAGOG
            </h2>
            <p style={{ fontSize: '12px', color: '#4b5563', margin: 0 }}>
              Medical AI System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>
            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: isActive('/') ? '#f3e8ff' : 'transparent',
                color: isActive('/') ? '#9333ea' : '#4b5563',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => !isActive('/') && (e.target.style.background = '#f3f4f6')}
              onMouseLeave={(e) => !isActive('/') && (e.target.style.background = 'transparent')}
            >
              <Home size={20} />
              <span>Home</span>
            </button>
          </li>
          {user && (
            <li>
              <button
                onClick={() => navigate('/chat')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive('/chat') ? '#f3e8ff' : 'transparent',
                  color: isActive('/chat') ? '#9333ea' : '#4b5563',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => !isActive('/chat') && (e.target.style.background = '#f3f4f6')}
                onMouseLeave={(e) => !isActive('/chat') && (e.target.style.background = 'transparent')}
              >
                <MessageSquare size={20} />
                <span>Chat</span>
              </button>
            </li>
          )}
          {user && (
            <li>
              <button
                onClick={() => navigate('/about')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive('/about') ? '#f3e8ff' : 'transparent',
                  color: isActive('/about') ? '#9333ea' : '#4b5563',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => !isActive('/about') && (e.target.style.background = '#f3f4f6')}
                onMouseLeave={(e) => !isActive('/about') && (e.target.style.background = 'transparent')}
              >
                <Info size={20} />
                <span>What is ARAGOG?</span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #e5e7eb'
      }}>
        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '14px' }}>
              <p style={{ color: '#4b5563', margin: 0 }}>Logged in as</p>
              <p style={{ fontWeight: '600', color: '#111827', margin: '4px 0 0 0' }}>{user.username}</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: '#fee2e2',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#dc2626',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => (e.target.style.background = '#fecaca')}
              onMouseLeave={(e) => (e.target.style.background = '#fee2e2')}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        ) : (
          <div className="text-xs text-gray-500 text-center">
            <p>© 2024 ARAGOG</p>
            <p>Advanced Medical AI</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
