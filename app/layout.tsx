import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your daily habits',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#7c6af7" />
      </head>
      <body>{children}</body>
    </html>
  );
}