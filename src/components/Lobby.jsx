import { useEffect, useRef, useState } from 'react';

export default function Lobby({ onEnter }) {
  const [room, setRoom] = useState(() => Math.random().toString(36).slice(2, 6).toUpperCase());
  const [player, setPlayer] = useState(() => Math.random().toString(36).slice(2, 8));

  const create = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/room/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: player, room_code: room })
    });
    onEnter({ roomCode: room, playerId: player });
  };

  const join = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/room/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: player, room_code: room })
    });
    onEnter({ roomCode: room, playerId: player });
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900/60 border border-slate-700 rounded-2xl p-6 backdrop-blur">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-300">Room Code</label>
          <input value={room} onChange={e=>setRoom(e.target.value.toUpperCase())} className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white" />
        </div>
        <div>
          <label className="text-sm text-slate-300">Player ID</label>
          <input value={player} onChange={e=>setPlayer(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button onClick={create} className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white">Create Room</button>
        <button onClick={join} className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white">Join Room</button>
      </div>
    </div>
  );
}
