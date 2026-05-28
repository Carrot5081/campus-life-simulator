import StatusBar from './StatusBar'
import './StatusBars.css'

const FIELDS = ['academic', 'money', 'social', 'health']

export default function StatusBars({ status, previewEffects }) {
  return (
    <div className="status-bars glass-card corner-accent">
      {FIELDS.map(f => (
        <StatusBar
          key={f}
          field={f}
          value={status[f] ?? 50}
          previewDelta={previewEffects?.[f] ?? null}
        />
      ))}
    </div>
  )
}
