import { useLanguage } from '../context/LanguageContext'
import './LanguageToggle.css'

export default function LanguageToggle() {
  const { lang, toggle, t } = useLanguage()
  return (
    <button className="lang-toggle" onClick={toggle} title="Switch language">
      <span className={lang === 'zh' ? 'active' : ''}>中</span>
      <span className="divider">|</span>
      <span className={lang === 'en' ? 'active' : ''}>EN</span>
    </button>
  )
}
