import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { startGame, getEvent, submitChoice } from '../api'
import { useGame } from '../context/GameContext'
import { useLanguage } from '../context/LanguageContext'
import StatusBars from '../components/StatusBars'
import EventCard from '../components/EventCard'
import ChoiceButton from '../components/ChoiceButton'
import ProgressDots from '../components/ProgressDots'
import LanguageToggle from '../components/LanguageToggle'
import Tutorial from '../components/Tutorial'
import CharacterFloat from '../components/CharacterFloat'
import RandomEventFlash from '../components/RandomEventFlash'
import './Game.css'

export default function Game() {
  const { t, lang } = useLanguage()
  const navigate  = useNavigate()
  const { sessionId, setSessionId, roundNum, setRoundNum, status, setStatus, setGameResult, resetGame } = useGame()

  const [event,           setEvent]           = useState(null)
  const [choices,         setChoices]         = useState([])
  const [animState,       setAnimState]       = useState('idle')
  const [choosing,        setChoosing]        = useState(false)
  const [previewFx,       setPreviewFx]       = useState(null)
  const [loadingEvt,      setLoadingEvt]      = useState(false)
  const [showTutorial,    setShowTutorial]    = useState(false)
  const [showRandomFlash, setShowRandomFlash] = useState(false)
  const [exitConfirm,     setExitConfirm]     = useState(false)
  const exitTimerRef = useRef(null)

  const username  = localStorage.getItem('username')   || '?'
  const bestScore = localStorage.getItem('best_score') || 0
  const playerId  = localStorage.getItem('player_id')

  // ── init session ──
  useEffect(() => {
    if (!playerId) { navigate('/login'); return }
    if (sessionId) return
    setShowTutorial(true)
    startGame(Number(playerId))
      .then(res => setSessionId(res.data.session_id))
      .catch(() => navigate('/login'))
  }, [])

  // ── fetch event ──
  useEffect(() => {
    if (!sessionId) return
    setLoadingEvt(true)
    setEvent(null)
    setChoices([])
    setPreviewFx(null)
    getEvent(sessionId, roundNum)
      .then(res => {
        const ev = res.data.event
        setEvent(ev)
        setChoices(res.data.choices)

        if (ev.event_type === 'random') {
          // show full-screen flash first, then card enters
          setShowRandomFlash(true)
          setTimeout(() => {
            setShowRandomFlash(false)
            setAnimState('entering')
            setTimeout(() => setAnimState('idle'), 460)
          }, 1900)
        } else {
          setAnimState('entering')
          setTimeout(() => setAnimState('idle'), 460)
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingEvt(false))
  }, [sessionId, roundNum])

  // ── exit / logout logic ──
  const handleExitClick = () => {
    if (exitConfirm) {
      // second click → confirmed
      clearTimeout(exitTimerRef.current)
      setExitConfirm(false);
      ['player_id', 'username', 'best_score', 'total_games', 'avatar'].forEach(k => localStorage.removeItem(k))
      resetGame()
      navigate('/login')
    } else {
      // first click → arm confirmation
      setExitConfirm(true)
      exitTimerRef.current = setTimeout(() => setExitConfirm(false), 3000)
    }
  }

  useEffect(() => () => clearTimeout(exitTimerRef.current), [])

  // ── handle choice ──
  const handleChoice = useCallback(async (choice) => {
    if (choosing || animState !== 'idle') return
    setChoosing(true)
    setPreviewFx(null)

    const exitDir = choice.label === choices[0]?.label ? 'exit-left' : 'exit-right'
    setAnimState(exitDir)

    try {
      await new Promise(r => setTimeout(r, 380))
      const res = await submitChoice(sessionId, choice.choice_id, event.event_id, roundNum)
      const d = res.data
      setStatus(d.new_status)

      if (d.game_over) {
        setGameResult({ score: d.score, rounds: roundNum, endReason: d.end_reason, finalStatus: d.new_status, sessionId })
        navigate('/gameover')
      } else {
        setRoundNum(d.next_round)
      }
    } catch (err) {
      console.error(err)
      setAnimState('idle')
    } finally {
      setChoosing(false)
    }
  }, [choosing, animState, choices, sessionId, event, roundNum])

  const handleHover = (effects) => !choosing && setPreviewFx(effects)
  const handleLeave = ()          => !choosing && setPreviewFx(null)

  // choices are blocked during random flash
  const blocked = choosing || showRandomFlash

  return (
    <div className="game-page page-enter">
      {showTutorial    && <Tutorial onClose={() => setShowTutorial(false)} />}
      {showRandomFlash && <RandomEventFlash event={event} />}

      {/* ── Header ── */}
      <header className="game-header glass-card">
        <div className="game-header-left">
          <span className="game-logo mono neon-blue">CLS</span>
          <CharacterFloat compact />
          <span className="game-player-name">{username}</span>
        </div>
        <div className="game-round-badge">
          <span className="mono">{t('game.round')}</span>
          <span className="round-num mono">{roundNum}</span>
        </div>
        <div className="game-header-right">
          <span className="game-stat">
            <span className="mono text-muted">{t('game.bestScore')}</span>
            <span className="mono neon-amber">{bestScore}</span>
          </span>
          <button className="header-help-btn" onClick={() => setShowTutorial(true)}>?</button>

          {/* Exit button with 2-click confirmation */}
          <button
            className={`game-exit-btn ${exitConfirm ? 'confirm' : ''}`}
            onClick={handleExitClick}
            title={lang === 'zh' ? '退出到主菜单' : 'Exit to menu'}
          >
            {exitConfirm
              ? (lang === 'zh' ? '确认?' : 'Sure?')
              : (lang === 'zh' ? '退出' : 'Exit')
            }
          </button>

          <LanguageToggle />
        </div>
      </header>

      {/* ── Status Bars ── */}
      <div className="game-status-section">
        <StatusBars status={status} previewEffects={previewFx} />
      </div>

      {/* ── Main Area ── */}
      <div className="game-main">
        <div className="game-choices">
          {choices.length > 0
            ? choices.map(ch => (
                <ChoiceButton
                  key={ch.choice_id}
                  choice={ch}
                  eventId={event?.event_id}
                  onHover={handleHover}
                  onLeave={handleLeave}
                  onClick={handleChoice}
                  disabled={blocked}
                />
              ))
            : loadingEvt
              ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="choice-skeleton"/>)
              : null
          }
        </div>
        <div className="game-card-wrap">
          <EventCard event={event} animState={animState} />
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="game-footer">
        <ProgressDots current={roundNum} total={15} />
        <span className="footer-hint mono text-muted">{t('game.chooseWisely')}</span>
      </footer>
    </div>
  )
}
