'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/src/components/shared/SplashScreen';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const session = JSON.parse(
          localStorage.getItem('habit-tracker-session') ?? 'null'
        );
        router.replace(session?.userId ? '/dashboard' : '/login');
      } catch {
        router.replace('/login');
      }
    }, 1000); // within the 800ms–2000ms spec window

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}