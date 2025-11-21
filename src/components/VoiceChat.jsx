import { useEffect, useRef, useState } from 'react';

export default function VoiceChat({ roomCode }) {
  const [enabled, setEnabled] = useState(false);
  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const destRef = useRef(null);

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  async function toggle() {
    if (!enabled) {
      // Start
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const ws = new WebSocket(`${import.meta.env.VITE_BACKEND_URL.replace('http', 'ws')}/ws/voice/${roomCode}`);
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;

      // Play incoming data
      ws.addEventListener('message', async (e) => {
        if (typeof e.data !== 'string') {
          const arrayBuf = await e.data.arrayBuffer();
          try {
            const audioBuf = await audioCtx.decodeAudioData(arrayBuf);
            const src = audioCtx.createBufferSource();
            src.buffer = audioBuf;
            src.connect(audioCtx.destination);
            src.start();
          } catch {}
        }
      });

      // Send raw chunks periodically
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      recorder.ondataavailable = async (ev) => {
        if (ws.readyState === 1) ws.send(await ev.data.arrayBuffer());
      };
      recorder.start(250);
      setEnabled(true);
    } else {
      // Stop
      if (wsRef.current) wsRef.current.close();
      if (audioCtxRef.current) audioCtxRef.current.close();
      wsRef.current = null;
      audioCtxRef.current = null;
      setEnabled(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button className={`px-4 py-2 rounded-lg ${enabled ? 'bg-rose-500' : 'bg-emerald-500'} text-white`} onClick={toggle}>
        {enabled ? 'Leave Voice' : 'Join Voice'}
      </button>
      <span className="text-white/80 text-sm">Real-time voice is experimental and may vary by browser.</span>
    </div>
  );
}
