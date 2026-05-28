import { useLanguage } from '../context/LanguageContext'
import './RandomEventFlash.css'

const CATEGORY_EMOJI = {
  academic: '📚', finance: '💰', social: '🎉', health: '❤️', general: '🎓',
}

export default function RandomEventFlash({ event }) {
  const { lang } = useLanguage()
  const prob = event ? Math.round((event.probability ?? 0) * 100) : 0
  const emoji = CATEGORY_EMOJI[event?.category] ?? '⚡'

  return (
    <div className="rfe-overlay">
      {/* scan lines */}
      <div className="rfe-scan" />

      {/* corner accents */}
      <div className="rfe-corner rfe-tl" />
      <div className="rfe-corner rfe-tr" />
      <div className="rfe-corner rfe-bl" />
      <div className="rfe-corner rfe-br" />

      {/* center content */}
      <div className="rfe-content">
        <div className="rfe-label mono">
          {lang === 'zh' ? '// 意外插曲' : '// UNEXPECTED'}
        </div>

        <div className="rfe-main-text">
          <span className="rfe-emoji">{emoji}</span>
          <h1 className="rfe-title">
            {lang === 'zh' ? '随机事件' : 'RANDOM EVENT'}
          </h1>
          <span className="rfe-emoji">{emoji}</span>
        </div>

        <div className="rfe-sub mono">
          {prob > 0 && (
            <span className="rfe-prob">
              {lang === 'zh' ? `触发概率 ${prob}%` : `${prob}% TRIGGER CHANCE`}
            </span>
          )}
          {event?.conditions && (
            <span className="rfe-cond">
              {lang === 'zh' ? `触发条件: ${event.conditions}` : `COND: ${event.conditions}`}
            </span>
          )}
        </div>

        {/* animated dots */}
        <div className="rfe-dots">
          {[0,1,2,3,4].map(i => <span key={i} className="rfe-dot" style={{ animationDelay: `${i * 0.12}s` }}/>)}
        </div>
      </div>
    </div>
  )
}
