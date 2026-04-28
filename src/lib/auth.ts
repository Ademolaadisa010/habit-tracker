import { User, Session } from '@/src/types/auth';
import { getUsers, saveUsers, saveSession, clearSession, getSession } from '@/src/lib/storage';

export function signUp(email: string, password: string): { success: boolean; error?: string; session?: Session } {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return { success: false, error: 'User already exists' };
  }
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, newUser]);
  const session: Session = { userId: newUser.id, email: newUser.email };
  saveSession(session);
  return { success: true, session };
}

export function logIn(email: string, password: string): { success: boolean; error?: string; session?: Session } {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }
  const session: Session = { userId: user.id, email: user.email };
  saveSession(session);
  return { success: true, session };
}

export function logOut(): void {
  clearSession();
}

export { getSession };