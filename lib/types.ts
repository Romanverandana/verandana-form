// lib/types.ts
export interface FormState {
  values: {
    name: string;
    email: string;
    phone: string;
    postal: string;
    date: string;
    selectedType: string;
    comment: string;
    consent: boolean;
  };
  errors: Partial<Record<keyof FormState['values'], string>>;
}

export interface FileWithProgress {
  id: string;
  file: File;
  progress: number;
  preview?: string;
  status?: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface TileData {
  value: string;
  title: string;
  desc: string;
  src: string;
  alt: string;
}

export type NotificationType = 'success' | 'error' | null;

export interface NotificationState {
  type: NotificationType;
  message: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  fileId?: string;
  error?: string;
}

export interface FormData {
  name: string;
  email: string;
  message: string;
  files: File[];
}
