import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api'
import { useLanguage } from '../context/LanguageContext'
import LanguageToggle from '../components/LanguageToggle'
import { Character, CHARACTER_LIST } from '../components/Character'
import './Login.css'

export default function Login() {
  const { t, lang } = useLanguage()
  const navigate = useNavigate()

  const [tab,      setTab]      = useState('login')
  const [form,     setForm]     = useState({ username: '', email: '', password: '' })
  const [avatar,   setAvatar]   = useState('blue')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [mouseOff, setMouseOff] = useState({ x: 0, y: 0 })

  const leftRef = useRef(null)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // Mouse tracking for pupil effect on left panel
  const handleMouseMove = useCallback((e) => {
    if (!leftRef.current) return
    const r = leftRef.current.getBoundingClientRect()
    const nx = ((e.clientX - r.left) / r.width  - 0.5) * 2   // -1 to 1
    const ny = ((e.clientY - r.top)  / r.height - 0.5) * 2
    setMouseOff({ x: nx * 3.5, y: ny * 3 })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        const res = await login(form.username, form.password)
        const d = res.data
        localStorage.setItem('player_id',   d.player_id)
        localStorage.setItem('username',    d.username)
        localStorage.setItem('best_score',  d.best_score)
        localStorage.setItem('total_games', d.total_games)
        localStorage.setItem('avatar',      d.avatar || 'blue')
        navigate('/game')
      } else {
        const res = await register(form.username, form.email, form.password, avatar)
        // auto-login after register
        const lr = await login(form.username, form.password)
        const d = lr.data
        localStorage.setItem('player_id',   d.player_id)
        localStorage.setItem('username',    d.username)
        localStorage.setItem('best_score',  d.best_score)
        localStorage.setItem('total_games', d.total_games)
        localStorage.setItem('avatar',      d.avatar || avatar)
        navigate('/game')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page page-enter">
      {/* ── Left panel: character stage ── */}
      <div className="login-left" ref={leftRef} onMouseMove={handleMouseMove}>
        <div className="login-left-bg" />
        <div className="login-left-grid" />

        <div className="login-stage-header">
          <span className="login-stage-logo mono neon-blue">CLS://v1.0</span>
          <h1 className="login-stage-title">Campus Life<br/>Simulator</h1>
          <p className="login-stage-sub mono text-muted">
            {lang === 'zh' ? '选择你的游戏角色' : 'Choose Your Character'}
          </p>
        </div>

        <div className="login-char-grid">
          {CHARACTER_LIST.map(ch => {
            const selected = avatar === ch.id
            return (
              <div
                key={ch.id}
                className={`login-char-card ${selected ? 'selected' : ''}`}
                style={selected ? { borderColor: ch.color, boxShadow: `0 0 18px ${ch.color}44` } : {}}
                onClick={() => setAvatar(ch.id)}
              >
                <div className={selected ? 'char-float-idle' : ''}>
                  <Character
                    avatar={ch.id}
                    expression="neutral"
                    pupilOffset={mouseOff}
                    size={64}
                    animate={selected}
                  />
                </div>
                <span className="char-card-name" style={{ color: selected ? ch.color : undefined }}>
                  {lang === 'zh' ? ch.name : ch.nameEn}
                </span>
                <span className="char-card-desc">
                  {lang === 'zh' ? ch.desc : ch.descEn}
                </span>
                {selected && <div className="char-card-check" style={{ background: ch.color }}>✓</div>}
              </div>
            )
          })}
        </div>

        <p className="login-stage-hint mono text-muted">
          {lang === 'zh' ? '· 注册时将保存你的选择 ·' : '· Your choice is saved on register ·'}
        </p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="login-right">
        <div className="login-right-top">
          <LanguageToggle />
        </div>

        <div className="login-form-wrap">
          <div className="login-card glass-card corner-accent">
            <div className="login-title-block">
              <h2 className="login-form-title">
                {tab === 'login'
                  ? (lang === 'zh' ? '欢迎回来' : 'Welcome Back')
                  : (lang === 'zh' ? '创建账号' : 'Create Account')
                }
              </h2>
              <p className="login-form-sub text-muted">
                {tab === 'login'
                  ? (lang === 'zh' ? '继续你的大学故事' : 'Continue your campus story')
                  : (lang === 'zh' ? '开启你的大学生涯' : 'Start your campus journey')
                }
              </p>
            </div>

            <div className="login-tabs">
              <button className={`login-tab ${tab === 'login' ? 'active' : ''}`}
                onClick={() => { setTab('login'); setError('') }}>
                {t('login.tabLogin')}
              </button>
              <button className={`login-tab ${tab === 'register' ? 'active' : ''}`}
                onClick={() => { setTab('register'); setError('') }}>
                {t('login.tabRegister')}
              </button>
            </div>

            {/* Mobile-only character picker — only shown on register tab */}
            {tab === 'register' && (
              <div className="mobile-char-picker">
                <p className="mobile-char-label mono text-muted">
                  {lang === 'zh' ? '选择角色' : 'Choose Character'}
                </p>
                <div className="mobile-char-row">
                  {CHARACTER_LIST.map(ch => {
                    const selected = avatar === ch.id
                    return (
                      <div
                        key={ch.id}
                        className={`mobile-char-item ${selected ? 'selected' : ''}`}
                        style={selected ? { borderColor: ch.color, boxShadow: `0 0 12px ${ch.color}44` } : {}}
                        onClick={() => setAvatar(ch.id)}
                      >
                        <Character avatar={ch.id} expression={selected ? 'happy' : 'neutral'} size={44} animate={selected} />
                        <span className="mobile-char-name" style={{ color: selected ? ch.color : undefined }}>
                          {lang === 'zh' ? ch.name : ch.nameEn}
                        </span>
                        {selected && <div className="mobile-char-check" style={{ background: ch.color }}>✓</div>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label>{t('login.username')}</label>
                <input type="text" placeholder={t('login.usernamePlaceholder')}
                  value={form.username} onChange={e => set('username', e.target.value)} required/>
              </div>

              {tab === 'register' && (
                <div className="form-field">
                  <label>{t('login.email')}</label>
                  <input type="email" placeholder={t('login.emailPlaceholder')}
                    value={form.email} onChange={e => set('email', e.target.value)} required/>
                </div>
              )}

              <div className="form-field">
                <label>{t('login.password')}</label>
                <input type="password" placeholder={t('login.passwordPlaceholder')}
                  value={form.password} onChange={e => set('password', e.target.value)} required/>
              </div>

              {error && <div className="form-error">{error}</div>}

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? '···' : (tab === 'login' ? t('login.loginBtn') : t('login.registerBtn'))}
              </button>
            </form>

            <div className="login-switch">
              <button onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError('') }}>
                {tab === 'login' ? t('login.noAccount') : t('login.hasAccount')}
              </button>
            </div>

            {/* Selected avatar preview at bottom of form */}
            {tab === 'register' && (
              <div className="login-avatar-preview">
                <Character avatar={avatar} expression="happy" size={40} animate/>
                <span className="mono text-muted" style={{ fontSize: '0.72rem' }}>
                  {lang === 'zh'
                    ? `已选：${CHARACTER_LIST.find(c=>c.id===avatar)?.name}`
                    : `Selected: ${CHARACTER_LIST.find(c=>c.id===avatar)?.nameEn}`
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
