import { useLanguage } from '../context/LanguageContext'
import './Tutorial.css'

const ATTRS = [
  {
    icon: '◈', color: '#3878DC',
    zh: { name: '学业', min: '学业荒废 → 被退学', max: '卷到极限 → 精神崩溃' },
    en: { name: 'Academic', min: 'Neglected → Expelled', max: 'Overloaded → Breakdown' },
  },
  {
    icon: '◆', color: '#EF9F27',
    zh: { name: '金钱', min: '一贫如洗 → 活不下去', max: '暴富失控 → 失去斗志' },
    en: { name: 'Money', min: 'Broke → Can\'t survive', max: 'Too rich → Lost purpose' },
  },
  {
    icon: '◉', color: '#7F77DD',
    zh: { name: '社交', min: '彻底孤立 → 抑郁', max: '应酬太多 → 精力耗尽' },
    en: { name: 'Social', min: 'Isolated → Depression', max: 'Over-socialized → Burnout' },
  },
  {
    icon: '♥', color: '#1D9E75',
    zh: { name: '健康', min: '身体垮掉 → 住院', max: '过度焦虑 → 心理崩溃' },
    en: { name: 'Health', min: 'Body fails → Hospitalized', max: 'Anxiety peak → Collapse' },
  },
]

export default function Tutorial({ onClose }) {
  const { lang } = useLanguage()
  const zh = lang === 'zh'

  return (
    <div className="tutorial-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="tutorial-modal glass-card corner-accent page-enter">
        <div className="tut-header">
          <h2 className="tut-title">{zh ? '游戏说明' : 'How to Play'}</h2>
          <button className="tut-close" onClick={onClose}>✕</button>
        </div>

        <div className="tut-section">
          <p className="tut-lead">
            {zh
              ? '你是一名大学生，正在经历一个完整的学期。每回合发生一件事，你需要做出选择。'
              : 'You\'re a college student navigating an entire semester. Each round, something happens — you choose how to respond.'
            }
          </p>
        </div>

        <div className="tut-section">
          <h3 className="tut-section-title mono uppercase">
            {zh ? '四条属性 · 初始值 50' : '4 Attributes · Starting at 50'}
          </h3>
          <div className="tut-attrs">
            {ATTRS.map(a => {
              const d = zh ? a.zh : a.en
              return (
                <div key={a.name} className="tut-attr">
                  <span className="tut-attr-icon" style={{ color: a.color }}>{a.icon}</span>
                  <div className="tut-attr-body">
                    <span className="tut-attr-name" style={{ color: a.color }}>{d.name}</span>
                    <div className="tut-attr-rules">
                      <span className="tut-rule zero">0 → {d.min}</span>
                      <span className="tut-rule full">100 → {d.max}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="tut-section tut-rule-box">
          <span className="tut-warn-icon">⚠</span>
          <p>
            {zh
              ? '任何一条属性归零或爆满，游戏立刻结束。保持四条属性都在安全范围内，坚持更多回合。'
              : 'If any attribute hits 0 or 100, the game ends immediately. Keep all four attributes in the safe zone to survive longer.'
            }
          </p>
        </div>

        <div className="tut-section">
          <h3 className="tut-section-title mono uppercase">
            {zh ? '分数计算' : 'Scoring'}
          </h3>
          <div className="tut-score-formula mono">
            <span>{zh ? '存活回合 × 100' : 'Rounds Survived × 100'}</span>
            <span className="plus">+</span>
            <span>{zh ? '四条属性的平衡奖励' : 'Balance Bonus from all 4 attributes'}</span>
          </div>
        </div>

        <button className="tut-start-btn" onClick={onClose}>
          {zh ? '开始游戏' : 'Start Playing'}
        </button>
      </div>
    </div>
  )
}
