export default function SplashScreen() {
  return (
    <main
      data-testid="splash-screen"
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--color-bg)' }}
    >
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-8"
        style={{ background: 'var(--color-accent)' }}
      >
        ✦
      </div>
      <h1
        className="text-4xl font-bold tracking-tight text-center mb-3"
        style={{ fontFamily: 'Georgia, serif', color: 'var(--color-text)' }}
      >
        Habit Tracker
      </h1>
      <p
        className="text-base text-center max-w-xs"
        style={{ color: 'var(--color-muted)' }}
      >
        Build consistency one day at a time.
      </p>
    </main>
  );
}