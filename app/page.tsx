'use client';

import { useReducer, useState, useCallback, FocusEvent } from 'react';
import { Montserrat, Playfair_Display } from 'next/font/google';
import styles from './page.module.css';

import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { declineNameVocative } from '../lib/declension'; 
import { FormState, FileWithProgress, TileData, NotificationState } from '../lib/types';
import TypeSelector from '../components/TypeSelector';
import FileUploader from '../components/FileUploader';
import Notification from '../components/Notification';

const montserrat = Montserrat({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], display: 'swap' });
const playfair_Display = Playfair_Display({ subsets: ['latin', 'latin-ext'], weight: ['700'], display: 'swap' });

const GlobalStyles = ` body { --font-montserrat: ${montserrat.style.fontFamily}; --font-playfair-display: ${playfair_Display.style.fontFamily}; } `;

const tilesData: TileData[] = [
  { value: "home-extension", title: "Home Extension", desc: "Najwyższy standard, płaski dach, różne kształty świetlików, pełna integracja z domem", src: "/images/forms/home-extension-day.webp", alt: "Home Extension" },
  { value: "cieply", title: "Klasyczny ciepły", desc: "Interesujące, różne kształty dachu, eleganckie, ciepłe wykonanie, komfort przez cały rok", src: "/images/forms/ogrod-klasyczny-day.webp", alt: "Klasyczny ciepły" },
  { value: "zimny", title: "Sezonowy zimny", desc: "Ekonomiczne rozwiązanie, więcej miejsca latem i cieplejsze dni jesienią", src: "/images/forms/ogrod-sezonowy-day.webp", alt: "Sezonowy zimny" },
  { value: "pergola", title: "Pergola Bioclimatic", desc: "Ruchome lamele, nowoczesna ochrona tarasu. Możliwe ruchome szklane ściany", src: "/images/forms/pergola-bioclimatic-day.webp", alt: "Pergola Bioclimatic" },
  { value: "doradzcie", title: "Nie wiem, doradźcie mi", desc: "Nie musisz znać wszystkich rozwiązań – przygotujemy najlepszą opcję dla Twojego domu", src: "/images/forms/help-me.webp", alt: "Doradztwo" }
];

const initialFormState: FormState = {
  values: { name: '', email: '', phone: '', postal: '', date: '', selectedType: '', comment: '', consent: false },
  errors: {},
};

type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof FormState['values']; value: string | boolean }
  | { type: 'SET_ERRORS'; errors: FormState['errors'] }
  | { type: 'SET_FIELD_ERROR'; field: keyof FormState['values']; error?: string }
  | { type: 'RESET' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'UPDATE_FIELD': {
      const newValues = { ...state.values, [action.field]: action.value };
      const newErrors = { ...state.errors };
      if (newErrors[action.field as keyof FormState['values']]) {
        delete newErrors[action.field as keyof FormState['values']];
      }
      return { values: newValues, errors: newErrors };
    }
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SET_FIELD_ERROR': {
        const newErrors = { ...state.errors };
        if(action.error) { newErrors[action.field] = action.error; } 
        else { delete newErrors[action.field]; }
        return { ...state, errors: newErrors };
    }
    case 'RESET':
      return initialFormState;
    default:
      return state;
  }
}

export default function Home() {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([]);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const declinedName = declineNameVocative(formState.values.name.split(' ')[0]);

  const handleInputChange = useCallback((field: keyof FormState['values'], value: string | boolean) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  }, []);

  const validateField = (name: keyof FormState['values'], value: string) => {
    if (!value) return; 
    switch (name) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Nieprawidłowy format email';
        break;
      case 'phone':
        if (!isValidPhoneNumber(value)) return 'Nieprawidłowy numer telefonu';
        break;
      case 'postal':
        if (!/^\d{2}-\d{3}$/.test(value)) return 'Kod pocztowy powinien mieć format XX-XXX';
        break;
      default: break;
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof FormState['values']; value: string };
    const error = validateField(name, value);
    dispatch({ type: 'SET_FIELD_ERROR', field: name, error });
  };
  
  const handlePhoneBlur = () => {
    const error = validateField('phone', formState.values.phone);
    dispatch({ type: 'SET_FIELD_ERROR', field: 'phone', error });
  };
  
  const validateFormOnSubmit = useCallback(() => {
    const { values } = formState;
    const newErrors: FormState['errors'] = {};
    if (!values.name.trim()) newErrors.name = 'Imię jest wymagane';
    if (!values.email.trim()) newErrors.email = 'Email jest wymagany';
    if (!values.phone.trim()) newErrors.phone = 'Telefon jest wymagany';
    if (!values.selectedType) newErrors.selectedType = 'Wybierz typ konstrukcji';
    if (!values.consent) newErrors.consent = 'Zgoda jest wymagana';
    if (values.email && validateField('email', values.email)) newErrors.email = validateField('email', values.email);
    if (values.phone && validateField('phone', values.phone)) newErrors.phone = validateField('phone', values.phone);
    if (values.postal && validateField('postal', values.postal)) newErrors.postal = validateField('postal', values.postal);
    dispatch({ type: 'SET_ERRORS', errors: newErrors });
    return Object.keys(newErrors).length === 0;
  }, [formState.values]);
  
  const handleSubmit = async (event: React.FormEvent) => {
    if (submitStatus !== 'idle') return;
    event.preventDefault();
    if (!validateFormOnSubmit()) {
      // ZMIANA TUTAJ: Personalizacja komunikatu
      setNotification({ type: 'error', message: `${declinedName || 'Drogi użytkowniku'}, proszę, uzupełnij wymagane pola.` }); 
      return;
    }
    setNotification(null);
    setSubmitStatus('submitting');
    const submitData = new FormData();
    Object.entries(formState.values).forEach(([key, value]) => submitData.append(key, String(value)));
    selectedFiles.forEach(({ file }) => submitData.append('files', file));

    try {
      const response = await fetch('/api/submit', { method: 'POST', body: submitData });
      if (!response.ok) throw new Error('Błąd serwera');
      setNotification({ type: 'success', message: `Dziękujemy, ${declinedName || 'zgłoszenie'} zostało wysłane!` });
      setSubmitStatus('success');
      setTimeout(() => {
        dispatch({ type: 'RESET' });
        setSelectedFiles([]);
        setSubmitStatus('idle');
        setNotification(null);
      }, 4000);
    } catch (error) {
      console.error('Błąd wysyłania formularza:', error);
      setNotification({ type: 'error', message: 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie.' });
      setSubmitStatus('idle');
    }
  };

  return (
    <>
      <style jsx global>{GlobalStyles}</style>
      <div className={`${montserrat.className} ${styles.shell}`}>
        <Notification notification={notification} onClose={() => setNotification(null)} />
        <header>
          <h1 className={`${playfair_Display.className} ${styles.mainTitle}`}>Otrzymaj darmową wycenę</h1>
          <p className={styles.sub}>PODAJ KILKA PODSTAWOWYCH INFORMACJI – PRZYGOTUJEMY KALKULACJĘ I SKONTAKTUJEMY SIĘ W CIĄGU 24H</p>
        </header>
        <form id="verandana-form" onSubmit={handleSubmit} noValidate>
          <div className={`${styles.grid} ${styles.two}`}>
            <div>
              <label className={styles.hint} htmlFor="name">Imię *</label>
              <input id="name" name="name" type="text" placeholder="Jan" value={formState.values.name} onChange={(e) => handleInputChange('name', e.target.value)} />
              {formState.errors.name && <span className={styles.errorMessage}>{formState.errors.name}</span>}
            </div>
            <div>
              <label className={styles.hint} htmlFor="phone">{declinedName ? `${declinedName}, podaj` : 'Twój'} numer telefonu *</label>
              <div className={styles.phoneInputWrapper}>
                <PhoneInput id="phone" name="phone" className={styles.phoneInput} placeholder="Wpisz numer telefonu" value={formState.values.phone} onChange={(value) => handleInputChange('phone', value || '')} onBlur={handlePhoneBlur} defaultCountry="PL" international />
              </div>
              {formState.errors.phone && <span className={styles.errorMessage}>{formState.errors.phone}</span>}
            </div>
            <div>
              <label className={styles.hint} htmlFor="email">Adres e-mail *</label>
              <input id="email" name="email" type="email" placeholder="jan.kowalski@example.com" value={formState.values.email} onChange={(e) => handleInputChange('email', e.target.value)} onBlur={handleBlur} />
              {formState.errors.email && <span className={styles.errorMessage}>{formState.errors.email}</span>}
            </div>
            <div>
              <label className={styles.hint} htmlFor="postal">{declinedName ? 'Gdzie realizujemy projekt?' : 'Kod pocztowy'}</label>
              <input id="postal" name="postal" type="text" placeholder="00-000" value={formState.values.postal} onChange={(e) => handleInputChange('postal', e.target.value)} onBlur={handleBlur} />
              {formState.errors.postal && <span className={styles.errorMessage}>{formState.errors.postal}</span>}
            </div>
          </div>
          <TypeSelector tilesData={tilesData} selectedValue={formState.values.selectedType} onSelect={(value) => handleInputChange('selectedType', value)} error={formState.errors.selectedType} name={declinedName}/>
          <div style={{ marginTop: "40px" }}>
            <label className={styles.hint} htmlFor="date">{declinedName ? `${declinedName}, masz` : 'Masz'} preferowany termin montażu?</label>
            <input id="date" name="date" type="date" value={formState.values.date} onChange={(e) => handleInputChange('date', e.target.value)} min={new Date().toISOString().split('T')[0]} />
          </div>
          <FileUploader files={selectedFiles} setFiles={setSelectedFiles} onUploadError={(message) => setNotification({ type: 'error', message })} />
          <div style={{ marginTop: "20px" }}>
            <label className={styles.hint} htmlFor="comment">{declinedName ? 'Chcesz dodać coś jeszcze?' : 'Dodatkowe informacje'}</label>
            <textarea id="comment" name="comment" placeholder="Wymiary, kolor, specjalne wymagania..." value={formState.values.comment} onChange={(e) => handleInputChange('comment', e.target.value as string)} />
          </div>
          <label className={styles.consent}>
            <input id="consent" name="consent" type="checkbox" checked={formState.values.consent} onChange={(e) => handleInputChange('consent', e.target.checked)} />
            <span>Wyrażam zgodę na kontakt w związku z obsługą niniejszego zgłoszenia. *</span>
            {formState.errors.consent && <span className={styles.errorMessage} style={{marginLeft: '-28px', marginTop: '10px'}}>{formState.errors.consent}</span>}
          </label>
          <button className={`${styles.btn} ${submitStatus !== 'idle' ? styles[submitStatus] : ''}`} type="submit" disabled={submitStatus !== 'idle'}>
            {submitStatus === 'idle' && 'Wyślij Wycenę'}
            {submitStatus === 'submitting' && 'Wysyłanie...'}
            {submitStatus === 'success' && '✓ Wysłano!'}
          </button>
        </form>
      </div>
    </>
  );
}