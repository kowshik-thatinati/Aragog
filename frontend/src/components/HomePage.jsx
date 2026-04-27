import { Activity } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer1)
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '16px' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '24px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 1s ease'
          }}>
            <div style={{
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px 32px',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              background: 'rgba(255,255,255,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#9333ea',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(147,51,234,0.3)',
                  animation: 'pulse 2s infinite'
                }}>
                  <Activity style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
                <h1 style={{
                  fontSize: '48px',
                  fontWeight: '900',
                  color: '#1f2937',
                  letterSpacing: '0.05em',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  textShadow: '1px 1px 3px rgba(255,255,255,0.8)',
                  margin: 0
                }}>
                  <span style={{
                    display: 'inline-block',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease 0.1s'
                  }}>A</span>
                  <span style={{
                    display: 'inline-block',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease 0.2s'
                  }}>R</span>
                  <span style={{
                    display: 'inline-block',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease 0.3s'
                  }}>A</span>
                  <span style={{
                    display: 'inline-block',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease 0.4s'
                  }}>G</span>
                  <span style={{
                    display: 'inline-block',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease 0.5s'
                  }}>O</span>
                  <span style={{
                    display: 'inline-block',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.3s ease 0.6s'
                  }}>G</span>
                </h1>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#9333ea',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(147,51,234,0.3)',
                  animation: 'pulse 2s infinite'
                }}>
                  <Activity style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
              </div>
            </div>
          </div>
          <p style={{
            fontSize: '18px',
            color: '#4b5563',
            fontWeight: '500',
            marginBottom: '8px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 1s ease 0.7s'
          }}>
            Advanced Retrieved Augmented Generation Output Grading
          </p>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(8px)',
          borderRadius: '16px',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 10px 40px rgba(0,0,0,0.15)',
          border: '2px solid #000',
          padding: '32px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: 'all 1.5s ease 1s'
        }}>
          <div style={{ textAlign: 'left', lineHeight: '1.6' }}>
            <p style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#1a1a1a',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-16px)',
              transition: 'all 1s ease 1.2s',
              textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
            }}>
              <span style={{ fontWeight: 'bold', color: '#6b21a8' }}>ARAGOG</span> is a domain-aware medical question-answering system designed to deliver reliable, context-grounded responses by combining curated medical knowledge with generative AI.
            </p>
            
            <p style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#1a1a1a',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-16px)',
              transition: 'all 1s ease 1.4s',
              textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
              marginTop: '12px'
            }}>
              It operates across multiple specialized fields such as <span style={{ fontWeight: '600', color: '#7c3aed' }}>cardiology</span>, <span style={{ fontWeight: '600', color: '#7c3aed' }}>neurology</span>, and <span style={{ fontWeight: '600', color: '#7c3aed' }}>dermatology</span>, ensuring that user queries are interpreted within the correct clinical context.
            </p>
            
            <p style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#1a1a1a',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-16px)',
              transition: 'all 1s ease 1.6s',
              textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
              marginTop: '12px'
            }}>
              The system emphasizes <span style={{ fontWeight: 'bold', color: '#6b21a8' }}>accuracy</span>, <span style={{ fontWeight: 'bold', color: '#6b21a8' }}>relevance</span>, and <span style={{ fontWeight: 'bold', color: '#6b21a8' }}>interpretability</span> by anchoring every response to verified domain-specific data.
            </p>
          </div>
          
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              {[
                { label: '✓ Clinical Context', delay: 1.9 },
                { label: '✓ Verified Data', delay: 2.0 },
                { label: '✓ Multi-Specialty', delay: 2.1 },
                { label: '✓ AI-Powered', delay: 2.2 }
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#faf5ff',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'scale(1)' : 'scale(0.75)',
                  transition: `all 0.8s ease ${item.delay}s`
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b21a8' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Auth Buttons */}
          {!user && (
            <div style={{
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    background: '#9333ea',
                    color: 'white',
                    fontWeight: '600',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(147,51,234,0.3)',
                    transition: 'all 0.2s ease',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                    transitionDelay: '2.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#7e22ce'
                    e.target.style.boxShadow = '0 6px 20px rgba(147,51,234,0.4)'
                    e.target.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#9333ea'
                    e.target.style.boxShadow = '0 4px 15px rgba(147,51,234,0.3)'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  style={{
                    background: 'white',
                    color: '#9333ea',
                    fontWeight: '600',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    border: '2px solid #9333ea',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(147,51,234,0.2)',
                    transition: 'all 0.2s ease',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                    transitionDelay: '2.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f3f4f6'
                    e.target.style.boxShadow = '0 6px 20px rgba(147,51,234,0.3)'
                    e.target.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'white'
                    e.target.style.boxShadow = '0 4px 15px rgba(147,51,234,0.2)'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
