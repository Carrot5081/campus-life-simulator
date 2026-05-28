import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLeaderboard, getPlayerRank, getGlobalStats } from '../api'
import { useLanguage } from '../context/LanguageContext'
import { useGame } from '../context/GameContext'
import LanguageToggle from '../components/LanguageToggle'
import { DEATH_TITLES } from '../i18n/titles'
import { MiniAvatar } from '../components/Character'
import './Leaderboard.css'

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32']

const FIELD_INFO = {
  academic: { zh: '学业',  en: 'Academic', color: '#3878DC', icon: '◈' },
  money:    { zh: '金钱',  en: 'Money',    color: '#EF9F27', icon: '◆' },
  social:   { zh: '社交',  en: 'Social',   color: '#7F77DD', icon: '◉' },
  health:   { zh: '健康',  en: 'Health',   color: '#1D9E75', icon: '♥' },
}

function DeathBar({ endReason, cnt, total, lang }) {
  const info = DEATH_TITLES[endReason]?.[lang]
  const pct  = total > 0 ? Math.round(cnt / total * 100) : 0
  return (
    <div className="death-bar-row">
      <span className="death-bar-emoji">{info?.emoji ?? '💀'}</span>
      <div className="death-bar-body">
        <div className="death-bar-head">
          <span className="death-bar-title">{info?.title ?? endReason}</span>
          <span className="death-bar-pct mono">{pct}%</span>
        </div>
        <div className="death-bar-track">
          <div className="death-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="death-bar-count mono text-muted">{cnt} {lang === 'zh' ? '局' : 'games'}</span>
      </div>
    </div>
  )
}

export default function Leaderboard() {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const { resetGame } = useGame()
  const [tab,     setTab]     = useState('rank')
  const [board,   setBoard]   = useState([])
  const [myRank,  setMyRank]  = useState(null)
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  const playerId = localStorage.getItem('player_id')

  useEffect(() => {
    const reqs = [
      getLeaderboard(),
      playerId ? getPlayerRank(Number(playerId)) : Promise.resolve(null),
      getGlobalStats(),
    ]
    Promise.all(reqs)
      .then(([lb, me, gs]) => {
        setBoard(lb.data)
        if (me) setMyRank(me.data)
        setStats(gs.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalDeaths = stats?.deaths?.reduce((s, d) => s + d.cnt, 0) ?? 0

  // find most common killer
  const topKiller = stats?.deaths?.[0]

  // find weakest final attribute from final_avgs
  const weakestField = stats?.final_avgs
    ? Object.entries(stats.final_avgs)
        .filter(([k]) => k.startsWith('avg_'))
        .sort((a, b) => a[1] - b[1])[0]?.[0]?.replace('avg_', '')
    : null

  return (
    <div className="lb-page page-enter">
      <div className="lb-bg-glow" />

      <header className="lb-header">
        <span className="lb-back mono" onClick={() => { if (playerId) { resetGame(); navigate('/game') } else { navigate('/login') } }}>
          ← {t('leaderboard.backToGame')}
        </span>
        <h1 className="lb-title">{t('leaderboard.title')}</h1>
        <LanguageToggle />
      </header>

      {/* tabs */}
      <div className="lb-tabs">
        <button className={`lb-tab ${tab === 'rank' ? 'active' : ''}`} onClick={() => setTab('rank')}>
          {lang === 'zh' ? '玩家排名' : 'Rankings'}
        </button>
        <button className={`lb-tab ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>
          {lang === 'zh' ? '数据统计' : 'Statistics'}
        </button>
      </div>

      {/* ── Rankings Tab ── */}
      {tab === 'rank' && (
        <>
          {myRank && (
            <div className="lb-myrank glass-card corner-accent">
              <span className="myrank-label mono text-muted uppercase">{t('leaderboard.yourRank')}</span>
              <span className="myrank-num mono neon-amber">#{myRank.rank_num}</span>
              <span className="myrank-name">{myRank.username}</span>
              <span className="myrank-score mono neon-blue">{myRank.best_score}</span>
            </div>
          )}

          <div className="lb-table-wrap">
            {loading ? (
              <div className="lb-loading mono">{t('leaderboard.loading')}</div>
            ) : board.length === 0 ? (
              <div className="lb-empty">{t('leaderboard.empty')}</div>
            ) : (
              <div className="lb-table glass-card">
                <div className="lb-thead">
                  <span>{t('leaderboard.rank')}</span>
                  <span>{t('leaderboard.player')}</span>
                  <span>{t('leaderboard.bestScore')}</span>
                  <span>{t('leaderboard.bestRounds')}</span>
                  <span>{t('leaderboard.totalGames')}</span>
                </div>
                {board.map((row, i) => {
                  const isMe = String(row.player_id) === String(playerId)
                  const rankColor = RANK_COLORS[i] ?? 'var(--white)'
                  return (
                    <div key={row.player_id} className={`lb-row ${isMe ? 'me' : ''}`}>
                      <span className="lb-rank mono" style={{ color: rankColor }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="lb-name">
                        <MiniAvatar avatar={row.avatar || 'blue'} size={24}/>
                        {row.username}
                        {isMe && <span className="me-tag">YOU</span>}
                      </span>
                      <span className="lb-score mono" style={{ color: rankColor }}>{row.best_score}</span>
                      <span className="lb-rounds mono">{row.best_rounds ?? '—'}</span>
                      <span className="lb-games mono text-muted">{row.total_games}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Stats Tab ── */}
      {tab === 'stats' && (
        <div className="stats-section">
          {loading || !stats ? (
            <div className="lb-loading mono">{t('leaderboard.loading')}</div>
          ) : stats.totals.total_games === 0 ? (
            <div className="lb-empty">
              {lang === 'zh' ? '还没有人玩过这个游戏，成为第一个吧！' : 'No one has played yet — be the first!'}
            </div>
          ) : (
            <>
              {/* overview cards */}
              <div className="stats-overview">
                <div className="stat-card glass-card">
                  <span className="stat-card-num mono neon-blue">{stats.totals.total_players}</span>
                  <span className="stat-card-label mono text-muted uppercase">
                    {lang === 'zh' ? '玩家总数' : 'Total Players'}
                  </span>
                </div>
                <div className="stat-card glass-card">
                  <span className="stat-card-num mono neon-amber">{stats.totals.total_games}</span>
                  <span className="stat-card-label mono text-muted uppercase">
                    {lang === 'zh' ? '总局数' : 'Total Games'}
                  </span>
                </div>
                <div className="stat-card glass-card">
                  <span className="stat-card-num mono neon-teal">{stats.round_stats.avg_rounds ?? '—'}</span>
                  <span className="stat-card-label mono text-muted uppercase">
                    {lang === 'zh' ? '平均回合' : 'Avg Rounds'}
                  </span>
                </div>
                <div className="stat-card glass-card">
                  <span className="stat-card-num mono" style={{ color: 'var(--purple)' }}>
                    {stats.round_stats.max_rounds ?? '—'}
                  </span>
                  <span className="stat-card-label mono text-muted uppercase">
                    {lang === 'zh' ? '最高回合' : 'Max Rounds'}
                  </span>
                </div>
              </div>

              {/* top killer commentary */}
              {topKiller && (
                <div className="stats-commentary glass-card">
                  <span className="commentary-icon">
                    {DEATH_TITLES[topKiller.end_reason]?.[lang]?.emoji ?? '💀'}
                  </span>
                  <div className="commentary-body">
                    <p className="commentary-main">
                      {lang === 'zh'
                        ? `最致命的杀手是「${DEATH_TITLES[topKiller.end_reason]?.zh?.title ?? topKiller.end_reason}」，已经收走了 ${topKiller.cnt} 条大学生命。`
                        : `The deadliest killer is "${DEATH_TITLES[topKiller.end_reason]?.en?.title ?? topKiller.end_reason}" — responsible for ${topKiller.cnt} student casualties.`
                      }
                    </p>
                    {weakestField && stats.final_avgs && (
                      <p className="commentary-sub">
                        {lang === 'zh'
                          ? `玩家临死前「${FIELD_INFO[weakestField]?.zh ?? weakestField}」的均值最低，是最容易被忽视的属性。`
                          : `On average, "${FIELD_INFO[weakestField]?.en ?? weakestField}" is the most neglected attribute at time of death.`
                        }
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* death distribution */}
              <div className="stats-deaths glass-card">
                <h3 className="section-title">
                  {lang === 'zh' ? '≡ 死亡原因分布' : '≡ Cause of Death'}
                </h3>
                <div className="death-bars">
                  {stats.deaths.map(d => (
                    <DeathBar
                      key={d.end_reason}
                      endReason={d.end_reason}
                      cnt={d.cnt}
                      total={totalDeaths}
                      lang={lang}
                    />
                  ))}
                </div>
              </div>

              {/* final avg attributes */}
              {stats.final_avgs && (
                <div className="stats-final-avgs glass-card">
                  <h3 className="section-title">
                    {lang === 'zh' ? '≡ 玩家临终时各属性均值' : '≡ Average Final Attributes'}
                  </h3>
                  <div className="final-avgs-grid">
                    {Object.entries(FIELD_INFO).map(([field, info]) => {
                      const val = stats.final_avgs[`avg_${field}`] ?? '—'
                      return (
                        <div key={field} className="final-avg-item">
                          <span className="final-avg-icon" style={{ color: info.color }}>{info.icon}</span>
                          <span className="final-avg-label" style={{ color: info.color }}>
                            {lang === 'zh' ? info.zh : info.en}
                          </span>
                          <span className="final-avg-val mono">{val}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* hot death rounds */}
              {stats.hot_rounds?.length > 0 && (
                <div className="stats-hot-rounds glass-card">
                  <h3 className="section-title">
                    {lang === 'zh' ? '≡ 最危险的回合' : '≡ Deadliest Rounds'}
                  </h3>
                  <div className="hot-rounds-list">
                    {stats.hot_rounds.map((r, i) => (
                      <div key={i} className="hot-round-item">
                        <span className="hot-round-num mono neon-red">R{r.round_num}</span>
                        <div className="hot-round-bar-wrap">
                          <div
                            className="hot-round-bar"
                            style={{ width: `${Math.round(r.cnt / stats.hot_rounds[0].cnt * 100)}%` }}
                          />
                        </div>
                        <span className="hot-round-cnt mono text-muted">
                          {r.cnt} {lang === 'zh' ? '人' : 'deaths'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
