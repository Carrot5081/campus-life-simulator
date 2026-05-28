import { useState, useEffect, useRef } from 'react'
import './Character.css'

// ─── Character metadata ───
export const CHARACTER_LIST = [
  { id: 'blue',   name: '蓝芯',  nameEn: 'ZIRO',   color: '#3878DC', desc: '刷题狂人', descEn: 'Study Maniac'  },
  { id: 'orange', name: '橙橙',  nameEn: 'SOCHI',  color: '#FF6B35', desc: '社交达人', descEn: 'Social Star'   },
  { id: 'green',  name: '绿萌',  nameEn: 'MOCHI',  color: '#1D9E75', desc: '健康达人', descEn: 'Health Guru'   },
  { id: 'amber',  name: '黄豆',  nameEn: 'COINS',  color: '#EF9F27', desc: '理财高手', descEn: 'Money Master'  },
  { id: 'purple', name: '紫灵',  nameEn: 'MYSTIC', color: '#7F77DD', desc: '神秘系',   descEn: 'The Mystic'    },
  { id: 'red',    name: '赤焰',  nameEn: 'BLAZE',  color: '#FF3D5A', desc: '天不怕地不怕', descEn: 'Fear Nothing' },
]

// ─── Mouth paths (all Q-bezier for smooth morphing, viewBox 0 0 100 120) ───
const MOUTH = {
  happy:   'M 37 74 Q 50 85 63 74',
  neutral: 'M 37 74 Q 50 74 63 74',
  worried: 'M 37 74 Q 50 70 63 74',
  sad:     'M 38 78 Q 50 67 62 78',
  stressed:'M 37 74 Q 50 70 63 74',
  sick:    'M 38 74 Q 50 74 62 74',
  critical:'M 39 80 Q 50 65 61 80',
}

// ─── Derive expression from status values ───
export function getExpressionFromStatus({ academic = 50, money = 50, social = 50, health = 50 } = {}) {
  const vals = [academic, money, social, health]
  const min = Math.min(...vals)
  const max = Math.max(...vals)

  // Critical / specific crises
  if (min < 12 || max > 88) return 'critical'
  if (health   < 18) return 'sick'
  if (social   < 18) return 'sad'
  if (academic > 82) return 'stressed'

  // Danger zone → worried
  if (min < 22 || max > 78) return 'worried'

  // Caution zone → neutral (brief transition state)
  if (min < 32 || max > 68) return 'neutral'

  // Everything else → happy (most of the time)
  return 'happy'
}

// ─── Eyebrow helper ───
function Brows({ type }) {
  if (!type) return null
  const sw = { strokeWidth: '2.8', strokeLinecap: 'round', fill: 'none' }
  if (type === 'worried' || type === 'stressed') return (
    <g stroke="rgba(0,0,0,0.45)" {...sw}>
      <path d="M 26 38 Q 33 33 40 37"/><path d="M 60 37 Q 67 33 74 38"/>
    </g>
  )
  if (type === 'sad') return (
    <g stroke="rgba(0,0,0,0.45)" {...sw}>
      <path d="M 26 36 Q 33 40 40 36"/><path d="M 60 36 Q 67 40 74 36"/>
    </g>
  )
  if (type === 'critical') return (
    <g stroke="rgba(220,80,80,0.85)" {...sw}>
      <path d="M 24 36 Q 33 31 42 35"/><path d="M 58 35 Q 67 31 76 36"/>
    </g>
  )
  return null
}

// ─── Single eye (whites + pupil / sick-X / amber-squint / purple-almond) ───
function Eye({ cx, cy, er, pr, offset, blink, sick, amber, purple }) {
  const px = cx + (offset?.x || 0)
  const py = cy + (offset?.y || 0)
  const scaleY = blink ? 0.07 : 1

  return (
    <g style={{ transform: `scaleY(${scaleY})`, transformOrigin: `${cx}px ${cy}px`, transition: 'transform 0.1s ease' }}>
      {/* white */}
      {purple
        ? <ellipse cx={cx} cy={cy} rx={er * 1.35} ry={er * 0.78} fill="white"/>
        : <circle  cx={cx} cy={cy} r={er} fill="white"/>
      }
      {/* pupil / expression */}
      {sick ? (
        <g stroke="#1a1a2e" strokeWidth="2.2" strokeLinecap="round">
          <line x1={cx-3} y1={cy-3} x2={cx+3} y2={cy+3}/>
          <line x1={cx+3} y1={cy-3} x2={cx-3} y2={cy+3}/>
        </g>
      ) : amber ? (
        <path d={`M ${cx-pr} ${cy} A ${pr} ${pr} 0 0 0 ${cx+pr} ${cy}`} fill="#1a1a2e"/>
      ) : (
        <circle cx={px} cy={py} r={pr} fill="#1a1a2e"/>
      )}
      {/* shine */}
      {!sick && <circle cx={cx + er * 0.28} cy={cy - er * 0.28} r={pr * 0.38} fill="rgba(255,255,255,0.92)"/>}
    </g>
  )
}

// ─── Main Character component ───
export function Character({ avatar = 'blue', expression = 'neutral', pupilOffset = { x: 0, y: 0 }, size = 100, animate = false }) {
  const [blink,    setBlink]    = useState(false)
  const [exprKey,  setExprKey]  = useState(expression)  // used as SVG key for mouth re-mount
  const [popping,  setPopping]  = useState(false)        // face bounce on expression change
  const prevExprRef = useRef(expression)

  // Blink loop
  useEffect(() => {
    if (!animate) return
    let t
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true)
        setTimeout(() => { setBlink(false); loop() }, 130)
      }, 2800 + Math.random() * 3800)
    }
    loop()
    return () => clearTimeout(t)
  }, [animate])

  // Expression change: bounce + remount mouth
  useEffect(() => {
    if (expression === prevExprRef.current) return
    prevExprRef.current = expression
    setExprKey(expression)
    setPopping(true)
    const t = setTimeout(() => setPopping(false), 280)
    return () => clearTimeout(t)
  }, [expression])

  const expr    = expression || 'neutral'
  const mouth   = MOUTH[expr] || MOUTH.neutral
  const isSick  = expr === 'sick'
  const isCrit  = expr === 'critical'
  const isSweat = expr === 'stressed'

  const browType = { worried: 'worried', sad: 'sad', stressed: 'stressed', critical: 'critical' }[expr] || null

  const ch     = CHARACTER_LIST.find(c => c.id === avatar) || CHARACTER_LIST[0]
  const color  = ch.color

  const isBlue   = avatar === 'blue'
  const isOrange = avatar === 'orange'
  const isGreen  = avatar === 'green'
  const isAmber  = avatar === 'amber'
  const isPurple = avatar === 'purple'
  const isRed    = avatar === 'red'

  const eyeR   = isOrange ? 12 : isPurple ? 9 : isGreen ? 7 : 9
  const pupilR = eyeR * 0.52
  const eyeY   = isOrange ? 57 : isGreen ? 62 : isRed ? 58 : 52

  // Expression-based pupil nudge
  const exprNudgeY = (expr === 'worried' || expr === 'stressed') ? -2 : expr === 'sad' ? 3 : 0
  const finalOffset = { x: pupilOffset.x, y: pupilOffset.y + exprNudgeY }

  const w = size
  const h = size * 1.2

  return (
    <svg viewBox="0 0 100 120" width={w} height={h} style={{ overflow: 'visible' }}>
      <defs>
        {isCrit && (
          <radialGradient id={`crit-glow-${avatar}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(220,80,80,0.3)"/>
            <stop offset="100%" stopColor="rgba(220,80,80,0)"/>
          </radialGradient>
        )}
      </defs>

      {/* Critical red aura */}
      {isCrit && <ellipse cx="50" cy="64" rx="50" ry="56" fill={`url(#crit-glow-${avatar})`} className="char-crit-aura"/>}

      {/* ── Body ── */}
      {isBlue   && <rect    x="13"  y="18" width="74" height="92" rx="37"       fill={color}/>}
      {isOrange && <ellipse cx="50" cy="62" rx="44"  ry="42"                    fill={color}/>}
      {isGreen  && <circle  cx="50" cy="65" r="43"                              fill={color}/>}
      {isAmber  && <rect    x="16"  y="22" width="68" height="90" rx="28"       fill={color}/>}
      {isPurple && <ellipse cx="50" cy="60" rx="33"  ry="52"                    fill={color}/>}
      {/* 赤焰: angular base + flame spikes on top */}
      {isRed && <>
        <path d="M 18 110 Q 10 110 10 75 L 10 50 Q 10 30 50 26 Q 90 30 90 50 L 90 75 Q 90 110 82 110 Z" fill={color}/>
        {/* flame spikes */}
        <polygon points="30,30 36,10 42,30" fill={color}/>
        <polygon points="43,27 50,4  57,27" fill={color}/>
        <polygon points="58,30 64,10 70,30" fill={color}/>
        {/* flame highlights */}
        <polygon points="33,30 36,17 39,30" fill="rgba(255,220,80,0.45)"/>
        <polygon points="47,27 50,11 53,27" fill="rgba(255,220,80,0.45)"/>
        <polygon points="61,30 64,17 67,30" fill="rgba(255,220,80,0.45)"/>
      </>}

      {/* Body bottom shading */}
      {isBlue   && <ellipse cx="50" cy="97"  rx="28" ry="10" fill="rgba(0,0,0,0.1)"/>}
      {isOrange && <ellipse cx="50" cy="90"  rx="32" ry="12" fill="rgba(0,0,0,0.1)"/>}
      {isGreen  && <ellipse cx="50" cy="95"  rx="30" ry="13" fill="rgba(0,0,0,0.1)"/>}
      {isAmber  && <ellipse cx="50" cy="100" rx="26" ry="10" fill="rgba(0,0,0,0.1)"/>}
      {isPurple && <ellipse cx="50" cy="98"  rx="22" ry="10" fill="rgba(0,0,0,0.1)"/>}
      {isRed    && <ellipse cx="50" cy="100" rx="30" ry="10" fill="rgba(0,0,0,0.1)"/>}

      {/* ── Accessories ── */}

      {/* 绿萌: round ears */}
      {isGreen && <>
        <circle cx="21" cy="28" r="11" fill={color}/>
        <circle cx="79" cy="28" r="11" fill={color}/>
        <circle cx="21" cy="28" r="5.5" fill="rgba(255,255,255,0.22)"/>
        <circle cx="79" cy="28" r="5.5" fill="rgba(255,255,255,0.22)"/>
      </>}

      {/* 橙橙: blush cheeks */}
      {isOrange && <>
        <circle cx="15" cy="66" r="9" fill="rgba(255,100,50,0.28)"/>
        <circle cx="85" cy="66" r="9" fill="rgba(255,100,50,0.28)"/>
      </>}

      {/* 紫灵: star gem on forehead */}
      {isPurple && (
        <polygon
          points="50,3 52.5,10 60,10 54,15 56.5,22 50,17.5 43.5,22 46,15 40,10 47.5,10"
          fill="rgba(255,255,255,0.38)"
        />
      )}

      {/* 黄豆: $ hair curl */}
      {isAmber && (
        <text x="50" y="17" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.65)"
          fontWeight="bold" fontFamily="'Share Tech Mono', monospace">$</text>
      )}

      {/* 赤焰: always has fierce brows (drawn before expression brows) */}
      {isRed && browType === null && (
        <g stroke="rgba(0,0,0,0.5)" strokeWidth="2.8" strokeLinecap="round" fill="none">
          <path d="M 26 44 Q 33 40 40 43"/>
          <path d="M 60 43 Q 67 40 74 44"/>
        </g>
      )}

      {/* ── Face group: bounces on expression change ── */}
      <g style={{
        transform: popping ? 'scale(1.13)' : 'scale(1)',
        transformOrigin: '50px 60px',
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Eyebrows */}
        <Brows type={browType}/>

        {/* Eyes */}
        <Eye cx={35} cy={eyeY} er={eyeR} pr={pupilR} offset={finalOffset}
             blink={blink} sick={isSick} amber={isAmber} purple={isPurple}/>
        <Eye cx={65} cy={eyeY} er={eyeR} pr={pupilR} offset={finalOffset}
             blink={blink} sick={isSick} amber={isAmber} purple={isPurple}/>

        {/* 蓝芯: glasses overlay */}
        {isBlue && <>
          <circle cx="35" cy={eyeY} r={eyeR + 3.5} fill="none" stroke="rgba(8,20,48,0.42)" strokeWidth="2.4"/>
          <circle cx="65" cy={eyeY} r={eyeR + 3.5} fill="none" stroke="rgba(8,20,48,0.42)" strokeWidth="2.4"/>
          <line x1={35 + eyeR + 3.5} y1={eyeY} x2={65 - eyeR - 3.5} y2={eyeY}
                stroke="rgba(8,20,48,0.42)" strokeWidth="2.4"/>
          <line x1={35 - eyeR - 3.5} y1={eyeY} x2="7" y2={eyeY + 5}
                stroke="rgba(8,20,48,0.3)" strokeWidth="1.8"/>
          <line x1={65 + eyeR + 3.5} y1={eyeY} x2="93" y2={eyeY + 5}
                stroke="rgba(8,20,48,0.3)" strokeWidth="1.8"/>
        </>}

        {/* Mouth — key=exprKey causes re-mount → fresh pop-in animation */}
        <path
          key={exprKey}
          d={mouth}
          stroke="rgba(255,255,255,0.9)"
          fill="none"
          strokeWidth="2.6"
          strokeLinecap="round"
          className="char-mouth-animated"
        />
      </g>

      {/* Stressed: sweat drop */}
      {isSweat && (
        <g opacity="0.8">
          <path d="M 78 28 Q 82 20 86 28 Q 86 34 82 34 Q 78 34 78 28" fill="rgba(120,200,255,0.75)"/>
        </g>
      )}

      {/* Critical: ! exclamation */}
      {isCrit && (
        <text x="50" y="7" textAnchor="middle" fontSize="11" fill="#DC5050"
          fontWeight="bold" fontFamily="'Share Tech Mono', monospace"
          className="char-crit-mark">!</text>
      )}
    </svg>
  )
}

// ─── Mini avatar (for leaderboard, 28px) ───
export function MiniAvatar({ avatar = 'blue', size = 28 }) {
  const ch = CHARACTER_LIST.find(c => c.id === avatar) || CHARACTER_LIST[0]
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ borderRadius: '50%', flexShrink: 0 }}>
      <circle cx="50" cy="50" r="50" fill={ch.color}/>
      {/* simplified face */}
      <circle cx="37" cy="48" r="7" fill="white"/>
      <circle cx="63" cy="48" r="7" fill="white"/>
      <circle cx="37" cy="48" r="3.5" fill="#1a1a2e"/>
      <circle cx="63" cy="48" r="3.5" fill="#1a1a2e"/>
      <path d="M 36 62 Q 50 70 64 62" stroke="white" fill="none" strokeWidth="2.5" strokeLinecap="round"/>
      {/* 蓝芯 glasses hint */}
      {avatar === 'blue' && <>
        <circle cx="37" cy="48" r="10" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2"/>
        <circle cx="63" cy="48" r="10" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2"/>
        <line x1="47" y1="48" x2="53" y2="48" stroke="rgba(0,0,0,0.35)" strokeWidth="2"/>
      </>}
      {/* 赤焰 flame tips */}
      {avatar === 'red' && <>
        <polygon points="34,12 38,2 42,12"  fill="rgba(255,220,80,0.6)"/>
        <polygon points="46,10 50,0  54,10" fill="rgba(255,220,80,0.6)"/>
        <polygon points="58,12 62,2 66,12"  fill="rgba(255,220,80,0.6)"/>
      </>}
    </svg>
  )
}
