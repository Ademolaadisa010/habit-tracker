import SignupForm from '@/src/components/auth/SignupForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: 'var(--color-accent)' }}
          >
            ✦
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'Georgia, serif', color: 'var(--color-text)' }}
          >
            Start tracking
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            Create your free account
          </p>
        </div>

        {/* Form card */}
        <div
          className="p-6 rounded-2xl"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <SignupForm />
        </div>

        {/* Footer link */}
        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-muted)' }}>
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold"
            style={{ color: 'var(--color-accent-light)' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}