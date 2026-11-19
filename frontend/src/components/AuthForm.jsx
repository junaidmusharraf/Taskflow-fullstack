import { useState } from 'react'

const API_BASE = 'http://127.0.0.1:8000/api'

function AuthForm({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const endpoint = isRegister ? `${API_BASE}/register/` : `${API_BASE}/login/`
    const payload = isRegister ? { username, email, password } : { username, password }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        const msg =
          data.error ||
          (data.username && `Username: ${data.username[0]}`) ||
          (data.password && `Password: ${data.password[0]}`) ||
          'Authentication failed.'
        setError(msg)
      } else {
        onAuthSuccess(data.token, data.username)
      }
    } catch {
      setError('Cannot reach Django server. Make sure runserver is active.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-card">
      <h2>{isRegister ? 'Create Account' : 'Sign In to TaskFlow'}</h2>
      <p className="auth-subtitle">
        {isRegister
          ? 'Register to create your private PostgreSQL workspace.'
          : 'Log in to access your private projects and tasks.'}
      </p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />

        {isRegister && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
          />
        )}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 6 characters)"
          required
        />

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Please wait...' : isRegister ? 'Register & Enter' : 'Sign In'}
        </button>
      </form>

      <button
        type="button"
        className="auth-switch"
        onClick={() => {
          setIsRegister(!isRegister)
          setError('')
        }}
      >
        {isRegister
          ? 'Already have an account? Sign in'
          : "Don't have an account? Create one"}
      </button>
    </div>
  )
}

export default AuthForm