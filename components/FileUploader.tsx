'use client';
import { useState, useCallback, useRef } from 'react';
import { FileWithProgress } from '../lib/types';
import styles from '../app/page.module.css';

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic'];

interface FileUploaderProps {
  files: FileWithProgress[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithProgress[]>>;
  onUploadError: (message: string) => void;
}

export default function FileUploader({ files, setFiles, onUploadError }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((incomingFiles: File[]) => {
    if (!incomingFiles.length) return;
    if (files.length + incomingFiles.length > MAX_FILES) {
      onUploadError(`Możesz przesłać maksymalnie ${MAX_FILES} plików.`);
      return;
    }
    const validFiles: File[] = [];
    incomingFiles.forEach(file => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        onUploadError(`Plik ${file.name} jest za duży (max 5MB).`);
      } else if (!ALLOWED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
        onUploadError(`Plik ${file.name} ma nieprawidłowy format.`);
      } else {
        validFiles.push(file);
      }
    });
    const newFileObjects: FileWithProgress[] = validFiles.map(file => ({
      id: Date.now() + Math.random(), file, progress: 0, preview: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...newFileObjects]);
    newFileObjects.forEach(f => {
        const interval = setInterval(() => {
            setFiles(prev => prev.map(pf => pf.id === f.id ? {...pf, progress: Math.min(pf.progress + 20, 100)} : pf));
        }, 200);
        setTimeout(() => clearInterval(interval), 1200);
    });
  }, [files, setFiles, onUploadError]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(event.target.files || []));
    if (inputRef.current) inputRef.current.value = '';
  };
  
  const removeFile = useCallback((fileId: number) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) { URL.revokeObjectURL(fileToRemove.preview); }
      return prev.filter(f => f.id !== fileId);
    });
  }, [setFiles]);

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(isEntering);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false); handleFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div 
      className={`${styles.uploader} ${isDragging ? styles.dragging : ''}`}
      onDragEnter={(e) => handleDragEvents(e, true)} onDragOver={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)} onDrop={handleDrop}
    >
        <div className={styles.uploaderIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h18v-3.75m-18 0V5.625c0-1.036.84-1.875 1.875-1.875h14.25c1.035 0 1.875.84 1.875 1.875v11.625" />
            </svg>
        </div>
        <p><strong>Dodaj zdjęcia lub projekt</strong></p>
        <small>Upuść pliki tutaj lub wybierz je ze swojego dysku</small>
        <input ref={inputRef} id="file" type="file" accept={ALLOWED_TYPES.join(',')} style={{ display: "none" }} multiple onChange={handleFileChange} />
        <button type="button" className={styles.browse} onClick={() => inputRef.current?.click()} disabled={files.length >= MAX_FILES}>
          Przeglądaj pliki
        </button>
        <div className={styles.filesList}>
          {files.map((fileObj) => (
            <div key={fileObj.id} className={`${styles.fileRow} ${styles.fileRowWithPreview}`}>
              {fileObj.preview && <img src={fileObj.preview} alt="Podgląd" className={styles.imagePreview} />}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName} title={fileObj.file.name}>{fileObj.file.name}</span>
                  <button type="button" className={styles.fileRemove} onClick={() => removeFile(fileObj.id)} aria-label={`Usuń plik ${fileObj.file.name}`}> × </button>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progress} style={{ width: `${fileObj.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}