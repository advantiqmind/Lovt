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

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', display: 'flex', flexDirection: 'column', padding: '0 24px' }}>

      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 90% 45% at 50% 0%, rgba(225,29,72,0.08) 0%, transparent 65%)',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 52, paddingBottom: 0, position: 'relative', zIndex: 10 }}>
        <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>LOVT</span>
        <button
          onClick={() => supabase.auth.signOut()}
          style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}
        >
          Sign out
        </button>
      </div>

      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0 }}>

        {/* Title */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            Connect<br/>with your<br/>partner
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>
            Share your code or enter theirs to link up.
          </p>
        </div>

        {/* Your code card */}
        <div style={{
          background: 'rgba(225,29,72,0.08)',
          border: '1px solid rgba(225,29,72,0.2)',
          borderRadius: 20, padding: '20px 22px', marginBottom: 20,
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 12 }}>Your code</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '0.3em', fontVariantNumeric: 'tabular-nums' }}>
              {profile?.pair_code ?? '······'}
            </span>
            <button
              onClick={copyCode}
              style={{
                padding: '10px 18px', borderRadius: 12,
                background: copied ? 'rgba(225,29,72,0.2)' : 'rgba(255,255,255,0.07)',
                border: `1px solid ${copied ? 'rgba(225,29,72,0.4)' : 'rgba(255,255,255,0.1)'}`,
                color: copied ? '#ff4d6d' : 'rgba(255,255,255,0.6)',
                fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              }}
              className="active:scale-95 transition-transform"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 10 }}>Send this to your partner</p>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 12, letterSpacing: '0.2em', fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Enter partner code */}
        <form onSubmit={handlePair} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Enter partner's code</p>
          <input
            type="text"
            placeholder="· · · · · ·"
            value={partnerCode}
            onChange={e => setPartnerCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            maxLength={6}
            required
            style={{
              width: '100%', padding: '18px 20px',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 16, color: '#fff',
              fontSize: 24, fontWeight: 900, letterSpacing: '0.4em',
              textAlign: 'center', textTransform: 'uppercase', outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
          />

          {error && (
            <p style={{ color: '#ef4444', fontSize: 13, paddingLeft: 4 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || partnerCode.length < 6}
            style={{
              width: '100%', padding: '17px',
              borderRadius: 16,
              background: partnerCode.length === 6
                ? 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)'
                : 'rgba(255,255,255,0.06)',
              boxShadow: partnerCode.length === 6 ? '0 4px 28px rgba(225,29,72,0.3)' : 'none',
              color: '#fff', fontWeight: 700, fontSize: 15,
              border: `1px solid ${partnerCode.length === 6 ? 'transparent' : 'rgba(255,255,255,0.06)'}`,
              cursor: partnerCode.length < 6 ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s',
            }}
            className="active:scale-95 transition-transform"
          >
            {loading ? 'Linking...' : 'Link Up'}
          </button>
        </form>
      </div>

      <div style={{ height: 32 }} />
    </div>
  )
}
