// ================================================ //
//   PEŁNA ZAWARTOŚĆ PLIKU /lib/declension.ts       //
//        NOWY, POTĘŻNIEJSZY SILNIK ODMIANY         //
// ================================================ //

/**
 * Odmienia imię do wołacza (Vocative case).
 * Ta funkcja jest uproszczona i pokrywa najczęstsze przypadki.
 * @param name Imię do odmienienia
 * @returns Odmienione imię lub oryginalne, jeśli reguła nie pasuje.
 */
export const declineNameVocative = (name: string): string => {
  if (typeof name !== 'string' || !name) return '';

  const capitalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const lastLetter = capitalized.slice(-1);

  // Reguła 1: Imiona żeńskie i niektóre męskie na -a -> -o
  // Przykład: Anna -> Anno, Kuba -> Kubo
  if (lastLetter === 'a') {
    return capitalized.slice(0, -1) + 'o';
  }

  // Reguła 2: Imiona męskie zakończone na -ek, -ec -> -ku, -cu
  // Przykład: Tomek -> Tomku, Marek -> Marku
  if (capitalized.endsWith('ek') || capitalized.endsWith('ec')) {
    return capitalized.slice(0, -2) + 'u';
  }
  
  // Reguła 3: Imiona zakończone na twardą spółgłoskę (k, g) -> -u
  // Przykład: Jacek -> Jacku (choć -ek jest ważniejsze), Lech -> Lechu
  if (['k', 'g', 'h'].includes(lastLetter)) {
    return capitalized + 'u';
  }
  
  // Reguła 4: Imiona zakończone na historycznie miękką lub stwardniałą spółgłoskę -> -u
  // Przykład: Juliusz -> Juliuszu, Łukasz -> Łukaszu
  if (['c', 'cz', 'dz', 'dż', 'l', 'ł', 'ń', 'rz', 'sz', 'ś', 'z', 'ż', 'ź', 'j'].includes(lastLetter)) {
    return capitalized + 'u';
  }
  
  // Reguła 5 (domyślna dla większości spółgłosek): -> -ie
  // Przykład: Roman -> Romanie, Adam -> Adamie
  if (['b', 'd', 'f', 'm', 'n', 'p', 'r', 's', 't', 'w'].includes(lastLetter)) {
    return capitalized + 'ie';
  }

  // Jeśli żadna reguła nie pasuje, zwróć oryginalne imię
  return capitalized;
};