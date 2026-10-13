import './globals.css'; // <-- Yeh line honi zaroori hai!
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kognos Rice Mill CRM',
  description: 'Enterprise ERP & Milling CRM',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}