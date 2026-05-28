// ─── Primary death titles (8 death causes) ───
export const DEATH_TITLES = {
  academic_depleted: {
    zh: {
      title:  '学业崩盘型',
      emoji:  '🎓',
      flavor: '摆了一整个学期，终于被退学了。辅导员含泪说：当初你咋这么努力考进来的？',
    },
    en: {
      title:  'The Academic Dropout',
      emoji:  '🎓',
      flavor: "You vibed your way to expulsion. The dean asked, 'How did you even get in?'",
    },
  },
  academic_overloaded: {
    zh: {
      title:  '卷王熄火型',
      emoji:  '📚',
      flavor: '卷赢了所有人，却输给了自己。连教授都开始担心你了，牛牛。',
    },
    en: {
      title:  'The Burnout Genius',
      emoji:  '📚',
      flavor: "You out-grinded everyone, including yourself. Even the professor felt bad.",
    },
  },
  money_depleted: {
    zh: {
      title:  '一贫如洗型',
      emoji:  '💸',
      flavor: '钱包比天空还空旷。下次先别买那么多奶茶，好吗？',
    },
    en: {
      title:  'The Absolute Broke',
      emoji:  '💸',
      flavor: "Your wallet was emptier than your attendance record.",
    },
  },
  money_overloaded: {
    zh: {
      title:  '暴富失控型',
      emoji:  '💰',
      flavor: '钱多到不知道怎么花，直接原地精神崩溃。有钱也是一种原罪。',
    },
    en: {
      title:  'Lost in the Money',
      emoji:  '💰',
      flavor: "Too rich to function. A uniquely tragic problem.",
    },
  },
  social_depleted: {
    zh: {
      title:  '社恐晚期型',
      emoji:  '🫥',
      flavor: '连续多回合没有有效社交，你从人类社会中彻底蒸发了。',
    },
    en: {
      title:  'The Social Ghost',
      emoji:  '🫥',
      flavor: "You ghosted everyone so thoroughly you stopped existing.",
    },
  },
  social_overloaded: {
    zh: {
      title:  '累死的交际花',
      emoji:  '🎉',
      flavor: '每天都在接局、喝酒、social，精力耗尽，当场去世。下次少接几个局。',
    },
    en: {
      title:  'The Social Burnout',
      emoji:  '🎉',
      flavor: "You partied yourself into nonexistence. Legendary, honestly.",
    },
  },
  health_depleted: {
    zh: {
      title:  '累死的牛牛',
      emoji:  '🐂',
      flavor: '连续熬夜、不吃饭、高强度内卷，牛牛终究还是倒下了。好好休息吧。',
    },
    en: {
      title:  'The Overworked Bull',
      emoji:  '🐂',
      flavor: "Sleep is for the weak — and now so are you. RIP grind culture.",
    },
  },
  health_overloaded: {
    zh: {
      title:  '焦虑炸弹型',
      emoji:  '🤯',
      flavor: '每天思虑过重，神经系统当CPU用，高负荷运转直到过热宕机。',
    },
    en: {
      title:  'The Anxiety Bomb',
      emoji:  '🤯',
      flavor: "You stress-tested yourself to a hard shutdown. Please breathe.",
    },
  },
}

// ─── Secondary personality titles (based on play style) ───
export function getPersonalityTitle(avgs, rounds, lang) {
  const z = lang === 'zh'
  if (avgs.academic > 72 && avgs.health < 40)
    return z ? '🐂 卷王牺牲品' : '🐂 The Grind Martyr'
  if (avgs.academic > 70)
    return z ? '📖 刷题机器' : '📖 The Study Machine'
  if (avgs.social > 72)
    return z ? '🎤 校园社交达人' : '🎤 Campus Social Star'
  if (avgs.money < 28)
    return z ? '💰 月月光传人' : '💰 The Perpetually Broke'
  if (avgs.health < 30)
    return z ? '😴 作息混乱者' : '😴 The Night Owl'
  if (rounds >= 13)
    return z ? '🏅 学期老油条' : '🏅 The Semester Veteran'
  if (rounds <= 3)
    return z ? '⚡ 速通传奇' : '⚡ Speedrun Legend'
  if (avgs.money > 72)
    return z ? '💎 校园首富' : '💎 Campus Millionaire'
  return z ? '🎓 普通大学生' : '🎓 Average Student'
}

// ─── Fun analysis comments ───
export function getAnalysisComments(avgs, mins, maxs, rounds, lang) {
  const z = lang === 'zh'
  const lines = []

  if (mins.health < 18)
    lines.push(z ? `健康值一度跌到 ${mins.health}，你这是在拿命换分。` : `Health hit ${mins.health} at its lowest. You were literally running on fumes.`)
  if (avgs.academic > 75)
    lines.push(z ? '学业指数全程爆表，教授见了都要给你让路。' : 'Academic score stayed sky-high. Even the professor respected the grind.')
  if (mins.academic < 20)
    lines.push(z ? `学业一度跌到 ${mins.academic}，期末考试前你大概在打游戏。` : `Academic dropped to ${mins.academic}. You were clearly not studying.`)
  if (avgs.money < 28)
    lines.push(z ? '全程经济拮据，月月光是你的本命称号。' : 'Perpetually broke. Your wallet and your motivation both ran empty.')
  if (maxs.money > 82)
    lines.push(z ? `金钱最高达到 ${maxs.money}，你曾经是全宿舍最有钱的仔。` : `Money peaked at ${maxs.money}. You were briefly the richest person on campus.`)
  if (avgs.social > 72)
    lines.push(z ? '社交值全程居高，你大概是宿舍楼最受欢迎的人。' : 'Social was always high — you were the most popular person in the dorm.')
  if (mins.social < 15)
    lines.push(z ? `社交值触底 ${mins.social}，你有几回合大概直接消失在人间了。` : `Social hit ${mins.social}. You ghosted everyone for a few rounds.`)
  if (rounds >= 12)
    lines.push(z ? `坚持了 ${rounds} 回合，撑过了大多数玩家的极限，真老油条。` : `Survived ${rounds} rounds — way past most players' limits. Respect.`)
  if (rounds <= 3)
    lines.push(z ? '刚入学就翻车，创了个人最速离校记录。' : 'Crashed out immediately. Personal record for fastest departure.')
  if (mins.health > 40 && mins.money > 40 && mins.social > 40 && mins.academic > 40)
    lines.push(z ? '四条属性全程稳定，是个追求平衡的稳健型玩家。' : 'All four stats stayed balanced throughout. A true equilibrium player.')

  return lines.slice(0, 3)
}
