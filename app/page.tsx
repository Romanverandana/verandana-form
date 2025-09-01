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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
          max-width: 900px;
          margin: 0 auto;
          padding: 60px 40px;
          background: linear-gradient(135deg, #fafbff 0%, #f8fafc 100%);
          min-height: 100vh;
          font-size: 12px;
        }
        
        .form-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 50px;
          box-shadow: 
            0 32px 64px rgba(0, 0, 0, 0.05),
            0 16px 32px rgba(0, 0, 0, 0.03),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          position: relative;
          overflow: hidden;
        }
        
        .form-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
        }
        
        .main-title {
          font-size: 42px;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 16px;
          color: #0d1117;
          background: linear-gradient(135deg, #0d1117 0%, #24292f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          letter-spacing: -0.02em;
        }
        
        .sub {
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6;
          color: #6b7280;
          margin-bottom: 40px;
          text-align: center;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          opacity: 0.8;
        }
        
        .section {
          margin-bottom: 40px;
        }
        
        .hint {
          font-size: 10px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.7;
        }
        
        .input-wrapper {
          position: relative;
          margin-bottom: 24px;
        }
        
        input, textarea, select {
          font-family: inherit;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
          color: #1f2937;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          padding: 16px 20px;
          border: 1px solid rgba(209, 213, 219, 0.3);
          border-radius: 12px;
          width: 100%;
          box-sizing: border-box;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 1px 3px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }
        
        input:focus, textarea:focus {
          outline: none;
          border-color: rgba(59, 130, 246, 0.5);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 
            0 0 0 4px rgba(59, 130, 246, 0.1),
            0 4px 20px rgba(59, 130, 246, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transform: translateY(-1px);
        }
        
        input::placeholder, textarea::placeholder {
          color: #9ca3af;
          font-weight: 300;
          opacity: 0.7;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 700;
          margin: 50px 0 30px 0;
          color: #1f2937;
          text-align: center;
          position: relative;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 1px;
        }
        
        .tiles {
          display: flex;
          gap: 24px;
          margin: 40px 0;
          overflow-x: auto;
          padding: 0 0 10px 0;
        }
        
        .tile {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: none;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.04),
            0 4px 16px rgba(0, 0, 0, 0.02);
          flex: 0 0 280px;
        }
        
        .tile:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.08),
            0 8px 24px rgba(0, 0, 0, 0.05);
        }
        
        .tile.selected {
          background: rgba(0, 0, 0, 0.02);
          transform: translateY(-2px);
          box-shadow: 
            0 16px 32px rgba(0, 0, 0, 0.1),
            0 8px 24px rgba(0, 0, 0, 0.05);
        }
        
        .tile .title {
          font-size: 16px;
          font-weight: 700;
          margin: 16px 0 8px 0;
          color: #1f2937;
          letter-spacing: -0.01em;
        }
        
        .tile .desc {
          font-size: 13px;
          font-weight: 400;
          color: #6b7280;
          line-height: 1.5;
          opacity: 0.8;
        }
        
        .img-wrap {
          width: 100%;
          aspect-ratio: 1;
          position: relative;
          margin-bottom: 16px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .tile:hover .img-wrap {
          transform: scale(1.05);
          box-shadow: 
            0 12px 32px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        
        .grid.two {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin: 30px 0;
        }
        
        .uploader {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          border: none;
          border-radius: 16px;
          padding: 40px 30px;
          text-align: center;
          margin: 40px 0;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .uploader::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.02));
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .uploader:hover {
          background: rgba(255, 255, 255, 0.8);
        }
        
        .uploader:hover::before {
          opacity: 1;
        }
        
        .uploader p, .uploader small {
          font-size: 14px;
          font-weight: 500;
          margin: 8px 0;
          color: #374151;
          position: relative;
          z-index: 1;
        }
        
        .uploader strong {
          font-weight: 700;
          color: #1f2937;
        }
        
        .browse {
          background: #e5e7eb;
          color: black;
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 16px;
          position: relative;
          z-index: 1;
        }
        
        .browse:hover {
          background: #d1d5db;
          transform: translateY(-2px);
        }
        
        .browse:disabled {
          background: #9ca3af;
          transform: none;
          color: #6b7280;
        }
        
        .file-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border: 1px solid rgba(229, 231, 235, 0.5);
          border-radius: 12px;
          margin: 12px 0;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .file-row:hover {
          border-color: rgba(59, 130, 246, 0.3);
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-1px);
        }
        
        .file-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        
        .file-name {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }
        
        .file-remove {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          border-radius: 8px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }
        
        .file-remove:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        
        .consent {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin: 40px 0;
          padding: 20px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 12px;
          border: 1px solid rgba(229, 231, 235, 0.3);
        }
        
        .consent input {
          width: 18px !important;
          height: 18px !important;
          margin: 2px 0 0 0 !important;
          accent-color: #3b82f6;
        }
        
        .consent span {
          font-size: 13px;
          font-weight: 400;
          color: #4b5563;
          line-height: 1.5;
        }
        
        .error-message {
          font-size: 11px;
          font-weight: 500;
          color: #ef4444;
          display: block;
          margin-top: 6px;
          opacity: 0.9;
        }
        
        .btn {
          font-size: 16px;
          font-weight: 700;
          padding: 18px 40px;
          background-color: #090123;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          margin-top: 40px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 8px 32px rgba(9, 1, 35, 0.3),
            0 4px 16px rgba(9, 1, 35, 0.2);
          position: relative;
          overflow: hidden;
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.6s ease;
        }
        
        .btn:hover {
          transform: translateY(-3px);
          background-color: #1a0f3a;
          box-shadow: 
            0 16px 48px rgba(9, 1, 35, 0.4),
            0 8px 24px rgba(9, 1, 35, 0.3);
        }
        
        .btn:hover::before {
          left: 100%;
        }
        
        .btn:active {
          transform: translateY(-1px);
        }
        
        .btn:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .section {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .tiles .tile {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .tiles .tile:nth-child(2) { animation-delay: 0.1s; }
        .tiles .tile:nth-child(3) { animation-delay: 0.2s; }
        .tiles .tile:nth-child(4) { animation-delay: 0.3s; }
        .tiles .tile:nth-child(5) { animation-delay: 0.4s; }
      `}</style>

      <div className="form-container">
        <h1 className={`${playfairDisplay.className} main-title`}>
          Otrzymaj darmową wycenę
        </h1>
        <p className="sub">
          Podaj kilka podstawowych informacji – przygotujemy kalkulację i skontaktujemy się w ciągu 24H
        </p>

        <form id="verandana-form" onSubmit={handleSubmit}>
          <div className="section">
            <div className="grid two">
              <div className="input-wrapper">
                <label className="hint" htmlFor="name">Imię *</label>
                <input 
                  id="name" 
                  type="text" 
                  placeholder="Twoje imię" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required 
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="input-wrapper">
                <label className="hint" htmlFor="email">Adres e-mail *</label>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="twoj@email.com" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required 
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="input-wrapper">
                <label className="hint" htmlFor="phone">Numer telefonu *</label>
                <input 
                  id="phone" 
                  type="tel" 
                  placeholder="+48 123 456 789" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  required 
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              
              <div className="input-wrapper">
                <label className="hint" htmlFor="postal">Kod pocztowy *</label>
                <input 
                  id="postal" 
                  type="text" 
                  placeholder="12-345" 
                  value={formData.postal}
                  onChange={(e) => handleInputChange('postal', e.target.value)}
                  onFocus={() => setFocusedField('postal')}
                  onBlur={() => setFocusedField(null)}
                  required 
                />
                {errors.postal && <span className="error-message">{errors.postal}</span>}
              </div>
            </div>
          </div>

          <div className="section">
            <div className="input-wrapper">
              <label className="hint" htmlFor="date">Preferowany termin rozpoczęcia</label>
              <input 
                id="date" 
                type="date" 
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="section">
            <div className="section-title">Wybierz typ konstrukcji</div>
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
                      sizes="280px"
                    />
                  </div>
                  <div className="title">{tile.title}</div>
                  <div className="desc">{tile.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="uploader">
              <p><strong>Dodaj zdjęcia swojej przestrzeni</strong></p>
              <small>Maksymalnie 5 plików, do 5 MB każdy • HEIC, JPEG, PNG</small>
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
                {selectedFiles.length >= 5 ? 'Limit osiągnięty' : 'Wybierz pliki'}
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
          </div>

          <div className="section">
            <div className="input-wrapper">
              <label className="hint" htmlFor="comment">Dodatkowe informacje</label>
              <textarea 
                id="comment" 
                placeholder="Opisz swoją wizję projektu, wielkość przestrzeni, istniejące warunki..."
                value={formData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                onFocus={() => setFocusedField('comment')}
                onBlur={() => setFocusedField(null)}
                rows={4}
              />
            </div>
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
    </div>
  );
}
