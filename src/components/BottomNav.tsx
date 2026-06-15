export type Tab = 'pulse' | 'draw' | 'games' | 'us'

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: 'pulse', icon: '♡', label: 'pulse' },
  { id: 'draw', icon: '✏', label: 'draw' },
  { id: 'games', icon: '◈', label: 'games' },
  { id: 'us', icon: '☽', label: 'us' },
]

export default function BottomNav({
  active,
  onChange,
}: {
  active: Tab
  onChange: (tab: Tab) => void
}) {
  return (
    <div className="flex items-center justify-around px-2 pt-3 pb-8 border-t border-[#1a1a1a]">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="flex flex-col items-center gap-1 px-5 py-2 active:scale-95 transition-transform"
        >
          <span
            className="text-2xl leading-none transition-opacity"
            style={{ opacity: active === tab.id ? 1 : 0.25, color: active === tab.id ? '#e11d48' : '#f5f5f5' }}
          >
            {tab.icon}
          </span>
          <span
            className="text-[10px] tracking-wide transition-colors"
            style={{ color: active === tab.id ? '#e11d48' : '#555' }}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}
