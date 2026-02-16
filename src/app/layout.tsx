import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Authenticity In Ai Content Creation',
  description: 'Product derived from radar signal: Authenticity in AI Content Creation. Source: agent.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
