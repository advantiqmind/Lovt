import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function Pair() {
  const { profile, refetchProfile, user } = useAuth()
  const [partnerCode, setPartnerCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  function copyCode() {
    navigator.clipboard.writeText(profile?.pair_code ?? '').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handlePair(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: rpcError } = await supabase.rpc('pair_with_code', {
      partner_code: partnerCode.trim().toUpperCase(),
    })

    if (rpcError || data?.error) {
      setError(data?.error ?? rpcError?.message ?? 'Something went wrong.')
    } else {
      refetchProfile(user?.id)
    }

    setLoading(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-dvh bg-[#0d0d0d] flex flex-col px-6 py-16">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-xl font-light text-white tracking-wide">lovt</h1>
        <button onClick={handleSignOut} className="text-[#444] text-xs">sign out</button>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-10">
        <div>
          <h2 className="text-3xl font-light text-white">connect</h2>
          <p className="text-[#555] mt-2 text-sm">share your code or enter theirs</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-3xl p-6 space-y-3">
          <p className="text-[#555] text-xs uppercase tracking-widest">your code</p>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-light tracking-[0.3em] text-white">
              {profile?.pair_code ?? '······'}
            </span>
            <button
              onClick={copyCode}
              className="px-4 py-2 rounded-xl bg-[#2a2a2a] text-sm text-[#888] active:scale-95 transition-transform"
            >
              {copied ? 'copied ✓' : 'copy'}
            </button>
          </div>
          <p className="text-[#444] text-xs">send this to your partner</p>
        </div>

        <form onSubmit={handlePair} className="space-y-4">
          <p className="text-[#555] text-xs uppercase tracking-widest">partner's code</p>
          <input
            type="text"
            placeholder="· · · · · ·"
            value={partnerCode}
            onChange={e => setPartnerCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            maxLength={6}
            required
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-4 text-white placeholder-[#333] outline-none text-xl tracking-[0.4em] text-center focus:border-rose-600/40 transition-colors uppercase"
          />

          {error && <p className="text-rose-400 text-sm px-1">{error}</p>}

          <button
            type="submit"
            disabled={loading || partnerCode.length < 6}
            className="w-full py-4 rounded-2xl font-medium text-base text-white active:scale-95 transition-transform disabled:opacity-30"
            style={{ backgroundColor: '#e11d48' }}
          >
            {loading ? '...' : 'pair up ♡'}
          </button>
        </form>
      </div>
    </div>
  )
}
