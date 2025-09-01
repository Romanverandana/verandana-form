/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type TFile = { file: File; progress: number; timerId?: any };
type Tile = { value: string; title: string; desc: string; src: string; alt: string; nightSrc?: string };

export default function Page() {
  const [selected, setSelected] = useState<string>("");
  const [files, setFiles] = useState<TFile[]>([]);
  const dzRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const postalRef = useRef<HTMLInputElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  const commentRef = useRef<HTMLTextAreaElement | null>(null);
  const consentRef = useRef<HTMLInputElement | null>(null);
  const [msg, setMsg] = useState<{ text: string; color: "crimson" | "green" | "" }>({ text: "", color: "" });

  const tilesData: Tile[] = useMemo(
    () => [
      { value: "home-extension-day", title: "Home Extension", desc: "Najwyższy standard, płaski dach,\nrÓżne kształty świetlików, pełna\nintegracja z domem", src: "/images/forms/home-extension-day.webp", alt: "Home Extension" },
      { value: "ogrod-klasyczny-day", title: "Klasyczny ciepły", desc: "Interesujące, różne kształty dachu,\neleganckie, ciepłe wykonanie,\nkomfort przez cały rok", src: "/images/forms/cieply-klasyczny-day.webp", alt: "Klasyczny ciepły" },
      { value: "ogrod-sezonowy-day", title: "Sezonowy zimny", desc: "Ekonomiczne rozwiązanie, więcej\nmiejsca latem i cieplejsze dni\njesienią", src: "/images/forms/sezonowy-zimny-day.webp", alt: "Sezonowy zimny" },
      { value: "pergola-bioclimatic-day", title: "Pergola Bioclimatic", desc: "Ruchome lamele, nowoczesna\nochrona tarasu. Możliwe ruchome\nszklane ściany", src: "/images/forms/pergola-bioclimatic-day.webp", alt: "Pergola Bioclimatic" },
      { value: "doradzcie", title: "Nie wiem, doradźcie mi", desc: "Nie musisz znać wszystkich\nrozwiązań – przygotujemy\nnajlepszą opcję dla Twojego domu", src: "/images/forms/pomozcie-w-wyborze-ogrodu.webp", alt: "Doradztwo" }
    ],
    []
  );

  function addFiles(newFiles: FileList | File[]) {
    const list = Array.from(newFiles);
    const next: TFile[] = [];
    for (const f of list) {
      if (files.length + next.length >= 5) break;
      if (f.size > 5 * 1024 * 1024) continue;
      next.push({ file: f, progress: 0 });
    }
    if (!next.length) return;
    const merged = [...files, ...next];
    setFiles(merged);
  }

  useEffect(() => {
    const timers: any[] = [];
    const updated = files.map((it, idx) => {
      if (it.progress >= 100 || it.timerId) return it;
      const timerId = setInterval(() => {
        setFiles(prev =>
          prev.map((p, i) => {
            if (i !== idx) return p;
            const np = Math.min(100, p.progress + 8 + Math.random() * 10);
            return { ...p, progress: np };
          })
        );
      }, 120);
      timers.push(timerId);
      return { ...it, timerId };
    });
    if (timers.length) setFiles(updated);
    return () => timers.forEach(clearInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length]);

  useEffect(() => {
    const dz = dzRef.current;
    if (!dz) return;
    const onEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dz.classList.add("drag");
    };
    const onOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dz.classList.remove("drag");
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dz.classList.remove("drag");
      if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
    };
    dz.addEventListener("dragenter", onEnter);
    dz.addEventListener("dragover", onOver);
    dz.addEventListener("dragleave", onLeave);
    dz.addEventListener("drop", onDrop);
    return () => {
      dz.removeEventListener("dragenter", onEnter);
      dz.removeEventListener("dragover", onOver);
      dz.removeEventListener("dragleave", onLeave);
      dz.removeEventListener("drop", onDrop);
    };
  }, []);

  function removeFile(i: number) {
    const f = files[i];
    if (f?.timerId) clearInterval(f.timerId);
    setFiles(prev => prev.filter((_, idx) => idx !== i));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg({ text: "", color: "" });
    const requiredOK =
      nameRef.current?.value.trim() &&
      emailRef.current?.value.trim() &&
      phoneRef.current?.value.trim() &&
      postalRef.current?.value.trim();
    if (!requiredOK) {
      setMsg({ text: "Uzupełnij wymagane pola kontaktowe.", color: "crimson" });
      return;
    }
    if (!selected) {
      setMsg({ text: "Wybierz typ konstrukcji.", color: "crimson" });
      return;
    }
    if (!consentRef.current?.checked) {
      setMsg({ text: "Zaznacz zgodę.", color: "crimson" });
      return;
    }
    const payload = {
      name: nameRef.current?.value.trim() || "",
      email: emailRef.current?.value.trim() || "",
      phone: phoneRef.current?.value.trim() || "",
      postal: postalRef.current?.value.trim() || "",
      date: dateRef.current?.value || "",
      type: selected,
      comment: commentRef.current?.value.trim() || "",
      consent: !!consentRef.current?.checked,
      files: files.map(f => f.file.name)
    };
    // eslint-disable-next-line no-console
    console.log("Dane formularza:", payload);
    setMsg({ text: "Dziękujemy! Formularz wypełniony (dane w konsoli).", color: "green" });
    alert("Formularz wypełniony — dane w konsoli ✅");
  }

  return (
    <div className="shell">
      <h1>Otrzymaj darmową wycenę</h1>
      <p className="sub">PODAJ KILKA PODSTAWOWYCH INFORMACJI – PRZYGOTUJEMY KALKULACJĘ I SKONTAKTUJEMY SIĘ W CIĄGU 24H</p>

      <form onSubmit={onSubmit} noValidate>
        <div className="grid two">
          <div>
            <label className="hint" htmlFor="name">Imię</label>
            <input id="name" ref={nameRef} type="text" placeholder="Wpisz  swoje imię" required />
          </div>
          <div>
            <label className="hint" htmlFor="email">E-mail</label>
            <input id="email" ref={emailRef} type="email" placeholder="Wpisz  swój e-mail" required />
          </div>
          <div>
            <label className="hint" htmlFor="phone">Telefon</label>
            <input id="phone" ref={phoneRef} type="tel" placeholder="Wpisz  swój numer telefonu" required />
          </div>
          <div>
            <label className="hint" htmlFor="postal">Kod pocztowy</label>
            <input id="postal" ref={postalRef} type="text" placeholder="12-345" required />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label className="hint" htmlFor="date">Preferowany termin rozpoczęcia montażu</label>
          <br />
          <input id="date" ref={dateRef} type="date" placeholder="Wybierz  datę" />
        </div>

        <div className="section-title">Wybierz typ konstrukcji, który Cię interesuje</div>
        <div className="tiles" role="radiogroup" aria-label="Typ zabudowy">
          {tilesData.map(t => (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={selected === t.value ? "true" : "false"}
              aria-label={t.title}
              className={`tile${selected === t.value ? " selected" : ""}`}
              onClick={() => setSelected(t.value)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(t.value);
                }
              }}
            >
              <div className="img-wrap">
                <img src={t.src} alt={t.alt} />
              </div>
              <div className="title">
                {t.title}
                {selected === t.value ? " ✓" : ""}
              </div>
              <div className="desc" dangerouslySetInnerHTML={{ __html: t.desc.replace(/\n/g, "<br/>") }} />
            </button>
          ))}
        </div>

        <div className="uploader" ref={dzRef} aria-label="Prześlij zdjęcia (max 5 plików, do 5 MB każdy)">
          <p><strong>Prześlij zdjęcia (max 5 plików, do 5 MB każdy)</strong></p>
          <small>Przeciągnij i upuść lub przeglądaj, aby przesłać. Obsługiwane formaty: HEIC, JPEG, PNG</small>
          <div className="actions">
            <input ref={fileInputRef} id="file" type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => e.target.files && addFiles(e.target.files)} />
            <button type="button" className="browse" onClick={() => fileInputRef.current?.click()}>Przeglądaj</button>
          </div>
          <div className="files">
            {files.map((it, idx) => (
              <div key={idx} className="file-row">
                <div className="file-top">
                  <div className="file-name" title={it.file.name}>{it.file.name}</div>
                  <button type="button" className="file-remove" aria-label="Usuń plik" onClick={() => removeFile(idx)}>×</button>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${Math.round(it.progress)}%` }} />
                </div>
                <div className="progress-label">{Math.round(it.progress)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label className="hint" htmlFor="comment">Komentarz</label>
          <textarea id="comment" ref={commentRef} placeholder="Komentarz (opcjonalnie jednak dla nas pomocny) - jakiej wielkości planujesz ogród, jakie są istniejące warunki podłoża, czy jest taras, itd." />
        </div>

        <label className="consent">
          <input id="consent" ref={consentRef} type="checkbox" required />
          <span>
            Wyrażam zgodę na kontakt telefoniczny w związku z obsługą niniejszego zgłoszenia. <br />
            Akceptuję również otrzymywanie od Verandana sp. z o.o. informacji handlowych drogą elektroniczną <br />
            oraz wykorzystanie poczty e-mail w celach marketingowych, zgodnie z Polityką Prywatności.
          </span>
        </label>

        <button className="btn" type="submit">Wyślij</button>
        <div className="msg" style={{ color: msg.color }}>{msg.text}</div>
      </form>

      <style jsx global>{`
        :root{--bg:#f7f7f7;--card:#fff;--text:#111;--muted:#6d6d6d;--line:#e9e9e9;--accent:#111;--shadow:0 6px 24px rgba(0,0,0,.10);--radius:16px}
        *{box-sizing:border-box}
        html,body{margin:0;padding:0;background:var(--bg);color:var(--text);font-family:Montserrat,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial;font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
        .shell{max-width:1040px;margin:56px auto;padding:0 24px}
        h1{margin:0 0 6px;font-family:"Playfair Display",serif;font-weight:800;font-size:clamp(32px,4.6vw,44px);letter-spacing:.2px}
        .sub{margin:0 0 28px;color:var(--muted);font-weight:500;font-size:clamp(14px,2vw,16px)}
        form{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:28px}
        .grid{display:grid;gap:16px}
        @media(min-width:780px){.grid.two{grid-template-columns:1fr 1fr}}
        input[type="text"],input[type="tel"],input[type="email"],input[type="date"],textarea{width:100%;padding:14px 16px;border:1px solid var(--line);border-radius:12px;background:#fff;transition:border .15s ease,box-shadow .15s ease;font-family:Montserrat,ui-sans-serif;font-weight:600;font-size:10px;color:#111;text-align:left;direction:ltr}
        input::placeholder,textarea::placeholder{font-family:Montserrat,ui-sans-serif;font-weight:600;font-size:10px;color:#9a9a9a}
        input:focus,textarea:focus{border-color:#cfcfcf;box-shadow:0 0 0 4px rgba(0,0,0,.05);outline:0}
        textarea{min-height:124px;resize:vertical}
        label.hint{display:inline-block;margin:2px 0 6px;color:#8a8a8a;font-size:9px;font-weight:500;font-family:Montserrat,ui-sans-serif}
        @media(max-width:679px){
          input[type="date"]{background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="%23999" viewBox="0 0 24 24"><path d="M7 10h5v5H7z"/><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.89-1.99 2L3 20c0 1.11.89 2 2 2h14c1.1 0 2-.89 2-2V6c0-1.11-.9-2-2-2zm0 16H5V9h14v11z"/></svg>');background-repeat:no-repeat;background-position:right 12px center;padding-right:40px;-webkit-appearance:none;appearance:none}
        }
        .section-title{margin:20px 0 10px;font-weight:800;letter-spacing:.15px;font-family:Montserrat,ui-sans-serif}
        .tiles{display:grid;gap:18px}
        @media(min-width:1020px){.tiles{grid-template-columns:repeat(5,minmax(0,1fr))}}
        @media(min-width:680px) and (max-width:1019px){.tiles{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:679px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}
        .tile{border:none;background:transparent;cursor:pointer;transition:transform .12s ease}
        .tile:hover{transform:translateY(-2px)}
        .tile .img-wrap{border-radius:16px;overflow:hidden;border:1px solid #eaeaea;box-shadow:0 2px 10px rgba(0,0,0,.06);aspect-ratio:1/1;background:#fff;display:block}
        .tile img{width:100%;height:100%;object-fit:contain;object-position:center;display:block}
        .tile .title{margin-top:10px;text-align:center;font-weight:800;font-size:15px;line-height:1.2;font-family:Montserrat,ui-sans-serif;color:#111}
        .tile .desc{margin-top:6px;color:#6f6f6f;text-align:center;font-size:13px;line-height:1.35;min-height:64px;font-family:Montserrat,ui-sans-serif}
        @media(max-width:679px){.tile .desc{font-size:9px;line-height:1.35;min-height:auto}}
        .tile.selected .img-wrap{outline:2px solid #111;box-shadow:0 8px 22px rgba(0,0,0,.14)}
        .uploader{margin-top:12px;padding:22px;border:2px dashed #dcdcdc;border-radius:14px;background:#fff;text-align:center}
        .uploader.drag{background:#f2f2f2}
        .uploader p{margin:0 0 6px;font-size:8px;font-weight:600}
        .uploader small{color:var(--muted);font-size:8px}
        .uploader .actions{margin-top:10px}
        .uploader button.browse{border:1px solid #d0d0d0;background:#fff;border-radius:10px;padding:9px 14px;cursor:pointer;font-weight:700}
        .files{margin-top:12px;display:grid;gap:8px}
        .file-row{display:flex;flex-direction:column;gap:6px;border:1px solid #eee;border-radius:12px;padding:10px 12px;background:#fff}
        .file-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
        .file-name{font-size:8px;white-space:normal;word-break:break-word}
        .file-remove{border:0;background:transparent;font-size:18px;line-height:1;cursor:pointer;color:#999}
        .file-remove:hover{color:#000}
        .progress{height:6px;background:#eee;border-radius:3px;overflow:hidden}
        .progress-bar{height:100%;width:0;background:var(--accent);transition:width .22s}
        .progress-label{font-size:8px;color:#6d6d6d;text-align:right}
        .btn{position:relative;overflow:hidden;margin-top:18px;background:var(--accent);color:#fff;border:0;border-radius:12px;padding:16px 22px;font-weight:800;cursor:pointer;letter-spacing:.2px;font-size:16px;box-shadow:0 6px 18px rgba(0,0,0,.18);transition:transform .15s ease,box-shadow .15s ease;-webkit-tap-highlight-color:transparent}
        .btn:hover{transform:translateY(-1px);box-shadow:0 10px 26px rgba(0,0,0,.22)}
        .btn:active{transform:translateY(0);box-shadow:0 6px 18px rgba(0,0,0,.18)}
        .btn:focus-visible{outline:0;box-shadow:0 0 0 3px rgba(17,17,17,.3),0 6px 18px rgba(0,0,0,.18)}
        .btn::after{content:"";position:absolute;top:0;left:-120%;width:120%;height:100%;background:linear-gradient(120deg,transparent 0%,rgba(255,255,255,.25) 50%,transparent 100%);transform:skewX(-20deg)}
        .btn:hover::after{animation:shine .8s ease}
        @keyframes shine{from{left:-120%}to{left:120%}}
        .btn:disabled{opacity:.6;cursor:not-allowed}
        .msg{margin-top:12px;font-size:14px}
        .consent{display:flex;gap:10px;align-items:flex-start;margin-top:12px}
        .consent input{margin-top:4px}
      `}</style>
    </div>
  );
}
