import './globals.css';
import '@fontsource-variable/inter';
import type { Metadata } from 'next';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext'; 

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
        <ThemeProvider>
          <LanguageProvider> 
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}