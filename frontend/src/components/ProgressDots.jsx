import './ProgressDots.css'

export default function ProgressDots({ current, total = 15 }) {
  return (
    <div className="progress-dots">
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < current
        const active  = i === current - 1
        return (
          <span
            key={i}
            className={`pdot ${filled ? 'filled' : ''} ${active ? 'active' : ''}`}
          />
        )
      })}
      {current > total && (
        <span className="pdot-extra mono">+{current - total}</span>
      )}
    </div>
  )
}
