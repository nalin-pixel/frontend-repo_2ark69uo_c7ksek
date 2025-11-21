import { useEffect, useRef, useState } from 'react'
import Hero from './components/Hero'
import Lobby from './components/Lobby'
import LudoBoard from './components/LudoBoard'
import VoiceChat from './components/VoiceChat'

function App() {
  const [session, setSession] = useState(null)
  const wsRef = useRef(null)
  const [events, setEvents] = useState([])

  function enterRoom({ roomCode, playerId }) {
    setSession({ roomCode, playerId })
    const ws = new WebSocket(`${import.meta.env.VITE_BACKEND_URL.replace('http', 'ws')}/ws/game/${roomCode}`)
    wsRef.current = ws
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        setEvents(prev => [msg, ...prev].slice(0, 20))
      } catch {}
    }
  }

  function sendGame(ev) {
    wsRef.current?.send(JSON.stringify({ ...ev, ts: Date.now() }))
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Hero />

      <main className="relative z-10 -mt-16 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          {!session ? (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-white mb-4">Jump into a match</h2>
              <p className="text-slate-300 mb-6">Create or join a room to start playing. Share the code with friends.</p>
              <Lobby onEnter={enterRoom} />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-semibold text-white">Room {session.roomCode}</h2>
                <VoiceChat roomCode={session.roomCode} />
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <LudoBoard roomCode={session.roomCode} playerId={session.playerId} onSendGame={sendGame} />
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-medium mb-3">Live feed</h3>
                <ul className="space-y-1 text-slate-300 text-sm max-h-48 overflow-auto">
                  {events.map((e, i) => (
                    <li key={i} className="font-mono">{JSON.stringify(e)}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
