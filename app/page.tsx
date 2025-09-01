'use client'

import { useReducer, useState, useCallback } from 'react';
import { Montserrat, Playfair_Display } from 'next/font/google';
import styles from './page.module.css';

import { FormState, FileWithProgress, TileData, NotificationState } from '@/lib/types';
import TypeSelector from '@/components/TypeSelector';
import FileUploader from '@/components/FileUploader';
import Notification from '@/components/Notification';

// --- CONFIGURATION ---
const montserrat = Montserrat({ subsets: ['latin', 'latin-ext'], weight: ['300', '400', '500', '600', '700'], display: 'swap' });
const playfairDisplay = Playfair_Display({ subsets: ['latin', 'latin-ext'], weight: ['400', '700'], display: 'swap' });

const tilesData: TileData[] = [
    { value: "home-extension", title: "Home Extension", desc: "Najwyższy standard, płaski dach, różne kształty świetlików.", src: "/images/forms/home-extension-day.webp", alt: "Home Extension" },
    { value: "cieply", title: "Klasyczny ciepły", desc: "Różne kształty dachu, eleganckie wykonanie, komfort przez cały rok.", src: "/images/forms/ogrod-klasyczny-day.webp", alt: "Klasyczny ciepły" },
    { value: "zimny", title: "Sezonowy zimny", desc: "Ekonomiczne rozwiązanie na cieplejsze dni.", src: "/images/forms/ogrod-sezonowy-day.webp", alt: "Sezonowy zimny" },
    { value: "pergola", title: "Pergola Bioclimatic", desc: "Ruchome lamele, nowoczesna ochrona tarasu.", src: "/images/forms/pergola-bioclimatic-day.webp", alt: "Pergola Bioclimatic" },
    { value: "doradzcie", title: "Nie wiem, doradźcie mi", desc: "Przygotujemy najlepszą opcję dla Twojego domu.", src: "/images/forms/help-me.webp", alt: "Doradztwo" }
];

const initialFormState: FormState = {
  values: { name: '', email: '', phone: '', postal: '', date: '', selectedType: '', comment: '', consent: false },
  errors: {},
};

// --- REDUCER ---
type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof FormState['values']; value: string | boolean }
  | { type: 'SET_ERRORS'; errors: FormState['errors'] }
  | { type: 'RESET' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'RESET':
      return initialFormState;
    default:
      return state;
  }
}

// --- MAIN COMPONENT ---
export default function Home() {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const handleInputChange = useCallback((field: keyof FormState['values'], value: string | boolean) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  }, []);

  const validateForm = useCallback(() => {
    const { values } = formState;
    const newErrors: FormState['errors'] = {};
    if (!values.name.trim()) newErrors.name = 'Imię jest wymagane';
    if (!values.email.trim()) newErrors.email = 'Email jest wymagany';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) newErrors.email = 'Nieprawidłowy format email';
    if (!values.phone.trim()) newErrors.phone = 'Telefon jest wymagany';
    if (!values.postal.trim()) newErrors.postal = 'Kod pocztowy jest wymagany';
    else if (!/^\d{2}-\d{3}$/.test(values.postal)) newErrors.postal = 'Kod pocztowy powinien mieć format XX-XXX';
    if (!values.consent) newErrors.consent = 'Zgoda jest wymagana';
    if (!values.selectedType) newErrors.selectedType = 'Wybierz typ konstrukcji';
    
    dispatch({ type: 'SET_ERRORS', errors: newErrors });
    return Object.keys(newErrors).length === 0;
  }, [formState.values]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotification(null);
    if (!validateForm()) {
      setNotification({ type: 'error', message: 'Proszę wypełnić wszystkie wymagane pola.' });
      return;
    }

    setIsSubmitting(true);
    const submitData = new FormData();
    Object.entries(formState.values).forEach(([key, value]) => {
      submitData.append(key, String(value));
    });
    selectedFiles.forEach(({ file }) => {
      submitData.append('files', file);
    });

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) throw new Error('Błąd serwera');
      
      setNotification({ type: 'success', message: 'Formularz został wysłany! Skontaktujemy się wkrótce.' });
      dispatch({ type: 'RESET' });
      setSelectedFiles([]);

    } catch (error) {
      console.error('Błąd wysyłania formularza:', error);
      setNotification({ type: 'error', message: 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${montserrat.className} ${styles.shell}`}>
        <Notification notification={notification} onClose={() => setNotification(null)} />
        <h1 className={`${playfairDisplay.className} ${styles.mainTitle}`}>Otrzymaj darmową wycenę</h1>
        <p className={styles.sub}>PODAJ KILKA PODSTAWOWYCH INFORMACJI – PRZYGOTUJEMY KALKULACJĘ I SKONTAKTUJEMY SIĘ W CIĄGU 24H</p>

        <form id="verandana-form" onSubmit={handleSubmit} noValidate>
            <div className={`${styles.grid} ${styles.two}`}>
                <div>
                    <label className={styles.hint} htmlFor="name">Imię *</label>
                    <input id="name" type="text" placeholder="Wpisz swoje imię" value={formState.values.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
                    {formState.errors.name && <span className={styles.errorMessage}>{formState.errors.name}</span>}
                </div>
                {/* ... Pozostałe pola input analogicznie (email, phone, postal) ... */}
            </div>

            <TypeSelector
                tilesData={tilesData}
                selectedValue={formState.values.selectedType}
                onSelect={(value) => handleInputChange('selectedType', value)}
                error={formState.errors.selectedType}
            />

            <FileUploader
                files={selectedFiles}
                setFiles={setSelectedFiles}
                onUploadError={(message) => setNotification({ type: 'error', message })}
            />
            
            {/* ... Pole textarea (komentarz) ... */}

            <label className={styles.consent}>
                <input id="consent" type="checkbox" checked={formState.values.consent} onChange={(e) => handleInputChange('consent', e.target.checked)} required />
                <span>Wyrażam zgodę na kontakt telefoniczny w związku z obsługą niniejszego zgłoszenia. *</span>
            </label>
            {formState.errors.consent && <span className={styles.errorMessage}>{formState.errors.consent}</span>}

            <button className={styles.btn} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Wysyłanie...' : 'Wyślij'}
            </button>
        </form>
    </div>
  );
}
