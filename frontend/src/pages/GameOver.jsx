import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAnalysis } from '../api'
import { useGame } from '../context/GameContext'
import { useLanguage } from '../context/LanguageContext'
import LanguageToggle from '../components/LanguageToggle'
import { DEATH_TITLES, getPersonalityTitle, getAnalysisComments } from '../i18n/titles'
import './GameOver.css'

const STATUS_CONFIG = {
  academic: { color: '#3878DC', icon: '◈', zh: '学业', en: 'Academic' },
  money:    { color: '#EF9F27', icon: '◆', zh: '金钱', en: 'Money'    },
  social:   { color: '#7F77DD', icon: '◉', zh: '社交', en: 'Social'   },
  health:   { color: '#1D9E75', icon: '♥', zh: '健康', en: 'Health'   },
}

export default function GameOver() {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const { gameResult, resetGame } = useGame()
  const [analysis, setAnalysis] = useState(null)

  // Guard: only run once on mount — avoids re-render race when resetGame() is called
  useEffect(() => {
    if (!gameResult) navigate('/login')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!gameResult?.sessionId) return
    getAnalysis(gameResult.sessionId)
      .then(res => setAnalysis(res.data))
      .catch(() => {})
  }, [gameResult?.sessionId])

  if (!gameResult) return null

  const { score, rounds, endReason, finalStatus } = gameResult
  const baseScore    = rounds * 100
  const balanceBonus = score - baseScore
  const reasonText   = t(`gameover.reasons.${endReason}`) || endReason

  const deathTitle     = DEATH_TITLES[endReason]?.[lang]
  const personalTitle  = analysis
    ? getPersonalityTitle(analysis.avgs, analysis.rounds, lang)
    : null
  const comments       = analysis
    ? getAnalysisComments(analysis.avgs, analysis.mins, analysis.maxs, analysis.rounds, lang)
    : []

  const handlePlayAgain = () => { resetGame(); navigate('/game') }

  return (
    <div className="gameover-page page-enter">
      <div className="gameover-bg-glow" />

      <header className="gameover-header">
        <span className="mono text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.12em' }}>CLS://TERMINATED</span>
        <LanguageToggle />
      </header>

      <div className="gameover-scroll">
        <div className="gameover-center">

          {/* ── Death title + reason ── */}
          <div className="gameover-title-block">
            {deathTitle && (
              <div className="death-title-wrap">
                <span className="death-emoji">{deathTitle.emoji}</span>
                <h1 className="gameover-title">{deathTitle.title}</h1>
              </div>
            )}
            <p className="gameover-reason">{reasonText}</p>
            {deathTitle && (
              <p className="death-flavor">{deathTitle.flavor}</p>
            )}
          </div>

          {/* ── Personality + rounds ── */}
          <div className="gameover-meta glass-card">
            <div className="meta-item">
              <span className="meta-label mono text-muted uppercase">{t('gameover.survived')}</span>
              <span className="meta-value mono">{rounds}</span>
            </div>
            {personalTitle && (
              <div className="meta-item">
                <span className="meta-label mono text-muted uppercase">
                  {lang === 'zh' ? '玩家人设' : 'Play Style'}
                </span>
                <span className="meta-value personality">{personalTitle}</span>
              </div>
            )}
          </div>

          {/* ── Analysis comments ── */}
          {comments.length > 0 && (
            <div className="gameover-comments glass-card">
              <h3 className="section-title">
                {lang === 'zh' ? '≡ 局势分析' : '≡ Play Analysis'}
              </h3>
              <ul className="comments-list">
                {comments.map((c, i) => (
                  <li key={i} className="comment-item">
                    <span className="comment-bullet neon-blue">▶</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Final status ── */}
          <div className="gameover-status glass-card scanline">
            <h3 className="section-title">{t('gameover.finalStatus')}</h3>
            <div className="status-grid">
              {Object.entries(STATUS_CONFIG).map(([field, cfg]) => {
                const val = finalStatus?.[field] ?? 0
                return (
                  <div key={field} className="status-item">
                    <span className="status-item-icon" style={{ color: cfg.color }}>{cfg.icon}</span>
                    <span className="status-item-label">
                      {lang === 'en' ? cfg.en : cfg.zh}
                    </span>
                    <div className="status-item-bar-wrap">
                      <div
                        className="status-item-bar"
                        style={{ width: `${val}%`, background: cfg.color, boxShadow: `0 0 6px ${cfg.color}88` }}
                      />
                    </div>
                    <span className="status-item-val mono">{val}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Score breakdown ── */}
          <div className="gameover-score glass-card corner-accent">
            <h3 className="section-title">{t('gameover.scoreBreakdown')}</h3>
            <div className="score-rows">
              <div className="score-row">
                <span className="score-row-label">{t('gameover.baseScore')}</span>
                <span className="score-row-val mono">
                  {rounds} × 100 = <span className="neon-blue">{baseScore}</span>
                </span>
              </div>
              <div className="score-row">
                <span className="score-row-label">{t('gameover.balanceBonus')}</span>
                <span className="score-row-val mono neon-teal">+{balanceBonus}</span>
              </div>
              <div className="score-divider" />
              <div className="score-row total">
                <span className="score-row-label">{t('gameover.totalScore')}</span>
                <span className="score-row-val mono neon-amber">{score}</span>
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="gameover-actions">
            <button className="go-btn primary" onClick={handlePlayAgain}>
              ↩ {t('gameover.playAgain')}
            </button>
            <button className="go-btn secondary" onClick={() => navigate('/leaderboard')}>
              {t('gameover.leaderboard')}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
