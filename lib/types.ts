export interface FileWithProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}
// Dodaj te typy do istniejącego pliku types.ts:

export interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
  type: string;
  files: FileWithProgress[];
}

export interface TileData {
  id: string;
  label: string;
  icon: string;
}

export interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}
