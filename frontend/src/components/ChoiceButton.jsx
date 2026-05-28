import { useLanguage } from '../context/LanguageContext'
import './ChoiceButton.css'

const EFFECT_FIELDS = ['academic', 'money', 'social', 'health']
const FIELD_LABELS    = { academic: '学业', money: '金钱', social: '社交', health: '健康' }
const FIELD_LABELS_EN = { academic: 'ACG', money: 'MNY', social: 'SOC', health: 'HLT' }

// 每个选项标签对应不同粒子颜色，增加视觉区分度
const LABEL_COLORS = {
  A: '#3878DC',
  B: '#7F77DD',
  C: '#1D9E75',
  D: '#EF9F27',
}

function spawnParticles(e, color) {
  const count = 9
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span')
    p.className = 'particle-dot'
    // 固定定位到点击位置
    p.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: ${3 + Math.random() * 4}px;
      height: ${3 + Math.random() * 4}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 6px ${color}88;
      --dx: ${(Math.random() - 0.5) * 70}px;
      --dy: ${(Math.random() - 0.5) * 70}px;
      animation: particle-burst 0.55s ease-out forwards;
    `
    document.body.appendChild(p)
    setTimeout(() => p.remove(), 580)
  }
}

export default function ChoiceButton({ choice, eventId, onHover, onLeave, onClick, disabled }) {
  const { lang, tChoice } = useLanguage()
  const text        = tChoice(eventId, choice.label) || choice.choice_text
  const fieldLabels = lang === 'en' ? FIELD_LABELS_EN : FIELD_LABELS
  const color       = LABEL_COLORS[choice.label] ?? '#3878DC'

  const effects = EFFECT_FIELDS.filter(f => choice.effects?.[f] != null && choice.effects[f] !== 0)

  const handleClick = (e) => {
    if (disabled) return
    spawnParticles(e, color)
    onClick?.(choice)
  }

  return (
    <button
      className={`choice-btn ${disabled ? 'disabled' : ''}`}
      style={{ '--choice-color': color, '--choice-glow': `${color}33` }}
      onMouseEnter={() => onHover?.(choice.effects)}
      onMouseLeave={() => onLeave?.()}
      onClick={handleClick}
      disabled={disabled}
    >
      <div className="choice-label-badge mono" style={{ color, borderColor: `${color}66`, background: `${color}18` }}>
        {choice.label}
      </div>
      <div className="choice-body">
        <span className="choice-text">{text}</span>
        {effects.length > 0 && (
          <div className="choice-effects">
            {effects.map(f => {
              const delta = choice.effects[f]
              return (
                <span key={f} className={`effect-tag ${delta > 0 ? 'pos' : 'neg'}`}>
                  {fieldLabels[f]} {delta > 0 ? `+${delta}` : delta}
                </span>
              )
            })}
          </div>
        )}
      </div>
      <span className="choice-arrow">→</span>
    </button>
  )
}
