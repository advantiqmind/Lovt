import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-[#0d0d0d] flex flex-col items-center justify-between px-6 py-16">
      <div />

      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-rose-600/10 border border-rose-600/20 flex items-center justify-center mx-auto mb-10">
          <span className="text-4xl" style={{ color: '#e11d48' }}>♡</span>
        </div>
        <h1 className="text-6xl font-light tracking-tight text-white">lovt</h1>
        <p className="text-[#555] text-sm font-light tracking-widest uppercase">
          just the two of you
        </p>
      </div>

      <div className="w-full space-y-3">
        <button
          onClick={() => navigate('/auth?mode=signup')}
          className="w-full py-4 rounded-2xl font-medium text-base text-white active:scale-95 transition-transform"
          style={{ backgroundColor: '#e11d48' }}
        >
          get started
        </button>
        <button
          onClick={() => navigate('/auth?mode=login')}
          className="w-full py-4 rounded-2xl bg-[#1a1a1a] text-[#888] font-medium text-base active:scale-95 transition-transform"
        >
          sign in
        </button>
      </div>
    </div>
  )
}
