import { useState, useCallback } from 'react';
import Image from 'next/image';

const Form = () => {
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
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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

  // Walidacja formularza
  const validateForm = useCallback(() => {
    const newErrors = {};
    
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
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Usuwanie błędu po zmianie pola
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Obsługa plików z walidacją
  const handleFileChange = useCallback((event) => {
    const files = Array.from(event.target.files);
    const maxFiles = 5;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic'];

    // Sprawdzenie limitu plików
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
    event.target.value = ''; // Reset input
  }, [selectedFiles]);

  // Usuwanie pliku
  const removeFile = useCallback((fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  // Wybór typu konstrukcji
  const handleTileSelect = useCallback((value) => {
    handleInputChange('selectedType', value);
  }, [handleInputChange]);

  // Obsługa submitu
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = new FormData();
      
      // Dodanie danych formularza
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      // Dodanie plików
      selectedFiles.forEach(({ file }) => {
        submitData.append('files', file);
      });

      // Tu dodaj logikę wysyłania formularza
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        alert('Formularz został wysłany pomyślnie!');
        // Reset formularza
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
      } else {
        throw new Error('Błąd wysyłania formularza');
      }
    } catch (error) {
      console.error('Błąd:', error);
      alert('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shell">
      <h1>Otrzymaj darmową wycenę</h1>
      <p className="sub">
        PODAJ KILKA PODSTAWOWYCH INFORMACJI – PRZYGOTUJEMY KALKULACJĘ I SKONTAKTUJEMY SIĘ W CIĄGU 24H
      </p>

      <form id="verandana-form" onSubmit={handleSubmit} noValidate>
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
              className={errors.name ? 'error' : ''}
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
              className={errors.email ? 'error' : ''}
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
              className={errors.phone ? 'error' : ''}
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
              className={errors.postal ? 'error' : ''}
              pattern="\d{2}-\d{3}"
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
            min={new Date().toISOString().split('T')[0]} // Nie można wybrać daty z przeszłości
          />
        </div>

        {/* Kafelki */}
        <div className="section-title">Wybierz typ konstrukcji, który Cię interesuje *</div>
        {errors.selectedType && <span className="error-message">{errors.selectedType}</span>}
        <div className="tiles" role="radiogroup" aria-label="Typ zabudowy">
          {tilesData.map(tile => (
            <button
              key={tile.value}
              type="button"
              className={`tile ${formData.selectedType === tile.value ? "selected" : ""}`}
              onClick={() => handleTileSelect(tile.value)}
              role="radio"
              aria-checked={formData.selectedType === tile.value ? "true" : "false"}
              aria-label={tile.title}
            >
              <div className="img-wrap">
                <Image 
                  src={tile.src} 
                  alt={tile.alt} 
                  width={300} 
                  height={300}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <div className="title">{tile.title}</div>
              <div className="desc">{tile.desc}</div>
            </button>
          ))}
        </div>

        {/* Upload */}
        <div className="uploader" aria-label="Prześlij zdjęcia (max 5 plików, do 5 MB każdy)">
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
              onClick={() => document.getElementById('file').click()}
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
                    aria-label={`Usuń plik ${fileObj.file.name}`}
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
            rows="4"
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
  );
};

export default Form;
