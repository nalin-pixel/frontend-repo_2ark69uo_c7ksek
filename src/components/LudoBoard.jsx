import { useEffect, useMemo, useRef, useState } from 'react';

// Simplified 2D board rendering with CSS, animated tokens
function Token({ color, position }) {
  const colors = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-400',
  };
  return (
    <div className={`w-5 h-5 rounded-full ${colors[color]} shadow ring-2 ring-white transition-all duration-300`} style={{ transform: `translate(${position.x}px, ${position.y}px)` }} />
  );
}

export default function LudoBoard({ roomCode, playerId, onSendGame }) {
  // Basic 15x15 grid mapping for a Ludo-like path
  const gridSize = 15;
  const cell = 24; // px
  const [dice, setDice] = useState(1);
  const [pos, setPos] = useState({ R1: 0, G1: 0, B1: 0, Y1: 0 });

  const path = useMemo(() => {
    // Generate a simple loop path along the border of the board
    const steps = [];
    for (let x = 0; x < gridSize; x++) steps.push({ x, y: 0 });
    for (let y = 1; y < gridSize; y++) steps.push({ x: gridSize - 1, y });
    for (let x = gridSize - 2; x >= 0; x--) steps.push({ x, y: gridSize - 1 });
    for (let y = gridSize - 2; y > 0; y--) steps.push({ x: 0, y });
    return steps.map(p => ({ x: p.x * cell, y: p.y * cell }));
  }, []);

  function roll() {
    const d = 1 + Math.floor(Math.random() * 6);
    setDice(d);
  }

  function move(piece) {
    const next = { ...pos, [piece]: (pos[piece] + dice) % path.length };
    setPos(next);
    onSendGame?.({ type: 'move', piece, to: next[piece], dice });
  }

  const tokens = [
    { id: 'R1', color: 'red' },
    { id: 'G1', color: 'green' },
    { id: 'B1', color: 'blue' },
    { id: 'Y1', color: 'yellow' },
  ];

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="text-white/90">Room {roomCode} • You are {playerId}</div>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, ${cell}px)` }}>
        <div className="relative" style={{ width: gridSize * cell, height: gridSize * cell }}>
          {/* Board background */}
          <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${gridSize}, ${cell}px)`, gridTemplateRows: `repeat(${gridSize}, ${cell}px)` }}>
            {Array.from({ length: gridSize * gridSize }).map((_, i) => (
              <div key={i} className={`border border-slate-800/60 ${i % 2 === 0 ? 'bg-slate-800/40' : 'bg-slate-800/20'}`} style={{ width: cell, height: cell }} />
            ))}
          </div>
          {/* Path dots */}
          {path.map((p, i) => (
            <div key={i} className="absolute w-2 h-2 bg-white/70 rounded-full" style={{ left: p.x + cell/2 - 4, top: p.y + cell/2 - 4 }} />
          ))}

          {/* Tokens */}
          {tokens.map(t => (
            <div key={t.id} className="absolute transition-transform duration-500" style={{ left: path[pos[t.id]].x, top: path[pos[t.id]].y }}>
              <Token color={t.color} position={{ x: 0, y: 0 }} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white" onClick={roll}>Roll</button>
        <div className="text-white">Dice: {dice}</div>
        {tokens.map(t => (
          <button key={t.id} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white" onClick={() => move(t.id)}>
            Move {t.id}
          </button>
        ))}
      </div>
    </div>
  );
}
