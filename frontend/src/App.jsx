import { Routes, Route, Navigate } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import Login       from './pages/Login'
import Game        from './pages/Game'
import GameOver    from './pages/GameOver'
import Leaderboard from './pages/Leaderboard'

function PrivateRoute({ children }) {
  return localStorage.getItem('player_id')
    ? children
    : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <GameProvider>
      <Routes>
        <Route path="/login"       element={<Login />} />
        <Route path="/game"        element={<PrivateRoute><Game /></PrivateRoute>} />
        <Route path="/gameover"    element={<PrivateRoute><GameOver /></PrivateRoute>} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*"            element={<Navigate to="/login" replace />} />
      </Routes>
    </GameProvider>
  )
}
