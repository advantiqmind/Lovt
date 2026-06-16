import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [params] = useSearchParams()
  const isSignup = params.get('mode') !== 'login'
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name } },
      })
      if (error) setError(error.message)
      else setCheckEmail(true)
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  if (checkEmail) {
    return (
      <div className="min-h-dvh bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center space-y-5">
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(225,29,72,0.12)',
          border: '1px solid rgba(225,29,72,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>✉</div>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>Check your email</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>
            We sent a link to<br />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{email}</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, marginTop: 16 }}
        >
          ← Back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#0a0a0a] flex flex-col px-6 py-16 overflow-hidden">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(225,29,72,0.07) 0%, transparent 70%)',
      }} />

      <button
        onClick={() => navigate('/')}
        style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, textAlign: 'left', position: 'relative', zIndex: 10 }}
      >
        ← Back
      </button>

      <div className="flex-1 flex flex-col justify-center space-y-8 relative z-10">
        <div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            {isSignup ? 'Create account' : 'Welcome back'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14, marginTop: 8 }}>
            {isSignup ? 'Start your shared space' : 'Your space is waiting'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignup && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={inputStyle}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
          />

          {error && (
            <p style={{ color: '#ff4d6d', fontSize: 13, paddingLeft: 4 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full active:scale-95 transition-transform"
            style={{
              padding: '16px',
              borderRadius: 16,
              background: loading ? 'rgba(225,29,72,0.4)' : 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              boxShadow: loading ? 'none' : '0 4px 24px rgba(225,29,72,0.35)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              marginTop: 4,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '...' : isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => navigate(`/auth?mode=${isSignup ? 'login' : 'signup'}`)}
          style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, textAlign: 'center' }}
        >
          {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  padding: '16px',
  color: '#fff',
  fontSize: 16,
  outline: 'none',
}
