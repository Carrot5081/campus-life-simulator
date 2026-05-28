import { createContext, useContext, useState } from 'react'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [sessionId,  setSessionId]  = useState(null)
  const [roundNum,   setRoundNum]   = useState(1)
  const [status,     setStatus]     = useState({ academic: 50, money: 50, social: 50, health: 50 })
  const [gameResult, setGameResult] = useState(null)

  const resetGame = () => {
    setSessionId(null)
    setRoundNum(1)
    setStatus({ academic: 50, money: 50, social: 50, health: 50 })
    setGameResult(null)
  }

  return (
    <GameContext.Provider value={{
      sessionId, setSessionId,
      roundNum,  setRoundNum,
      status,    setStatus,
      gameResult, setGameResult,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
