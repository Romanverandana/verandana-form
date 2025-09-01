'use client';
import { NotificationState } from '@/lib/types';
import styles from '@/app/page.module.css';

interface NotificationProps {
  notification: NotificationState | null;
  onClose: () => void;
}

export default function Notification({ notification, onClose }: NotificationProps) {
  if (!notification || !notification.message) return null;

  return (
    <div className={`${styles.notification} ${styles[notification.type || '']}`}>
      <p>{notification.message}</p>
      <button onClick={onClose} aria-label="Zamknij powiadomienie">×</button>
    </div>
  );
}
