import { useGame } from '../context/GameContext'
import { useLanguage } from '../context/LanguageContext'
import { Character, CHARACTER_LIST, getExpressionFromStatus } from './Character'
import './CharacterFloat.css'

const EXPR_LABEL = {
  happy:    { zh: '😊 状态不错', en: '😊 Doing well'   },
  neutral:  { zh: '😐 还好还好', en: '😐 Hanging in'   },
  worried:  { zh: '😟 有点担心', en: '😟 A bit worried' },
  sad:      { zh: '😢 好难过啊', en: '😢 Feeling down'  },
  stressed: { zh: '😰 压力好大', en: '😰 Stressed out'  },
  sick:     { zh: '🤒 身体不适', en: '🤒 Not well'      },
  critical: { zh: '🚨 危险！',   en: '🚨 DANGER!'       },
}

// compact=true: header inline mode (no border card, small)
// compact=false: standalone card with label
export default function CharacterFloat({ compact = false }) {
  const { status } = useGame()
  const { lang } = useLanguage()
  const avatar     = localStorage.getItem('avatar') || 'blue'
  const expression = getExpressionFromStatus(status)
  const isCrit     = expression === 'critical'
  const label      = EXPR_LABEL[expression]?.[lang] ?? ''
  const ch         = CHARACTER_LIST.find(c => c.id === avatar)

  if (compact) {
    return (
      <div className={`char-float-compact ${isCrit ? 'char-float-critical' : ''}`}>
        <div className="char-float-inner">
          <Character avatar={avatar} expression={expression} size={38} animate />
        </div>
        <span className="char-float-compact-label" style={{ color: ch?.color }}>
          {label}
        </span>
      </div>
    )
  }

  return (
    <div className={`char-float ${isCrit ? 'char-float-critical' : ''}`}>
      <div className="char-float-inner">
        <Character avatar={avatar} expression={expression} size={52} animate />
      </div>
      <span className="char-float-label mono" style={{ color: ch?.color }}>
        {label}
      </span>
    </div>
  )
}
