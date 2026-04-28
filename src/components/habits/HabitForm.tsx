'use client';

import { useState } from 'react';
import { Habit } from '@/src/types/habit';
import { validateHabitName } from '@/src/lib/validators';

interface HabitFormProps {
  initial?: Habit;
  onSave: (data: { name: string; description: string; frequency: 'daily' }) => void;
  onCancel: () => void;
}

export default function HabitForm({ initial, onSave, onCancel }: HabitFormProps) {
  const [name, setName]         = useState(initial?.name ?? '');
  const [description, setDesc]  = useState(initial?.description ?? '');
  const [frequency, setFreq]    = useState<'daily'>(initial?.frequency ?? 'daily');
  const [nameError, setNameError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateHabitName(name);
    if (!result.valid) {
      setNameError(result.error ?? '');
      return;
    }
    setNameError('');
    onSave({ name: result.value, description: description.trim(), frequency });
  };

  return (
    <form data-testid="habit-form" onSubmit={handleSubmit} className="flex flex-col gap-4">

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
          value={name}
          onChange={(e) => { setName(e.target.value); setNameError(''); }}
          placeholder="e.g. Drink Water"
          className="w-full px-4 py-3 rounded-xl text-sm"
          style={{
            background: 'var(--color-bg)',
            border: nameError ? '1px solid var(--color-danger)' : '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        />
        {nameError && (
          <p role="alert" className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>
            {nameError}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="habit-description"
          className="text-sm font-medium"
          style={{ color: 'var(--color-muted)' }}
        >
          Description
        </label>
        <input
          id="habit-description"
          type="text"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Optional"
          className="w-full px-4 py-3 rounded-xl text-sm"
          style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        />
      </div>

      {/* Frequency */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="habit-frequency"
          className="text-sm font-medium"
          style={{ color: 'var(--color-muted)' }}
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value={frequency}
          onChange={(e) => setFreq(e.target.value as 'daily')}
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
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          data-testid="habit-save-button"
          className="flex-1 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
          {initial ? 'Update' : 'Save Habit'}
        </button>
      </div>
    </form>
  );
}