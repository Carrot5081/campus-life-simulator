import { useLanguage } from '../context/LanguageContext'
import './EventCard.css'

// 每个 category 对应主题色 + 水印 emoji
const CATEGORY_THEME = {
  academic: { color: '#3878DC', glow: 'rgba(56,120,220,0.22)',  border: 'rgba(56,120,220,0.45)',  emoji: '📚' },
  finance:  { color: '#EF9F27', glow: 'rgba(239,159,39,0.22)',  border: 'rgba(239,159,39,0.45)',  emoji: '💰' },
  social:   { color: '#7F77DD', glow: 'rgba(127,119,221,0.22)', border: 'rgba(127,119,221,0.45)', emoji: '🎉' },
  health:   { color: '#1D9E75', glow: 'rgba(29,158,117,0.22)',  border: 'rgba(29,158,117,0.45)',  emoji: '❤️' },
  general:  { color: '#5A6A9A', glow: 'rgba(90,106,154,0.22)',  border: 'rgba(90,106,154,0.45)',  emoji: '🎓' },
}

export default function EventCard({ event, animState }) {
  const { t, tEvent, lang } = useLanguage()
  if (!event) return <div className="event-card glass-card scanline skeleton" />

  const isFixed   = event.event_type === 'fixed'
  const isSpecial = !isFixed && (event.probability ?? 0) >= 0.85
  const theme     = CATEGORY_THEME[event.category] ?? CATEGORY_THEME.general
  const title    = tEvent(event.event_id, 'title')       || event.title
  const description = tEvent(event.event_id, 'description') || event.description

  const animClass = {
    entering:     'card-entering',
    idle:         '',
    'exit-left':  'card-exit-left',
    'exit-right': 'card-exit-right',
  }[animState] || ''

  return (
    <div
      className={`event-card glass-card scanline corner-accent ${animClass}`}
      style={{
        borderColor: theme.border,
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04), 0 0 20px ${theme.glow}`,
        '--cat-color': theme.color,
      }}
    >
      {/* 顶部类别高亮条 */}
      <div className="card-accent-stripe" style={{ background: theme.color }} />

      {/* 大号 emoji 水印（右下角） */}
      <span className="card-watermark" aria-hidden="true">{theme.emoji}</span>

      {/* type badge */}
      {isSpecial ? (
        <div className="event-badge badge-special">
          ⚡ {lang === 'zh' ? '命运干预' : 'FATE EVENT'}
        </div>
      ) : (
        <div className={`event-badge ${isFixed ? 'badge-fixed' : 'badge-random'}`}>
          {isFixed
            ? `${t('game.fixedEvent')} · ${t('game.seq')}${event.sequence}${t('game.seqSuffix')}`
            : `${t('game.randomEvent')} · ${Math.round((event.probability ?? 0) * 100)}%`
          }
        </div>
      )}

      {/* condition tag */}
      {!isFixed && event.conditions && (
        <div className="event-condition">
          <span className="cond-label">{t('game.condition')}</span>
          <span className="cond-value mono">{event.conditions}</span>
        </div>
      )}

      <h2 className="event-title">{title}</h2>
      <p  className="event-desc">{description}</p>

      <div className="event-difficulty">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`diff-dot ${i < event.difficulty ? 'filled' : ''}`}
            style={i < event.difficulty ? { background: theme.color, boxShadow: `0 0 5px ${theme.glow}` } : {}}
          />
        ))}
      </div>
    </div>
  )
}
