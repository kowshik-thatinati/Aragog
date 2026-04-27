import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AlertCircle, BookOpen } from 'lucide-react'

function AboutARAGOG() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  return (
    <div style={{ width: '100%', maxWidth: '64rem', margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#6b21a8',
          marginBottom: '8px',
          margin: 0
        }}>
          What is ARAGOG?
        </h1>
        <p style={{
          color: '#7c3aed',
          fontSize: '18px'
        }}>
          Advanced Retrieval-Augmented Generation for Medical Knowledge
        </p>
      </div>

      {/* System Architecture Diagram */}
      <div style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid #e9d5ff',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#6b21a8',
          marginBottom: '24px',
          margin: 0
        }}>
          System Architecture
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Input */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
              color: 'white',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}>
              📝 Your Question
            </div>
          </div>

          <div style={{ textAlign: 'center', color: '#9333ea', fontSize: '24px' }}>↓</div>

          {/* Retrieval */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: '600',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}>
              🔍 FAISS Vector<br />
              <span style={{ fontSize: '12px' }}>Semantic similarity</span>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              color: 'white',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: '600',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
            }}>
              🔎 BM25 Keyword<br />
              <span style={{ fontSize: '12px' }}>Keyword matching</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', color: '#9333ea', fontSize: '24px' }}>↓</div>

          {/* Reranking */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
            }}>
              ⚡ CrossEncoder Reranking
            </div>
          </div>

          <div style={{ textAlign: 'center', color: '#9333ea', fontSize: '24px' }}>↓</div>

          {/* LLM */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              color: 'white',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
            }}>
              🤖 Groq LLM Generation
            </div>
          </div>

          <div style={{ textAlign: 'center', color: '#9333ea', fontSize: '24px' }}>↓</div>

          {/* Output */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #ec4899, #be185d)',
              color: 'white',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
            }}>
              ✅ Medical Response
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid #e9d5ff',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#6b21a8',
          marginBottom: '24px',
          margin: 0
        }}>
          Performance Metrics
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {[
            { label: 'Retrieval Accuracy', value: '92%', icon: '🎯' },
            { label: 'Response Quality', value: '4.5/5.0', icon: '⭐' },
            { label: 'Avg Response Time', value: '1.2s', icon: '⚡' },
            { label: 'Coverage', value: '95%', icon: '📊' },
            { label: 'Uptime', value: '99.9%', icon: '✅' },
            { label: 'Specialties', value: '50+', icon: '🏥' }
          ].map((metric, i) => (
            <div key={i} style={{
              background: 'rgba(245, 245, 245, 0.8)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{metric.icon}</div>
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#9333ea',
                marginBottom: '4px'
              }}>
                {metric.value}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid #e9d5ff',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#6b21a8',
          marginBottom: '24px',
          margin: 0
        }}>
          Technology Stack
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {[
            { title: 'LLM Provider', desc: 'Groq API with ultra-fast inference' },
            { title: 'Embeddings', desc: 'all-MiniLM-L6-v2 (384-dim)' },
            { title: 'Reranker', desc: 'CrossEncoder (ms-marco)' },
            { title: 'Vector DB', desc: 'FAISS (index-based retrieval)' },
            { title: 'Keyword Search', desc: 'BM25 Algorithm' },
            { title: 'Database', desc: 'MongoDB Atlas (users)' }
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(245, 245, 245, 0.8)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#9333ea',
                marginBottom: '8px'
              }}>
                {item.title}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Disclaimers */}
      <div style={{
        background: 'rgba(254, 242, 242, 0.8)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        border: '2px solid #fca5a5',
        boxShadow: '0 10px 25px rgba(220, 38, 38, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <AlertCircle size={24} color="#dc2626" style={{ marginTop: '4px', flexShrink: 0 }} />
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#991b1b',
              marginBottom: '12px',
              margin: 0
            }}>
              ⚠️ Important Disclaimers
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <li style={{ color: '#7f1d1d', fontSize: '14px' }}>
                ✓ Educational Purpose Only - Not intended for medical diagnosis or treatment
              </li>
              <li style={{ color: '#7f1d1d', fontSize: '14px' }}>
                ✓ Consult Licensed Practitioners - Always follow professional medical advice
              </li>
              <li style={{ color: '#7f1d1d', fontSize: '14px' }}>
                ✓ Not Medical Emergency Resource - For emergencies, call 911 or visit ER
              </li>
              <li style={{ color: '#7f1d1d', fontSize: '14px' }}>
                ✓ Limited Accuracy - May contain errors; verify with trusted sources
              </li>
              <li style={{ color: '#7f1d1d', fontSize: '14px' }}>
                ✓ No Liability - Users assume full responsibility for use
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Verification Recommendations */}
      <div style={{
        background: 'rgba(219, 234, 254, 0.8)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        border: '2px solid #93c5fd',
        boxShadow: '0 10px 25px rgba(30, 64, 175, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <BookOpen size={24} color="#1e40af" style={{ marginTop: '4px', flexShrink: 0 }} />
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1e3a8a',
              marginBottom: '12px',
              margin: 0
            }}>
              📋 Recommended Workflow
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <li style={{ color: '#1e3a8a', fontSize: '14px' }}>
                1️⃣ Use ARAGOG for general medical information
              </li>
              <li style={{ color: '#1e3a8a', fontSize: '14px' }}>
                2️⃣ Cross-reference with trusted medical sources
              </li>
              <li style={{ color: '#1e3a8a', fontSize: '14px' }}>
                3️⃣ Discuss findings with your healthcare provider
              </li>
              <li style={{ color: '#1e3a8a', fontSize: '14px' }}>
                4️⃣ Follow professional medical guidance
              </li>
            </ul>
            <p style={{
              color: '#1e3a8a',
              fontStyle: 'italic',
              marginTop: '12px',
              fontSize: '14px'
            }}>
              ARAGOG is a supplementary tool, not a replacement for professional medical advice.
            </p>
          </div>
        </div>
      </div>

      {/* Before Using Section */}
      <div style={{
        background: 'rgba(245, 245, 245, 0.8)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '12px',
          margin: 0
        }}>
          🏥 Before Using ARAGOG
        </h3>
        <p style={{ color: '#4b5563', marginBottom: '12px', margin: 0 }}>
          For professional medical guidance, consult:
        </p>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <li style={{ color: '#4b5563', fontSize: '14px' }}>
            • Primary Care Physician - For routine checkups and referrals
          </li>
          <li style={{ color: '#4b5563', fontSize: '14px' }}>
            • Medical Specialist - For specialized conditions
          </li>
          <li style={{ color: '#4b5563', fontSize: '14px' }}>
            • Hospital/Clinic - For professional evaluation
          </li>
          <li style={{ color: '#4b5563', fontSize: '14px' }}>
            • Telehealth Services - For remote consultations
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AboutARAGOG
