'use client';

import { useState } from 'react';
import { Habit } from '@/src/types/habit';
import { getHabitSlug } from '@/src/lib/slug';
import { calculateCurrentStreak } from '@/src/lib/streaks';
import { toggleHabitCompletion } from '@/src/lib/habits';
import HabitForm from './HabitForm';

interface HabitCardProps {
  habit: Habit;
  today: string;
  onUpdate: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onEdit: (habit: Habit) => void;
}

export default function HabitCard({ habit, today, onUpdate, onDelete, onEdit }: HabitCardProps) {
  const slug   = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const done   = habit.completions.includes(today);

  const [editing, setEditing]           = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleToggle = () => {
    onUpdate(toggleHabitCompletion(habit, today));
  };

  const handleEditClick = () => {
    // Open inline edit form on the card
    setEditing(true);
    onEdit(habit);
  };

  const handleSave = (data: { name: string; description: string; frequency: 'daily' }) => {
    // preserve immutable fields
    onUpdate({ ...habit, name: data.name, description: data.description, frequency: data.frequency });
    setEditing(false);
  };

  // Inline edit mode
  if (editing) {
    return (
      <div
        data-testid={`habit-card-${slug}`}
        className="p-4 rounded-2xl"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-muted)' }}>
          Edit Habit
        </h3>
        <HabitForm
          initial={habit}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className="p-4 rounded-2xl transition-all"
      style={{
        background: done
          ? 'linear-gradient(135deg, #1a2e1a 0%, var(--color-surface) 100%)'
          : 'var(--color-surface)',
        border: done ? '1px solid #2d5a2d' : '1px solid var(--color-border)',
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">

        {/* Left: name, description, frequency, streak */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-base truncate"
            style={{ color: 'var(--color-text)' }}
          >
            {habit.name}
          </h3>

          {habit.description && (
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-muted)' }}>
              {habit.description}
            </p>
          )}

          <p className="text-xs mt-0.5 capitalize" style={{ color: 'var(--color-muted)' }}>
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
            onClick={handleToggle}
            aria-label={done ? `Unmark ${habit.name} as complete` : `Mark ${habit.name} as complete`}
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
            onClick={handleEditClick}
            aria-label={`Edit ${habit.name}`}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-opacity hover:opacity-80"
            style={{ background: 'var(--color-border)', color: 'var(--color-muted)' }}
          >
            ✎
          </button>

          {/* Delete */}
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => setConfirmDelete(true)}
            aria-label={`Delete ${habit.name}`}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-opacity hover:opacity-80"
            style={{ background: '#3b1212', color: 'var(--color-danger)' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div
          className="mt-4 p-3 rounded-xl"
          style={{ background: '#2a1010', border: '1px solid #5a2020' }}
        >
          <p className="text-sm mb-3" style={{ color: 'var(--color-text)' }}>
            Delete <strong>{habit.name}</strong>? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
              style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              Cancel
            </button>
            <button
              data-testid="confirm-delete-button"
              onClick={() => { onDelete(habit.id); setConfirmDelete(false); }}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-danger)', color: '#fff' }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}