import { Habit } from '@/src/types/habit';
import HabitCard from './HabitCard';

interface HabitListProps {
  habits: Habit[];
  today: string;
  onUpdate: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onEdit: (habit: Habit) => void;
}

export default function HabitList({ habits, today, onUpdate, onDelete, onEdit }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div data-testid="empty-state" className="text-center py-16 px-4">
        <div className="text-4xl mb-4">✦</div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
          No habits yet
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Add your first habit to start building consistency.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          today={today}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}