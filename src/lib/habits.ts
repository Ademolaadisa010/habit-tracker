import { Habit } from '@/src/types/habit';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = habit.completions.filter((d) => d !== date);
  if (!habit.completions.includes(date)) {
    completions.push(date);
  }
  return { ...habit, completions: Array.from(new Set(completions)) };
}