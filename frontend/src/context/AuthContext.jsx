import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()
const API_URL = 'http://127.0.0.1:8000'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Clear any previous session on app load
    localStorage.removeItem('user')
    setIsLoading(false)
  }, [])

  const signup = async (email, username, password) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Signup failed')
      }
      
      return { success: true, message: data.message }
    } catch (error) {
      console.error('Signup error:', error)
      throw new Error(error.message || 'Failed to connect to backend. Please check if the server is running.')
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Login failed')
      }
      
      // Store logged-in user in localStorage
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      
      return { success: true, message: data.message }
    } catch (error) {
      console.error('Login error:', error)
      throw new Error(error.message || 'Failed to connect to backend. Please check if the server is running.')
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
