import './globals.css';
import { Montserrat, Playfair_Display } from 'next/font/google';
import 'react-phone-input-2/lib/style.css';

// Konfiguracja Montserrat jako głównej czcionki
const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'], // Dodajemy 'latin-ext' dla polskich znaków
  weight: ['400', '500', '700', '800'], // Wagi, których używasz
  display: 'swap',
  variable: '--font-montserrat', // Opcjonalnie, jako fallback
});

// Konfiguracja Playfair Display dla nagłówków
const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['700', '800'], // Wagi dla nagłówków
  display: 'swap',
  variable: '--font-playfair-display', // Ważne: udostępniamy jako zmienną CSS
});

export const metadata = {
  title: 'Wycena',
  description: 'Formularz do darmowej wyceny',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      {/* Łączymy klasę głównej czcionki ze zmienną dla nagłówków */}
      <body className={`${montserrat.className} ${playfairDisplay.variable}`}>
        {children}
      </body>
    </html>
  );
}