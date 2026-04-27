'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// ── Types ──────────────────────────────────────────────────────────────────
type Session = { userId: string; email: string };
type Habit = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily';
  createdAt: string;
  completions: string[];
};

// ── Utilities ──────────────────────────────────────────────────────────────
function getSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function calcStreak(completions: string[], today: string): number {
  const unique = Array.from(new Set(completions));
  if (!unique.includes(today)) return 0;
  const sorted = unique.slice().sort((a, b) => (a > b ? -1 : 1));
  let streak = 0;
  let cur = today;
  for (const d of sorted) {
    if (d === cur) {
      streak++;
      const dt = new Date(cur + 'T00:00:00Z');
      dt.setUTCDate(dt.getUTCDate() - 1);
      cur = dt.toISOString().slice(0, 10);
    } else if (d < cur) {
      break;
    }
  }
  return streak;
}

function validateName(name: string): string | null {
  const t = name.trim();
  if (!t) return 'Habit name is required';
  if (t.length > 60) return 'Habit name must be 60 characters or fewer';
  return null;
}

function loadSession(): Session | null {
  try {
    return JSON.parse(localStorage.getItem('habit-tracker-session') ?? 'null');
  } catch {
    return null;
  }
}

function loadAllHabits(): Habit[] {
  try {
    return JSON.parse(localStorage.getItem('habit-tracker-habits') ?? '[]');
  } catch {
    return [];
  }
}

function saveAllHabits(habits: Habit[]) {
  localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();

  const [session, setSession]               = useState<Session | null>(null);
  const [habits, setHabits]                 = useState<Habit[]>([]);
  const [ready, setReady]                   = useState(false);
  const [showForm, setShowForm]             = useState(false);
  const [editingId, setEditingId]           = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // controlled form fields
  const [formName, setFormName]       = useState('');
  const [formDesc, setFormDesc]       = useState('');
  const [formFreq, setFormFreq]       = useState<'daily'>('daily');
  const [formError, setFormError]     = useState('');

  const today = new Date().toISOString().slice(0, 10);

  // ── Auth guard ─────────────────────────────────────────────────────────
  useEffect(() => {
    const s = loadSession();
    if (!s) {
      router.replace('/login');
      return;
    }
    setSession(s);
    setHabits(loadAllHabits().filter((h) => h.userId === s.userId));
    setReady(true);
  }, [router]);

  // ── Sync helpers ───────────────────────────────────────────────────────
  const syncHabits = (updated: Habit[]) => {
    setHabits(updated);
    const others = loadAllHabits().filter((h) => h.userId !== session!.userId);
    saveAllHabits([...others, ...updated]);
  };

  // ── Form helpers ───────────────────────────────────────────────────────
  const openCreate = () => {
    setFormName('');
    setFormDesc('');
    setFormFreq('daily');
    setFormError('');
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (habit: Habit) => {
    setFormName(habit.name);
    setFormDesc(habit.description);
    setFormFreq(habit.frequency);
    setFormError('');
    setEditingId(habit.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormName('');
    setFormDesc('');
    setFormFreq('daily');
    setFormError('');
  };

  const handleSave = () => {
    const err = validateName(formName);
    if (err) {
      setFormError(err);
      return;
    }
    const name        = formName.trim();
    const description = formDesc.trim();
    const frequency   = formFreq;

    if (editingId) {
      // Edit — preserve id, userId, createdAt, completions
      syncHabits(
        habits.map((h) =>
          h.id === editingId ? { ...h, name, description, frequency } : h
        )
      );
    } else {
      // Create
      const habit: Habit = {
        id: crypto.randomUUID(),
        userId: session!.userId,
        name,
        description,
        frequency,
        createdAt: new Date().toISOString(),
        completions: [],
      };
      syncHabits([...habits, habit]);
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    syncHabits(habits.filter((h) => h.id !== id));
    setConfirmDeleteId(null);
  };

  const handleToggle = (habit: Habit) => {
    const completions = habit.completions.includes(today)
      ? habit.completions.filter((d) => d !== today)
      : Array.from(new Set([...habit.completions, today]));
    syncHabits(habits.map((h) => (h.id === habit.id ? { ...h, completions } : h)));
  };

  const handleLogout = () => {
    localStorage.setItem('habit-tracker-session', 'null');
    router.push('/login');
  };

  if (!ready) return null;

  return (
    <main data-testid="dashboard-page" className="min-h-screen px-4 py-6 max-w-lg mx-auto">

      {/* ── Header ── */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: 'Georgia, serif', color: 'var(--color-text)' }}
          >
            Habit Tracker
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
            {session?.email}
          </p>
        </div>
        <button
          data-testid="auth-logout-button"
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-muted)',
          }}
        >
          Log out
        </button>
      </header>

      {/* ── Date badge ── */}
      <div className="mb-6">
        <span
          className="text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            background: 'var(--color-surface)',
            color: 'var(--color-accent-light)',
            border: '1px solid var(--color-border)',
          }}
        >
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* ── Create / Edit form ── */}
      {showForm ? (
        <div
          className="mb-6 p-5 rounded-2xl"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2
            className="text-sm font-semibold mb-4"
            style={{ color: 'var(--color-muted)' }}
          >
            {editingId ? 'Edit Habit' : 'New Habit'}
          </h2>

          <div data-testid="habit-form" className="flex flex-col gap-4">
            {/* Validation error */}
            {formError && (
              <p
                role="alert"
                className="text-xs p-3 rounded-lg"
                style={{ background: '#3b1212', color: 'var(--color-danger)' }}
              >
                {formError}
              </p>
            )}

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="habit-name"
                className="text-sm font-medium"
                style={{ color: 'var(--color-muted)' }}
              >
                Habit Name <span aria-hidden="true">*</span>
              </label>
              <input
                id="habit-name"
                type="text"
                data-testid="habit-name-input"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  setFormError('');
                }}
                placeholder="e.g. Drink Water"
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  background: 'var(--color-bg)',
                  border: formError
                    ? '1px solid var(--color-danger)'
                    : '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="habit-desc"
                className="text-sm font-medium"
                style={{ color: 'var(--color-muted)' }}
              >
                Description
              </label>
              <input
                id="habit-desc"
                type="text"
                data-testid="habit-description-input"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Optional"
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            {/* Frequency — controlled select */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="habit-freq"
                className="text-sm font-medium"
                style={{ color: 'var(--color-muted)' }}
              >
                Frequency
              </label>
              <select
                id="habit-freq"
                data-testid="habit-frequency-select"
                value={formFreq}
                onChange={(e) => setFormFreq(e.target.value as 'daily')}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="daily">Daily</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-1">
              <button
                type="button"
                onClick={closeForm}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
                style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                data-testid="habit-save-button"
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-accent)', color: '#fff' }}
              >
                {editingId ? 'Update' : 'Save Habit'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Create button ── */
        <button
          data-testid="create-habit-button"
          onClick={openCreate}
          className="w-full py-3 rounded-2xl text-sm font-semibold mb-6 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
          + New Habit
        </button>
      )}

      {/* ── Empty state ── */}
      {habits.length === 0 && !showForm ? (
        <div data-testid="empty-state" className="text-center py-16 px-4">
          <div className="text-4xl mb-4">✦</div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            No habits yet
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            Add your first habit to start building consistency.
          </p>
        </div>
      ) : (
        /* ── Habit list ── */
        <div className="flex flex-col gap-3">
          {habits.map((habit) => {
            const slug   = getSlug(habit.name);
            const streak = calcStreak(habit.completions, today);
            const done   = habit.completions.includes(today);

            return (
              <div
                key={habit.id}
                data-testid={`habit-card-${slug}`}
                className="p-4 rounded-2xl transition-all"
                style={{
                  background: done
                    ? 'linear-gradient(135deg, #1a2e1a 0%, var(--color-surface) 100%)'
                    : 'var(--color-surface)',
                  border: done ? '1px solid #2d5a2d' : '1px solid var(--color-border)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: name + description + streak */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-base truncate"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {habit.name}
                    </h3>
                    {habit.description && (
                      <p
                        className="text-xs mt-0.5 truncate"
                        style={{ color: 'var(--color-muted)' }}
                      >
                        {habit.description}
                      </p>
                    )}
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {habit.frequency}
                    </p>
                    <span
                      data-testid={`habit-streak-${slug}`}
                      className="inline-block text-xs font-semibold mt-2"
                      style={{ color: streak > 0 ? 'var(--color-success)' : 'var(--color-muted)' }}
                    >
                      🔥 {streak} day streak
                    </span>
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Complete toggle */}
                    <button
                      data-testid={`habit-complete-${slug}`}
                      onClick={() => handleToggle(habit)}
                      aria-label={done ? `Unmark ${habit.name}` : `Mark ${habit.name} complete`}
                      aria-pressed={done}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110"
                      style={{
                        background: done ? 'var(--color-success)' : 'var(--color-border)',
                        color: done ? '#0f2010' : 'var(--color-muted)',
                      }}
                    >
                      {done ? '✓' : '○'}
                    </button>

                    {/* Edit */}
                    <button
                      data-testid={`habit-edit-${slug}`}
                      onClick={() => openEdit(habit)}
                      aria-label={`Edit ${habit.name}`}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-opacity hover:opacity-80"
                      style={{ background: 'var(--color-border)', color: 'var(--color-muted)' }}
                    >
                      ✎
                    </button>

                    {/* Delete */}
                    <button
                      data-testid={`habit-delete-${slug}`}
                      onClick={() => setConfirmDeleteId(habit.id)}
                      aria-label={`Delete ${habit.name}`}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-opacity hover:opacity-80"
                      style={{ background: '#3b1212', color: 'var(--color-danger)' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Delete confirmation */}
                {confirmDeleteId === habit.id && (
                  <div
                    className="mt-4 p-3 rounded-xl"
                    style={{ background: '#2a1010', border: '1px solid #5a2020' }}
                  >
                    <p className="text-sm mb-3" style={{ color: 'var(--color-text)' }}>
                      Delete <strong>{habit.name}</strong>? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="flex-1 py-2 rounded-lg text-xs font-medium"
                        style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}
                      >
                        Cancel
                      </button>
                      <button
                        data-testid="confirm-delete-button"
                        onClick={() => handleDelete(habit.id)}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold"
                        style={{ background: 'var(--color-danger)', color: '#fff' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}