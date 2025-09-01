'use client'

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Montserrat, Playfair_Display } from 'next/font/google';

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
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px;
          background-color: white;
          min-height: 100vh;
          font-size: 11px;
          overflow-x: hidden;
        }
        
        .main-title {
          font-size: 33px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 16px;
          color: black;
          text-align: center;
        }
        
        .sub {
          font-size: 11px;
          font-weight: 400;
          line-height: 1.6;
          color: #6b7280;
          margin-bottom: 40px;
          text-align: center;
        }

        .hint {
          font-size: 11px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
          display: block;
        }

        input, textarea, select {
          font-family: inherit;
          font-size: 11px;
          font-weight: 400;
          line-height: 1.5;
          color: black;
          background-color: white;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #9ca3af;
        }

        input::placeholder, textarea::placeholder {
          color: #9ca3af;
          font-weight: 400;
        }

        .section-title {
          font-size: 14px;
          font-weight: 600;
          margin: 30px 0 20px 0;
          color: black;
          text-align: center;
        }

        .tiles {
          display: flex;
          gap: 16px;
          margin: 20px 0;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .tile {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 0 0 180px;
        }

        .tile:hover {
          border-color: #9ca3af;
          transform: translateY(-2px);
        }

        .tile.selected {
          border-color: black;
          background-color: #f9fafb;
        }

        .tile .title {
          font-size: 11px;
          font-weight: 600;
          margin: 8px 0 4px 0;
          color: black;
        }

        .tile .desc {
          font-size: 10px;
          font-weight: 400;
          color: #6b7280;
          line-height: 1.3;
        }

        .img-wrap {
          width: 100%;
          height: 120px;
          position: relative;
          margin-bottom: 8px;
          border-radius: 6px;
          overflow: hidden;
        }

        .uploader {
          background: #f9fafb;
          border-radius: 8px;
          padding: 30px 20px;
          text-align: center;
          margin: 20px 0;
        }

        .uploader p, .uploader small {
          font-size: 11px;
          font-weight: 400;
          margin: 4px 0;
          color: black;
        }

        .uploader strong {
          font-size: 11px;
          font-weight: 600;
          color: black;
        }

        .browse {
          background: #e5e7eb;
          color: black;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 12px;
          transition: background-color 0.2s ease;
        }

        .browse:hover {
          background: #d1d5db;
        }

        .browse:disabled {
          background: #9ca3af;
          color: #6b7280;
        }

        .file-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          margin: 8px 0;
          background: white;
        }

        .file-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .file-name {
          font-size: 11px;
          font-weight: 400;
          color: #374151;
        }

        .file-remove {
          background: #9ca3af;
          color: white;
          border: none;
          border-radius: 4px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: pointer;
        }

        .file-remove:hover {
          background: #6b7280;
        }

        .consent {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 20px 0;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .consent input {
          width: 16px !important;
          height: 16px !important;
          margin: 2px 0 0 0 !important;
        }

        .consent span {
          font-size: 11px;
          font-weight: 400;
          color: #4b5563;
          line-height: 1.4;
        }

        .error-message {
          font-size: 10px;
          font-weight: 400;
          color: #6b7280;
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
          margin-top: 30px;
          width: 100%;
          transition: background-color 0.2s ease;
        }

        .btn:hover {
          background-color: #1a0f3a;
        }

        .btn:disabled {
          background-color: #9ca3af;
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

        <div style={{ marginTop: "20px" }}>
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
                  style={{ objectFit: 'contain' }}
                  sizes="180px"
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

        <div style={{ marginTop: "20px" }}>
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
