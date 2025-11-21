import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/NkcnsJpx2b5y-eA7/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 h-full w-full flex items-center justify-center pointer-events-none">
        <div className="text-center max-w-3xl px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.5)]">3D Ludo with Live Voice</h1>
          <p className="mt-4 text-blue-100/90 text-lg md:text-xl">Create a room, invite friends, roll the dice in 3D, and talk in real time.</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
    </section>
  );
}
