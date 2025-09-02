'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

// Importy dla komponentu telefonu
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// --- Typy i Dane Statyczne ---

interface FormState {
  name: string;
  phone: string;
  email: string;
  postalCode: string;
  constructionType: string;
  installationDate: string;
  additionalInfo: string;
  consent: boolean;
}

const initialState: FormState = {
  name: '',
  phone: '',
  email: '',
  postalCode: '',
  constructionType: '',
  installationDate: '',
  additionalInfo: '',
  consent: false,
};

// Dane dla kafelków (Używamy poprawnych ścieżek /images/forms/)
const constructionTypes = [
  { id: 'home_extension', title: 'Home Extension', description: 'Najwyższy standard, płaski dach, różne kształty świetlików, pełna integracja z domem.', imgUrl: '/images/forms/home-extension-day.webp' },
  { id: 'classic_warm', title: 'Klasyczny ciepły', description: 'Interesujące, różne kształty dachu, eleganckie, ciepłe wykonanie, komfort przez cały rok.', imgUrl: '/images/forms/ogrod-klasyczny-day.webp' },
  { id: 'seasonal_winter', title: 'Sezonowy zimny', description: 'Ekonomiczne rozwiązanie, więcej miejsca latem i cieplejsze dni jesienią.', imgUrl: '/images/forms/ogrod-sezonowy-day.webp' },
  { id: 'pergola_bioclimatic', title: 'Pergola Bioclimatic', description: 'Ruchome lamele, nowoczesna ochrona tarasu. Możliwe ruchome szklane ściany.', imgUrl: '/images/forms/pergola-bioclimatic-day.webp' },
  { id: 'dont_know', title: 'Nie wiem, doradźcie mi', description: 'Nie musisz znać wszystkich rozwiązań – przygotujemy najlepszą opcję dla Twojego domu.', imgUrl: '/images/forms/help-me.webp' },
];

const fallbackImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/5/hANDAtrAqAAAAAElFTkSuQmCC";

// --- Komponenty Pomocnicze ---

// 1. Komponent Kafelka (Zoptymalizowany z nowym API next/image)
interface CardProps {
    data: typeof constructionTypes[0];
    isSelected: boolean;
    onClick: () => void;
}

const ConstructionCard: React.FC<CardProps> = React.memo(({ data, isSelected, onClick }) => {
    const [imgSrc, setImgSrc] = useState(data.imgUrl);

    return (
        <div
            className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
            onClick={onClick}
        >
            <div className={styles.cardImageWrapper}>
                <Image
                    src={imgSrc}
                    alt={data.title}
                    fill // Nowoczesne API zamiast layout="fill"
                    className={styles.cardImage} // CSS obsługuje object-fit: cover
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 200px"
                    placeholder="blur"
                    blurDataURL={fallbackImage}
                    onError={() => {
                        if (imgSrc !== fallbackImage) {
                            setImgSrc(fallbackImage);
                        }
                    }}
                />
            </div>
            <div className={styles.cardContent}>
                <h3>{data.title}</h3>
                <p>{data.description}</p>
            </div>
        </div>
    );
});
ConstructionCard.displayName = 'ConstructionCard';

// 2. File Uploader Placeholder (Wizualnie zgodny ze zrzutem)
const FileUploaderPlaceholder = () => {
    // W rzeczywistej implementacji użyj np. react-dropzone i zarządzaj stanem plików
    return (
        <div className={styles.fileUploaderArea}>
            <div className={styles.uploadIcon}>
                {/* Proste SVG ikony uploadu zgodne ze zrzutem */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5L12 15M12 5L8 9M12 5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 15V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <h3>Dodaj zdjęcia lub projekt</h3>
            <p>Upuść pliki tutaj lub wybierz je ze swojego dysku</p>
            {/* Użycie label zamiast button dla lepszej dostępności przy ukrytym input[type=file] */}
            <label htmlFor="file-upload-input" className={styles.browseButton}>
                Przeglądaj pliki
            </label>
            <input type="file" id="file-upload-input" multiple style={{ display: 'none' }} />
        </div>
    );
};


// --- Główny Komponent Formularza ---
export default function Home() {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
  }, []);

  // Używamy useCallback dla funkcji przekazywanej do React.memo
  const handleCardSelect = useCallback((id: string) => {
    setFormData(prev => ({ ...prev, constructionType: id }));
    // Czyszczenie błędu po wybraniu
    if (errors.constructionType) {
        setErrors(prev => ({ ...prev, constructionType: undefined }));
    }
  }, [errors.constructionType]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Walidacja
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!formData.name) newErrors.name = 'Imię jest wymagane.';
    if (!formData.email || !validateEmail(formData.email)) newErrors.email = 'Prawidłowy e-mail jest wymagany.';
    if (!formData.phone || formData.phone.length < 5) newErrors.phone = 'Numer telefonu jest wymagany.';
    if (!formData.constructionType) newErrors.constructionType = 'Wybór typu konstrukcji jest wymagany.';
    if (!formData.consent) newErrors.consent = 'Zgoda jest wymagana.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form Data Submitted:', formData);
      // Obsługa wysyłki (np. wywołanie API)
      alert('Wycena wysłana pomyślnie!');
    }
  };

  return (
    <main className={styles.main}>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <header className={styles.header}>
          <h1 className={styles.title}>Otrzymaj darmową wycenę</h1>
          <p className={styles.subtitle}>
            PODAJ KILKA PODSTAWOWYCH INFORMACJI – PRZYGOTUJEMY KALKULACJĘ I SKONTAKTUJEMY SIĘ W CIĄGU 24H
          </p>
        </header>

        {/* Siatka Pól Kontaktowych (2x2) */}
        <div className={styles.inputGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Imię *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Jan"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.errorInput : ''}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          {/* Komponent Telefonu z Naprawionym Pozycjonowaniem Flagi */}
          <div className={styles.formGroup}>
            <label htmlFor="phone">Twój numer telefonu *</label>
            <PhoneInput
                country={'pl'}
                value={formData.phone}
                onChange={handlePhoneChange}
                inputProps={{ name: 'phone', id: 'phone', required: true }}
                containerClass={styles.phoneContainer}
                // Klasy CSS Modules zawierające poprawki pozycjonowania
                inputClass={errors.phone ? `${styles.phoneInput} ${styles.errorInput}` : styles.phoneInput}
                buttonClass={styles.phoneButton} // Ta klasa naprawia "ucięty box"
              />
             {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Adres e-mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="jan.kowalski@example.com"
              value={formData.email}
              onChange={handleChange}
               className={errors.email ? styles.errorInput : ''}
            />
             {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="postalCode">Kod pocztowy</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              placeholder="00-000"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Sekcja Wyboru Konstrukcji */}
        <section className={styles.selectionSection}>
            <h2 className={styles.sectionTitle}>Jaki typ konstrukcji Cię interesuje? *</h2>
            <div className={styles.cardContainer}>
                {constructionTypes.map(type => (
                    <ConstructionCard
                        key={type.id}
                        data={type}
                        isSelected={formData.constructionType === type.id}
                        onClick={() => handleCardSelect(type.id)}
                    />
                ))}
            </div>
            {errors.constructionType && <div className={styles.errorTextCenter}>{errors.constructionType}</div>}
        </section>

        {/* Termin Montażu, Upload i Informacje */}
        <section className={styles.detailsSection}>
            {/* Termin Montażu */}
            <div className={styles.formGroupFull}>
                <label htmlFor="installationDate">Masz preferowany termin montażu?</label>
                <input
                    type="text" // Używamy typu text, aby wyświetlić placeholder "dd.mm.rrrr" jak na zrzucie
                    id="installationDate"
                    name="installationDate"
                    placeholder="dd.mm.rrrr"
                    value={formData.installationDate}
                    onChange={handleChange}
                    // Dodaj klasę, jeśli chcesz dodać ikonę kalendarza przez CSS (jak na zrzucie)
                    className={styles.dateInput}
                />
            </div>

            {/* Dodaj zdjęcia lub projekt */}
            <FileUploaderPlaceholder />

            {/* Dodatkowe informacje */}
            <div className={styles.formGroupFull}>
                <label htmlFor="additionalInfo">Dodatkowe informacje</label>
                <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    placeholder="Wymiary, kolor, specjalne wymagania..."
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    rows={4}
                />
            </div>
        </section>


        {/* Zgody i Przycisk Wysyłania */}
        <div className={styles.footerSection}>
            <div className={`${styles.formGroup} ${styles.consentGroup}`}>
                <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                />
                <label htmlFor="consent">
                    Wyrażam zgodę na kontakt w związku z obsługą niniejszego zgłoszenia. *
                </label>
            </div>
            {errors.consent && <div className={styles.errorTextCenter}>{errors.consent}</div>}

            <button type="submit" className={styles.submitButton}>Wyślij Wycenę</button>
        </div>

      </form>
    </main>
  );
}