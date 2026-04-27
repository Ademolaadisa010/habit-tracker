'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const users = JSON.parse(localStorage.getItem('habit-tracker-users') ?? '[]');
      const user = users.find((u: { email: string; password: string }) => u.email === email && u.password === password);
      if (!user) {
        setError('Invalid email or password');
        return;
      }
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: user.id, email: user.email }));
      router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: 'var(--color-accent)' }}
          >
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
            Welcome back
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            Sign in to your habit tracker
          </p>
        </div>

        <div className="p-6 rounded-2xl" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <p role="alert" className="text-sm p-3 rounded-lg" style={{ background: '#3b1212', color: 'var(--color-danger)' }}>
                {error}
              </p>
            )}

            <div className="flex flex-col gap-1">
              <label htmlFor="login-email" className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                Email
              </label>
              <input
                id="login-email"
                type="email"
                data-testid="auth-login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="login-password" className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
                Password
              </label>
              <input
                id="login-password"
                type="password"
                data-testid="auth-login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>

            <button
              type="submit"
              data-testid="auth-login-submit"
              className="w-full py-3 rounded-xl font-semibold text-sm mt-2 transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-accent)', color: '#fff' }}
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-muted)' }}>
          No account?{' '}
          <Link href="/register" className="font-semibold" style={{ color: 'var(--color-accent-light)' }}>
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}