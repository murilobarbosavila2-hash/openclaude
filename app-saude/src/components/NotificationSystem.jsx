import { useEffect, useState } from 'react';
import { useMedication } from '../context/MedicationContext';
import { Bell, BellOff } from 'lucide-react';
import './NotificationSystem.css';

const NotificationSystem = () => {
  const { medications } = useMedication();
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(perm => {
        setPermission(perm);
      });
    }
  };

  useEffect(() => {
    // Basic polling interval to check for medications due (simulated notifications)
    const interval = setInterval(() => {
      if (permission !== 'granted') return;

      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      
      // We also check seconds to avoid spamming the notification during the entire minute
      // Only trigger at the 0th second of the minute
      if (now.getSeconds() === 0) {
        medications.forEach(med => {
          if (med.time === currentTime) {
            new Notification('Hora do seu medicamento!', {
              body: `É hora de tomar ${med.name} ${med.dosage ? `(${med.dosage})` : ''}`,
              icon: '/vite.svg' // Placeholder icon
            });
          }
        });
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [medications, permission]);

  if (permission === 'granted') return null;

  return (
    <div className="notification-banner">
      <div className="notification-content">
        <BellOff size={20} className="notification-icon" />
        <div className="notification-text">
          <strong>Ative as notificações</strong>
          <p>Para não esquecer seus medicamentos</p>
        </div>
      </div>
      <button className="btn-allow" onClick={requestPermission}>
        Permitir
      </button>
    </div>
  );
};

export default NotificationSystem;
