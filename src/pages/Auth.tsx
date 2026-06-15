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
      <div className="min-h-dvh bg-[#0d0d0d] flex flex-col items-center justify-center px-6 text-center space-y-4">
        <span className="text-5xl">✉</span>
        <h2 className="text-2xl font-light text-white">check your email</h2>
        <p className="text-[#888] text-sm leading-relaxed">
          we sent a confirmation link to<br />
          <span className="text-white">{email}</span>
        </p>
        <p className="text-[#555] text-xs pt-4">
          tip: disable email confirmation in Supabase Auth settings to skip this step
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#0d0d0d] flex flex-col px-6 py-16">
      <button
        onClick={() => navigate('/')}
        className="text-[#555] text-sm mb-12 text-left"
      >
        ← back
      </button>

      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div>
          <h2 className="text-3xl font-light text-white">
            {isSignup ? 'create account' : 'welcome back'}
          </h2>
          <p className="text-[#555] mt-2 text-sm">
            {isSignup ? 'start your shared space' : 'your space is waiting'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignup && (
            <input
              type="text"
              placeholder="your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-4 text-white placeholder-[#444] outline-none text-base focus:border-rose-600/40 transition-colors"
            />
          )}
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-4 text-white placeholder-[#444] outline-none text-base focus:border-rose-600/40 transition-colors"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-4 text-white placeholder-[#444] outline-none text-base focus:border-rose-600/40 transition-colors"
          />

          {error && <p className="text-rose-400 text-sm px-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-medium text-base text-white active:scale-95 transition-transform disabled:opacity-40 mt-2"
            style={{ backgroundColor: '#e11d48' }}
          >
            {loading ? '...' : isSignup ? 'create account' : 'sign in'}
          </button>
        </form>

        <button
          onClick={() => navigate(`/auth?mode=${isSignup ? 'login' : 'signup'}`)}
          className="text-center text-[#555] text-sm"
        >
          {isSignup ? 'already have an account? sign in' : "don't have an account? sign up"}
        </button>
      </div>
    </div>
  )
}
