import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import BottomNav, { type Tab } from '../components/BottomNav'

export default function Home() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('pulse')

  return (
    <div className="min-h-dvh bg-[#0d0d0d] flex flex-col">
      <div className="flex items-center justify-between px-6 pt-14 pb-2">
        <div>
          <h1 className="text-lg font-light text-white tracking-widest">lovt</h1>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-[#333] text-xs"
        >
          sign out
        </button>
      </div>

      <div className="px-6 pb-4">
        <p className="text-[#444] text-xs">
          hey, <span className="text-[#888]">{profile?.display_name}</span>
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        {activeTab === 'pulse' && <PulseTab />}
        {activeTab === 'draw' && <ComingSoon title="draw" subtitle="shared canvas" />}
        {activeTab === 'games' && <ComingSoon title="games" subtitle="play together" />}
        {activeTab === 'us' && <ComingSoon title="us" subtitle="your shared space" />}
      </div>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}

function PulseTab() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')

  async function sendPulse() {
    if (state !== 'idle') return
    setState('sending')
    await new Promise(r => setTimeout(r, 600))
    setState('sent')
    setTimeout(() => setState('idle'), 2500)
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <button
        onClick={sendPulse}
        className="relative w-44 h-44 rounded-full flex items-center justify-center active:scale-95 transition-transform"
        style={{ background: 'radial-gradient(circle, rgba(225,29,72,0.12) 0%, rgba(225,29,72,0.04) 70%, transparent 100%)' }}
      >
        {state === 'sending' && (
          <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: 'rgba(225,29,72,0.12)' }} />
        )}
        <span
          className="text-6xl relative z-10 transition-all duration-300"
          style={{ color: state === 'sent' ? '#e11d48' : '#e11d48', opacity: state === 'idle' ? 0.6 : 1 }}
        >
          ♡
        </span>
      </button>

      <p className="text-[#555] text-sm tracking-wide">
        {state === 'idle' && 'tap to send a pulse'}
        {state === 'sending' && 'sending...'}
        {state === 'sent' && 'pulse sent ♡'}
      </p>
    </div>
  )
}

function ComingSoon({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center space-y-2">
      <p className="text-white text-3xl font-light">{title}</p>
      <p className="text-[#444] text-sm tracking-wide">{subtitle}</p>
      <p className="text-[#333] text-xs pt-2">coming soon</p>
    </div>
  )
}
