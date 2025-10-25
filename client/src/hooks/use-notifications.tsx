import { useState, useEffect } from 'react';

export type NotificationPermission = 'default' | 'granted' | 'denied';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission as NotificationPermission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return 'denied';
    }

    const result = await Notification.requestPermission();
    setPermission(result as NotificationPermission);
    return result;
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return null;
    }

    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
      
      return notification;
    } else if (Notification.permission === 'default') {
      requestPermission().then((result) => {
        if (result === 'granted') {
          new Notification(title, {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            ...options,
          });
        }
      });
    }
    
    return null;
  };

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported: 'Notification' in window,
  };
}
