// lib/types.ts

// Typy dla plików z progresem uploadu
export interface FileWithProgress {
  id: number | string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  preview: string;
  error?: string;
  uploadedUrl?: string;
}

// Typ dla wartości formularza
export interface FormValues {
  name: string;
  email: string;
  phone: string;
  postal: string;
  date: string;
  selectedType: string;
  comment: string;
  consent: boolean;
}

// Typ dla błędów formularza
export interface FormErrors {
  [key: string]: string;
}

// Typ dla stanu formularza
export interface FormState {
  values: FormValues;
  errors: FormErrors;
}

// Typ dla kafelków wyboru typu
export interface TileData {
  value: string;
  title: string;
  desc: string;
  src: string;
  alt: string;
}

// Typ dla powiadomień - może być null lub obiekt
export type NotificationState = {
  show?: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
} | null;

// Typy dla formularza (rozszerzone)
export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  files?: FileWithProgress[];
  consent: boolean;
  submittedAt?: Date;
}

// Typy dla odpowiedzi API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Typy dla uploadu plików
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

// Typy dla statusu formularza
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

// Typy dla walidacji
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Typy dla konfiguracji uploadera
export interface UploaderConfig {
  maxFiles?: number;
  maxFileSize?: number; // w bajtach
  acceptedFileTypes?: string[];
  uploadEndpoint?: string;
  simultaneousUploads?: number;
}

// Typy dla eventów
export interface UploadEvent {
  type: 'start' | 'progress' | 'complete' | 'error';
  fileId: string;
  progress?: number;
  error?: string;
  result?: UploadResponse;
}

// Pomocnicze typy
export type FileStatus = FileWithProgress['status'];

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// Typy dla komponentów
export interface FileUploaderProps {
  onFilesChange?: (files: FileWithProgress[]) => void;
  onUploadComplete?: (urls: string[]) => void;
  onError?: (error: string) => void;
  config?: UploaderConfig;
  className?: string;
  disabled?: boolean;
}

export interface FormFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'number' | 'textarea';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Eksport domyślnych wartości
export const DEFAULT_UPLOADER_CONFIG: UploaderConfig = {
  maxFiles: 5,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedFileTypes: ['image/*', 'application/pdf', '.doc', '.docx'],
  uploadEndpoint: '/api/upload',
  simultaneousUploads: 3,
};

// Pomocnicze funkcje typów (type guards)
export const isFileWithProgress = (obj: any): obj is FileWithProgress => {
  return obj && typeof obj === 'object' && 'file' in obj && 'progress' in obj && 'status' in obj;
};

export const isUploadResponse = (obj: any): obj is UploadResponse => {
  return obj && typeof obj === 'object' && 'url' in obj && 'filename' in obj;
};
