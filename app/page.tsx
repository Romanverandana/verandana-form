'use client'

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Montserrat, Playfair_Display } from 'next/font/google';

// Konfiguracja fontów
const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  display: 'swap',
});

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postal: '',
    date: '',
    selectedType: '',
    comment: '',
    consent: false
  });
  
  const [selectedFiles, setSelectedFiles] = useState<Array<{id: number, file: File, progress: number}>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const tilesData = [
    { 
      value: "home-extension", 
      title: "Home Extension", 
      desc: "Najwyższy standard, płaski dach, różne kształty świetlików, pełna integracja z domem", 
      src: "/images/forms/home-extension-day.webp", 
      alt: "Home Extension" 
    },
    { 
      value: "cieply", 
      title: "Klasyczny ciepły", 
      desc: "Interesujące, różne kształty dachu, eleganckie, ciepłe wykonanie, komfort przez cały rok", 
      src: "/images/forms/ogrod-klasyczny-day.webp", 
      alt: "Klasyczny ciepły" 
    },
    { 
      value: "zimny", 
      title: "Sezonowy zimny", 
      desc: "Ekonomiczne rozwiązanie, więcej miejsca latem i cieplejsze dni jesienią", 
      src: "/images/forms/ogrod-sezonowy-day.webp", 
      alt: "Sezonowy zimny" 
    },
    { 
      value: "pergola", 
      title: "Pergola Bioclimatic", 
      desc: "Ruchome lamele, nowoczesna ochrona tarasu. Możliwe ruchome szklane ściany", 
      src: "/images/forms/pergola-bioclimatic-day.webp", 
      alt: "Pergola Bioclimatic" 
    },
    { 
      value: "doradzcie", 
      title: "Nie wiem, doradźcie mi", 
      desc: "Nie musisz znać wszystkich rozwiązań – przygotujemy najlepszą opcję dla Twojego domu", 
      src: "/images/forms/help-me.webp", 
      alt: "Doradztwo" 
    }
  ];

  const validateForm = useCallback(() => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'Imię jest wymagane';
    if (!formData.email.trim()) newErrors.email = 'Email jest wymagany';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Telefon jest wymagany';
    if (!formData.postal.trim()) newErrors.postal = 'Kod pocztowy jest wymagany';
    else if (!/^\d{2}-\d{3}$/.test(formData.postal)) {
      newErrors.postal = 'Kod pocztowy powinien mieć format XX-XXX';
    }
    if (!formData.consent) newErrors.consent = 'Zgoda jest wymagana';
    if (!formData.selectedType) newErrors.selectedType = 'Wybierz typ konstrukcji';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxFiles = 5;
    const maxFileSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic'];

    if (selectedFiles.length + files.length > maxFiles) {
      alert(`Możesz przesłać maksymalnie ${maxFiles} plików`);
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        alert(`Plik ${file.name} jest za duży (max 5MB)`);
        return false;
      }
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
        alert(`Plik ${file.name} ma nieprawidłowy format`);
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map(file => ({ 
      id: Date.now() + Math.random(), 
      file, 
      progress: 0 
    }));
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
    if (event.target) event.target.value = '';
  }, [selectedFiles]);

  const removeFile = useCallback((fileId: number) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const handleTileSelect = useCallback((value: string) => {
    handleInputChange('selectedType', value);
  }, [handleInputChange]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, String(value));
      });
      
      selectedFiles.forEach(({ file }) => {
        submitData.append('files', file);
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Formularz został wysłany pomyślnie!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        postal: '',
        date: '',
        selectedType: '',
        comment: '',
        consent: false
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error('Błąd:', error);
      alert('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${montserrat.className} shell`}>
      <style jsx>{`
        .shell {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          min-height: 100vh;
          font-size: 12px;
        }
        
        .main-title {
          font-size: 33px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 0.75rem;
          color: black;
        }
        
        .sub {
          font-size: 12px;
          font-weight: 400;
          line-height: 1.6;
          color: #6b7280;
          margin-bottom: 2rem;
        }
        
        .hint {
          font-size: 10px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
          display: block;
        }
        
        input, textarea, select {
          font-family: inherit;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.5;
          color: black;
          background-color: white;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          width: 100%;
          box-sizing: border-box;
        }
        
        input::placeholder, textarea::placeholder {
          color: #9ca3af;
          font-weight: 400;
        }
        
        button {
          font-family: inherit;
          font-size: 12px;
          font-weight: 500;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background-color: #3b82f6;
          color: white;
        }
        
        button:hover {
          background-color: #2563eb;
        }
        
        button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
        
        .section-title {
          font-size: 12px;
          font-weight: 600;
          margin: 20px 0 10px 0;
          color: black;
        }
        
        .tiles {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin: 20px 0;
        }
        
        .tile {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          background: white;
          transition: all 0.2s;
          color: black;
          cursor: pointer;
        }
        
        .tile:hover {
          border-color: #3b82f6;
        }
        
        .tile.selected {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }
        
        .tile .title {
          font-size: 12px;
          font-weight: 600;
          margin: 8px 0 4px 0;
          color: black;
        }
        
        .tile .desc {
          font-size: 12px;
          font-weight: 400;
          color: #6b7280;
        }
        
        .img-wrap {
          width: 100%;
          aspect-ratio: 1;
          position: relative;
          margin-bottom: 12px;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .grid.two {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin: 20px 0;
        }
        
        .uploader {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
          background-color: white;
        }
        
        .uploader p, .uploader small {
          font-size: 12px;
          font-weight: 400;
          margin: 4px 0;
          color: black;
        }
        
        .uploader strong {
          font-size: 12px;
          font-weight: 600;
          color: black;
        }
        
        .file-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          margin: 4px 0;
          background-color: white;
        }
        
        .file-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        
        .file-name {
          font-size: 12px;
          font-weight: 400;
          color: black;
        }
        
        .file-remove {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
        }
        
        .consent {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 20px 0;
        }
        
        .consent input {
          width: auto;
          margin: 0;
        }
        
        .consent span {
          font-size: 12px;
          font-weight: 400;
          color: black;
        }
        
        .error-message {
          font-size: 12px;
          font-weight: 400;
          color: #ef4444;
          display: block;
          margin-top: 4px;
        }
        
        .btn {
          font-size: 14px;
          font-weight: 600;
          padding: 16px 32px;
          background-color: #090123;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 20px;
          transition: all 0.3s ease;
          text-transform: none;
          letter-spacing: 0;
        }
        
        .btn:hover {
          background-color: #1a0f3a;
        }
        
        .btn:active {
          background-color: #000011;
        }
        
        .btn:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>

      <h1 className={`${playfairDisplay.className} main-title`}>
        Otrzymaj darmową wycenę
      </h1>
      <p className="sub">
        PODAJ KILKA PODSTAWOWYCH INFORMACJI – PRZYGOTUJEMY KALKULACJĘ I SKONTAKTUJEMY SIĘ W CIĄGU 24H
      </p>

      <form id="verandana-form" onSubmit={handleSubmit}>
        <div className="grid two">
          <div>
            <label className="hint" htmlFor="name">Imię *</label>
            <input 
              id="name" 
              type="text" 
              placeholder="Wpisz swoje imię" 
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required 
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div>
            <label className="hint" htmlFor="email">E-mail *</label>
            <input 
              id="email" 
              type="email" 
              placeholder="Wpisz swój e-mail" 
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required 
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div>
            <label className="hint" htmlFor="phone">Telefon *</label>
            <input 
              id="phone" 
              type="tel" 
              placeholder="Wpisz swój numer telefonu" 
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required 
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
          
          <div>
            <label className="hint" htmlFor="postal">Kod pocztowy *</label>
            <input 
              id="postal" 
              type="text" 
              placeholder="12-345" 
              value={formData.postal}
              onChange={(e) => handleInputChange('postal', e.target.value)}
              required 
            />
            {errors.postal && <span className="error-message">{errors.postal}</span>}
          </div>
        </div>

        <div style={{ marginTop: "12px" }}>
          <label className="hint" htmlFor="date">Preferowany termin rozpoczęcia montażu</label>
          <input 
            id="date" 
            type="date" 
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="section-title">Wybierz typ konstrukcji, który Cię interesuje *</div>
        {errors.selectedType && <span className="error-message">{errors.selectedType}</span>}
        <div className="tiles">
          {tilesData.map(tile => (
            <button
              key={tile.value}
              type="button"
              className={`tile ${formData.selectedType === tile.value ? "selected" : ""}`}
              onClick={() => handleTileSelect(tile.value)}
            >
              <div className="img-wrap">
                <Image 
                  src={tile.src} 
                  alt={tile.alt} 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="250px"
                />
              </div>
              <div className="title">{tile.title}</div>
              <div className="desc">{tile.desc}</div>
            </button>
          ))}
        </div>

        <div className="uploader">
          <p><strong>Prześlij zdjęcia (max 5 plików, do 5 MB każdy)</strong></p>
          <small>Przeciągnij i upuść lub przeglądaj, aby przesłać. Obsługiwane formaty: HEIC, JPEG, PNG</small>
          <div className="actions">
            <input 
              id="file" 
              type="file" 
              accept="image/jpeg,image/png,image/heic,.heic" 
              style={{ display: "none" }} 
              multiple 
              onChange={handleFileChange} 
            />
            <button 
              type="button" 
              className="browse" 
              onClick={() => document.getElementById('file')?.click()}
              disabled={selectedFiles.length >= 5}
            >
              {selectedFiles.length >= 5 ? 'Limit osiągnięty' : 'Przeglądaj'}
            </button>
          </div>
          <div className="files">
            {selectedFiles.map((fileObj) => (
              <div key={fileObj.id} className="file-row">
                <div className="file-top">
                  <div className="file-name" title={fileObj.file.name}>
                    {fileObj.file.name}
                  </div>
                  <button 
                    type="button" 
                    className="file-remove" 
                    onClick={() => removeFile(fileObj.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "12px" }}>
          <label className="hint" htmlFor="comment">Komentarz</label>
          <textarea 
            id="comment" 
            placeholder="Komentarz (opcjonalnie jednak dla nas pomocny) - jakiej wielkości planujesz ogród, jakie są istniejące warunki podłoża, czy jest taras, itd."
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            rows={4}
          />
        </div>

        <label className="consent">
          <input 
            id="consent" 
            type="checkbox" 
            checked={formData.consent}
            onChange={(e) => handleInputChange('consent', e.target.checked)}
            required 
          />
          <span>Wyrażam zgodę na kontakt telefoniczny w związku z obsługą niniejszego zgłoszenia. *</span>
        </label>
        {errors.consent && <span className="error-message">{errors.consent}</span>}

        <button 
          className="btn" 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Wysyłanie...' : 'Wyślij'}
        </button>
      </form>
    </div>
  );
}
