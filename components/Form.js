import { useState } from 'react';
import Image from 'next/image';

const Form = () => {
  const [selected, setSelected] = useState(""); // Przechowujemy wybrany typ ogrodu
  const [selectedFiles, setSelectedFiles] = useState([]); // Przechowujemy wybrane pliki

  const tilesData = [
    { value: "home-extension", title: "Home Extension", desc: "Najwyższy standard, płaski dach, różne kształty świetlików, pełna integracja z domem", src: "/images/forms/home-extension-day.webp", alt: "Home Extension" },
    { value: "cieply", title: "Klasyczny ciepły", desc: "Interesujące, różne kształty dachu, eleganckie, ciepłe wykonanie, komfort przez cały rok", src: "/images/forms/ogrod-klasyczny-day.webp", alt: "Klasyczny ciepły" },
    { value: "zimny", title: "Sezonowy zimny", desc: "Ekonomiczne rozwiązanie, więcej miejsca latem i cieplejsze dni jesienią", src: "/images/forms/ogrod-sezonowy-day.webp", alt: "Sezonowy zimny" },
    { value: "pergola", title: "Pergola Bioclimatic", desc: "Ruchome lamele, nowoczesna ochrona tarasu. Możliwe ruchome szklane ściany", src: "/images/forms/pergola-bioclimatic-day.webp", alt: "Pergola Bioclimatic" },
    { value: "doradzcie", title: "Nie wiem, doradźcie mi", desc: "Nie musisz znać wszystkich rozwiązań – przygotujemy najlepszą opcję dla Twojego domu", src: "/images/forms/help-me.webp", alt: "Doradztwo" }
  ];

  // Funkcja obsługująca zmianę plików
  const handleFileChange = (event) => {
    const files = event.target.files;
    const newFiles = Array.from(files).map(file => ({ file, progress: 0 }));
    setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  // Funkcja obsługująca wybór kafelka
  const handleTileSelect = (value) => {
    setSelected(value);
  };

  return (
    <div className="shell">
      <h1>Otrzymaj darmową wycenę</h1>
      <p className="sub">PODAJ KILKA PODSTAWOWYCH INFORMACJI – PRZYGOTUJEMY KALKULACJĘ I SKONTAKTUJEMY SIĘ W CIĄGU 24H</p>

      <form id="verandana-form">
        {/* Dane kontaktowe */}
        <div className="grid two">
          <div>
            <label className="hint" htmlFor="name">Imię</label>
            <input id="name" type="text" placeholder="Wpisz swoje imię" required />
          </div>
          <div>
            <label className="hint" htmlFor="email">E-mail</label>
            <input id="email" type="email" placeholder="Wpisz swój e-mail" required />
          </div>
          <div>
            <label className="hint" htmlFor="phone">Telefon</label>
            <input id="phone" type="tel" placeholder="Wpisz swój numer telefonu" required />
          </div>
          <div>
            <label className="hint" htmlFor="postal">Kod pocztowy</label>
            <input id="postal" type="text" placeholder="12-345" required />
          </div>
        </div>

        {/* Termin */}
        <div style={{ marginTop: "12px" }}>
          <label className="hint" htmlFor="date">Preferowany termin rozpoczęcia montażu</label>
          <input id="date" type="date" placeholder="Wybierz datę" />
        </div>

        {/* Kafelki */}
        <div className="section-title">Wybierz typ konstrukcji, który Cię interesuje</div>
        <div className="tiles" role="radiogroup" aria-label="Typ zabudowy">
          {tilesData.map(tile => (
            <button
              key={tile.value}
              type="button"
              className={`tile ${selected === tile.value ? "selected" : ""}`}
              onClick={() => handleTileSelect(tile.value)}
              role="radio"
              aria-checked={selected === tile.value ? "true" : "false"}
              aria-label={tile.title}
            >
              <div className="img-wrap">
                <Image src={tile.src} alt={tile.alt} width={300} height={300} />
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
            <input id="file" type="file" accept="image/*" style={{ display: "none" }} multiple onChange={handleFileChange} />
            <button type="button" className="browse" onClick={() => document.getElementById('file').click()}>Przeglądaj</button>
          </div>
          <div className="files">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="file-row">
                <div className="file-top">
                  <div className="file-name">{file.file.name}</div>
                  <button type="button" className="file-remove" onClick={() => setSelectedFiles(selectedFiles.filter(f => f !== file))}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Komentarz */}
        <div style={{ marginTop: "12px" }}>
          <label className="hint" htmlFor="comment">Komentarz</label>
          <textarea id="comment" placeholder="Komentarz (opcjonalnie jednak dla nas pomocny) - jakiej wielkości planujesz ogród, jakie są istniejące warunki podłoża, czy jest taras, itd."></textarea>
        </div>

        {/* Zgody */}
        <label className="consent">
          <input id="consent" type="checkbox" required />
          <span>Wyrażam zgodę na kontakt telefoniczny w związku z obsługą niniejszego zgłoszenia.</span>
        </label>

        {/* Submit */}
        <button className="btn" type="submit">Wyślij</button>
      </form>
    </div>
  );
};

export default Form;
