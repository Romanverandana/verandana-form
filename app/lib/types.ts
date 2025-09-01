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
  id: number;
  file: File;
  progress: number;
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
