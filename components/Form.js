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
    event.target.value = '';
  }, [selectedFiles]);

  const removeFile = useCallback((fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const handleTileSelect = useCallback((value) => {
    handleInputChange('selectedType', value);
  }, [handleInputChange]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      selectedFiles.forEach(({ file }) => {
        submitData.append('files', file);
      });

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
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
    <div className="shell font-body">
      <style jsx>{`
        .shell {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        h1 {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.025em;
          margin-bottom: 0.75rem;
          color: #1f2937;
        }
        
        .sub {
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.6;
          color: #6b7280;
          margin-bottom: 2rem;
          letter-spacing: 0.01em;
        }
        
        .hint {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
          display: block;
          letter-spacing: 0.025em;
        }
        
        input, textarea, select {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          line-height: 1.5;
          letter-spacing: 0.01em;
          color: #1f2937;
        }
        
        input::placeholder, textarea::placeholder {
          color: #9ca3af;
          font-weight: 400;
