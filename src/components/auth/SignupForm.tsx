'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const users = JSON.parse(
        localStorage.getItem('habit-tracker-users') ?? '[]'
      );
      if (users.find((u: { email: string }) => u.email === email)) {
        setError('User already exists');
        return;
      }
      const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(
        'habit-tracker-users',
        JSON.stringify([...users, newUser])
      );
      localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({ userId: newUser.id, email: newUser.email })
      );
      router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p
          role="alert"
          className="text-sm p-3 rounded-lg"
          style={{ background: '#3b1212', color: 'var(--color-danger)' }}
        >
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label
          htmlFor="signup-email"
          className="text-sm font-medium"
          style={{ color: 'var(--color-muted)' }}
        >
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          data-testid="auth-signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl text-sm"
          style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="signup-password"
          className="text-sm font-medium"
          style={{ color: 'var(--color-muted)' }}
        >
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          data-testid="auth-signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full px-4 py-3 rounded-xl text-sm"
          style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        />
      </div>

      <button
        type="submit"
        data-testid="auth-signup-submit"
        className="w-full py-3 rounded-xl font-semibold text-sm mt-2 transition-opacity hover:opacity-90"
        style={{ background: 'var(--color-accent)', color: '#fff' }}
      >
        Create Account
      </button>
    </form>
  );
}