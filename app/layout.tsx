import './globals.css';
import 'react-phone-number-input/style.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formularz Wyceny',
  description: 'Wypełnij formularz, aby otrzymać darmową wycenę.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}