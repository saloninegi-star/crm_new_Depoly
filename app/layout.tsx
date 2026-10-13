import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from './context/ThemeContext';

export const metadata: Metadata = {
  title: 'Kognos Rice Mill CRM',
  description: 'Autonomous ERP & Milling Core',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}