'use client'

import { useState, useCallback } from 'react';
import Image from 'next/image';

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
      src: "/next.svg", 
      alt: "Home Extension" 
    },
    { 
      value: "cieply", 
      title: "Klasyczny ciepły", 
      desc: "Interesujące, różne kształty dachu, eleganckie, ciepłe wykonanie, komfort przez cały rok", 
      src: "/next.svg", 
      alt: "Klasyczny ciepły" 
    },
    { 
      value: "zimny", 
      title: "Sezonowy zimny", 
      desc: "Ekonomiczne rozwiązanie, więcej miejsca latem i cieplejsze dni jesienią", 
      src: "/next.svg", 
      alt: "Sezonowy zimny" 
    },
    { 
      value: "pergola", 
      title: "Pergola Bioclimatic", 
      desc: "Ruchome lamele, nowoczesna ochrona tarasu. Możliwe ruchome szklane ściany", 
      src: "/next.svg", 
      alt: "Pergola Bioclimatic" 
    },
    { 
      value: "doradzcie", 
      title: "Nie wiem, doradźcie mi", 
      desc: "Nie musisz znać wszystkich rozwiązań – przygotujemy najlepszą opcję dla Twojego domu", 
      src: "/next.svg", 
      alt: "Doradztwo" 
    }
  ];

  // Walidacja formularza
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

  // Obsługa zmiany pól formularza
  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Obsługa plików z walidacją
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxFiles = 5;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
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

      // Symulacja wysyłania - usuń to i dodaj prawdziwy endpoint
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
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700&display=swap');
        
        body {
          background-color: white !important;
          color: black !important;
          margin: 0;
          padding: 0;
        }
        
        * {
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        h1 {
          font-family: 'Playfair Display', serif !important;
          font-size: 33px !important;
          font-weight: 700 !important;
          line-height: 1.2;
          margin-bottom: 0.75rem;
          color: black !important;
        }
        
        .sub {
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          font-weight: 400 !important;
          line-height: 1.6;
          color: #6b7280 !important;
          margin-bottom: 2rem;
        }
        
        .hint {
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          font-weight: 500 !important;
          color: #374151 !important;
          margin-bottom: 0.5rem;
          display: block;
        }
        
        input, textarea, select {
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          font-weight: 400 !important;
          line-height: 1.5;
          color: black !important;
          background-color: white !important;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          width: 100%;
          box-sizing: border-box;
        }
        
        input::placeholder, textarea::placeholder {
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          color: #9ca3af !important;
          font-weight: 400 !important;
        }
        
        button {
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          font-weight: 500 !important;
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
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          font-weight: 600 !important;
          margin: 20px 0 10px 0;
          color: black !important;
        }
        
        .tiles {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin: 20px 0;
        }
        
        .tile {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          background: white !important;
          transition: all 0.2s;
          color: black !important;
        }
        
        .tile:hover {
          border-color: #3b82f6;
        }
        
        .tile.selected {
          border-color: #3b82f6;
          background-color: #eff6ff !important;
        }
        
        .tile .title {
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          font-weight: 600 !important;
          margin: 8px 0 4px 0;
          color: black !important;
        }
        
        .tile .desc {
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          font-weight: 400 !important;
          color: #6b7280 !important;
        }
        
        .img-wrap {
          width: 100%;
          height: 100px;
          position: relative;
          margin-bottom: 8px;
          background-color: #f3f4f6;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .img-wrap img {
          border-radius: 4px;
          object-fit: contain !important;
          max-width: 80px;
          max-height: 80px;
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
          background-color: white !important;
        }
        
        .uploader p, .uploader small {
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          font-weight: 400 !important;
          margin: 4px 0;
          color: black !important;
        }
        
        .uploader strong {
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          font-weight: 600 !important;
          color: black !important;
        }
        
        .file-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          margin: 4px 0;
          background-color: white !important;
        }
        
        .file-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        
        .file-name {
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          font-weight: 400 !important;
          color: black !important;
        }
        
        .file-remove {
          background: #ef4444 !important;
          color: white !important;
          border: none;
          border-radius: 50%;
          width: 20px !important;
          height: 20px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px !important;
          cursor: pointer;
        }
        
        .consent {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 20px 0;
        }
        
        .consent input {
          width: auto !important;
          margin: 0;
        }
        
        .consent span {
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          font-weight: 400 !important;
          color: black !important;
        }
        
        .error-message {
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          font-weight: 400 !important;
          color: #ef4444 !important;
          display: block;
          margin-top: 4px;
        }
        
        .shell {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: white !important;
          min-height: 100vh;
        }
        
        form {
          background-color: white !important;
        }
        
        .btn {
          font-family: 'Montserrat', sans-serif !important;
          font-size: 10px !important;
          font-weight: 500 !important;
          padding: 12px 24px !important;
          background-color: #3b82f6 !important;
          color: white !important;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 20px;
        }
        
        .btn:hover {
          background-color: #2563eb !important;
        }
        
        .btn:disabled {
          background-color: #9ca3af !important;
          cursor: not-allowed;
        }
      `}</style>

      <div className="shell">
        <h1>Otrzymaj darmową wycenę</h1>
        <p className="sub">
          PODAJ KILKA PODSTAWOWYCH INFORMACJI – PRZYGOTUJEMY KALKULACJĘ I SKONTAKTUJEMY SIĘ W CIĄGU 24H
        </p>

        <form id="verandana-form" onSubmit={handleSubmit}>
          {/* Dane kontaktowe */}
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

          {/* Termin */}
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

          {/* Kafelki */}
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
                    width={80}
                    height={80}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="title">{tile.title}</div>
                <div className="desc">{tile.desc}</div>
              </button>
            ))}
          </div>

          {/* Upload */}
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

          {/* Komentarz */}
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

          {/* Zgody */}
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

          {/* Submit */}
          <button 
            className="btn" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Wysyłanie...' : 'Wyślij'}
          </button>
        </form>
      </div>
    </>
  );
}
