'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem('habit-tracker-session') ?? 'null');
      if (session?.userId) {
        router.replace('/dashboard');
        return;
      }
    } catch {
      // continue to landing
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  // Redirect happens in a separate effect watching countdown
  useEffect(() => {
    if (countdown === 0) {
      router.push('/login');
    }
  }, [countdown, router]);

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
        className="text-base text-center max-w-xs mb-12"
        style={{ color: 'var(--color-muted)' }}
      >
        Build consistency one day at a time. Track your habits, watch your streaks grow.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {['Daily streaks', 'Progress tracking', 'Works offline'].map((label) => (
          <span
            key={label}
            className="text-xs font-semibold px-4 py-2 rounded-full"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-accent-light)',
            }}
          >
            {label}
          </span>
        ))}
      </div>

      <button
        onClick={() => router.push('/login')}
        className="w-full max-w-xs py-4 rounded-2xl font-semibold text-base mb-4 transition-opacity hover:opacity-90"
        style={{ background: 'var(--color-accent)', color: '#fff' }}
      >
        Get Started
      </button>

      <button
        onClick={() => router.push('/register')}
        className="w-full max-w-xs py-4 rounded-2xl font-semibold text-base transition-opacity hover:opacity-80"
        style={{
          background: 'transparent',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
        }}
      >
        Create Account
      </button>

      <p className="text-xs mt-8" style={{ color: 'var(--color-muted)' }}>
        Redirecting to login in{' '}
        <span style={{ color: 'var(--color-accent-light)' }}>
          {countdown > 0 ? `${countdown}s` : '…'}
        </span>
      </p>
    </main>
  );
}