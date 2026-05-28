import { useRef, useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './StatusBar.css'

const STATUS_CONFIG = {
  academic: { color: '#3878DC', glow: 'rgba(56,120,220,0.6)',  icon: '◈' },
  money:    { color: '#EF9F27', glow: 'rgba(239,159,39,0.6)',  icon: '◆' },
  social:   { color: '#7F77DD', glow: 'rgba(127,119,221,0.6)', icon: '◉' },
  health:   { color: '#1D9E75', glow: 'rgba(29,158,117,0.6)',  icon: '♥' },
}

export default function StatusBar({ field, value, previewDelta }) {
  const { t } = useLanguage()
  const prevValue = useRef(value)
  const [flashClass, setFlashClass] = useState('')
  const [valueClass, setValueClass] = useState('')

  const cfg = STATUS_CONFIG[field]
  const isDanger = value <= 20 || value >= 80
  const previewValue = previewDelta != null
    ? Math.max(0, Math.min(100, value + previewDelta))
    : null

  useEffect(() => {
    if (prevValue.current === value) return
    const dir = value > prevValue.current ? 'up' : 'down'
    setFlashClass(`bar-flash-${dir}`)
    setValueClass(`value-${dir}`)
    const t1 = setTimeout(() => setFlashClass(''), 600)
    const t2 = setTimeout(() => setValueClass(''), 600)
    prevValue.current = value
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [value])

  const displayPct = previewValue ?? value
  const label = t(`status.${field}`)

  return (
    <div className={`status-bar-row ${isDanger ? 'danger' : ''}`}>
      <span className="status-icon" style={{ color: cfg.color }}>{cfg.icon}</span>
      <span className="status-label uppercase">{label}</span>
      <div className="status-track">
        {/* preview ghost bar */}
        {previewValue != null && (
          <div
            className="status-fill-preview"
            style={{
              width: `${previewValue}%`,
              background: previewDelta > 0 ? 'rgba(29,158,117,0.25)' : 'rgba(220,80,80,0.25)',
              boxShadow: previewDelta > 0 ? '0 0 8px rgba(29,158,117,0.3)' : '0 0 8px rgba(220,80,80,0.3)',
            }}
          />
        )}
        {/* actual bar */}
        <div
          className={`status-fill ${flashClass}`}
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${cfg.color}cc, ${cfg.color})`,
            boxShadow: isDanger
              ? `0 0 12px ${cfg.glow}`
              : `0 0 6px ${cfg.glow}55`,
          }}
        />
      </div>
      <span className={`status-value mono ${valueClass}`}>{value}</span>
      {previewDelta != null && (
        <span className={`status-preview-delta mono ${previewDelta > 0 ? 'pos' : 'neg'}`}>
          {previewDelta > 0 ? `+${previewDelta}` : previewDelta}
        </span>
      )}
    </div>
  )
}
