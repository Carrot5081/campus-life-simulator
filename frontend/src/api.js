import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const register     = (username, email, password, avatar = 'blue') =>
  api.post('/auth/register', { username, email, password, avatar })
export const login        = (username, password) =>
  api.post('/auth/login', { username, password })
export const startGame    = (player_id) =>
  api.post('/game/start', { player_id })
export const getEvent     = (session_id, round_num) =>
  api.get('/game/event', { params: { session_id, round_num } })
export const submitChoice = (session_id, choice_id, event_id, round_num) =>
  api.post('/game/choice', { session_id, choice_id, event_id, round_num })
export const getHistory   = (session_id) =>
  api.get('/game/history', { params: { session_id } })
export const getAnalysis  = (session_id) =>
  api.get('/game/analysis', { params: { session_id } })
export const getGlobalStats = () => api.get('/leaderboard/global-stats')
export const getLeaderboard  = () => api.get('/leaderboard/')
export const getPlayerRank   = (player_id) => api.get(`/leaderboard/player/${player_id}`)
