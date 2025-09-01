'use client';
import { useState, useCallback, useRef } from 'react';
import { FileWithProgress } from '@/lib/types';
import styles from '@/app/page.module.css';

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic'];

interface FileUploaderProps {
  files: FileWithProgress[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithProgress[]>>;
  onUploadError: (message: string) => void;
}

export default function FileUploader({ files, setFiles, onUploadError }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    if (!newFiles.length) return;

    if (files.length + newFiles.length > MAX_FILES) {
      onUploadError(`Możesz przesłać maksymalnie ${MAX_FILES} plików.`);
      return;
    }
    
    const validFiles: File[] = [];
    newFiles.forEach(file => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        onUploadError(`Plik ${file.name} jest za duży (max 5MB).`);
      } else if (!ALLOWED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
        onUploadError(`Plik ${file.name} ma nieprawidłowy format.`);
      } else {
        validFiles.push(file);
      }
    });

    const newFileObjects: FileWithProgress[] = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      progress: 0,
    }));
    
    setFiles(prev => [...prev, ...newFileObjects]);
    if (inputRef.current) inputRef.current.value = '';
    
    // Simulate upload progress
    newFileObjects.forEach(f => {
        const interval = setInterval(() => {
            setFiles(prev => prev.map(pf => pf.id === f.id ? {...pf, progress: Math.min(pf.progress + 20, 100)} : pf));
        }, 200);
        setTimeout(() => clearInterval(interval), 1200);
    });

  }, [files, setFiles, onUploadError]);
  
  const removeFile = useCallback((fileId: number) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, [setFiles]);

  return (
    <div className={styles.uploader}>
        <p><strong>Prześlij zdjęcia (max 5 plików, do 5 MB każdy)</strong></p>
        <small>Obsługiwane formaty: HEIC, JPEG, PNG</small>
        <input
          ref={inputRef}
          id="file"
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          style={{ display: "none" }}
          multiple
          onChange={handleFileChange}
        />
        <button
          type="button"
          className={styles.browse}
          onClick={() => inputRef.current?.click()}
          disabled={files.length >= MAX_FILES}
        >
          {files.length >= MAX_FILES ? 'Osiągnięto limit plików' : 'Przeglądaj pliki'}
        </button>
        <div className={styles.filesList}>
          {files.map((fileObj) => (
            <div key={fileObj.id} className={styles.fileRow}>
              <div className={styles.fileInfo}>
                <span className={styles.fileName} title={fileObj.file.name}>{fileObj.file.name}</span>
                <button
                  type="button"
                  className={styles.fileRemove}
                  onClick={() => removeFile(fileObj.id)}
                  aria-label={`Usuń plik ${fileObj.file.name}`}
                > × </button>
              </div>
              <div className={styles.progressBar}>
                  <div className={styles.progress} style={{ width: `${fileObj.progress}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}
