'use client';
import { useState, useCallback, useRef } from 'react';
import { FileWithProgress } from '../lib/types';
import styles from '../app/page.module.css';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

interface FileUploaderProps {
  onFilesChange: (files: FileWithProgress[]) => void;
}

export default function FileUploader({ onFilesChange }: FileUploaderProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((fileList: FileList) => {
    const validFiles = Array.from(fileList).filter((file, index) => {
      if (files.length + index >= MAX_FILES) {
        alert(`Maksymalna liczba plików to ${MAX_FILES}`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`Plik ${file.name} jest zbyt duży. Maksymalny rozmiar to 10MB`);
        return false;
      }
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        alert(`Plik ${file.name} ma nieprawidłowy format`);
        return false;
      }
      return true;
    });
    
    const newFileObjects: FileWithProgress[] = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      progress: 0,
      status: 'pending',
      preview: URL.createObjectURL(file)
    }));
    
    setFiles(prev => [...prev, ...newFileObjects]);
    onFilesChange([...files, ...newFileObjects]);
  }, [files, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeFile = (id: number | string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  return (
    <div className={styles.fileUploader}>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={styles.dropzoneContent}>
          <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className={styles.dropzoneText}>
            Przeciągnij i upuść pliki tutaj lub kliknij aby wybrać
          </p>
          <p className={styles.dropzoneHint}>
            Maksymalnie {MAX_FILES} plików, do 10MB każdy
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_FILE_TYPES.join(',')}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className={styles.hiddenInput}
        />
      </div>

      {files.length > 0 && (
        <div className={styles.fileList}>
          {files.map(fileObj => (
            <div key={fileObj.id} className={styles.fileItem}>
              <div className={styles.filePreview}>
                {fileObj.file.type.startsWith('image/') ? (
                  <img src={fileObj.preview} alt={fileObj.file.name} />
                ) : (
                  <div className={styles.filePlaceholder}>PDF</div>
                )}
              </div>
              <div className={styles.fileDetails}>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName} title={fileObj.file.name}>{fileObj.file.name}</span>
                  <button type="button" className={styles.fileRemove} onClick={() => removeFile(fileObj.id)} aria-label={`Usuń plik ${fileObj.file.name}`}> × </button>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progress} style={{ width: `${fileObj.progress}%` }}></div>
                </div>
                <span className={styles.fileSize}>{(fileObj.file.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
