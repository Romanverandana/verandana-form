'use client';
import { NotificationState } from '../lib/types';
import styles from '../app/page.module.css';

interface NotificationProps {
  notification: NotificationState | null;
  onClose: () => void;
}

export default function Notification({ notification, onClose }: NotificationProps) {
  if (!notification || !notification.message) return null;
  const notificationTypeClass = notification.type ? styles[notification.type] : '';
  return (
    <div className={`${styles.notification} ${notificationTypeClass}`}>
      <p>{notification.message}</p>
      <button onClick={onClose} aria-label="Zamknij powiadomienie">×</button>
    </div>
  );
}