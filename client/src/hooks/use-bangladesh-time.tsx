import { useState, useEffect } from 'react';

export function useBangladeshTime() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const getBangladeshTime = () => {
    // Get current UTC time and add 6 hours for Bangladesh time (UTC+6)
    const now = new Date();
    const bangladeshTime = new Date(now.getTime() + (6 * 60 * 60 * 1000));
    return bangladeshTime;
  };

  const getTodayDateString = () => {
    const bangladeshTime = getBangladeshTime();
    // Format as YYYY-MM-DD in Bangladesh timezone
    const year = bangladeshTime.getUTCFullYear();
    const month = String(bangladeshTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(bangladeshTime.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTimeUntilMidnight = () => {
    const now = getBangladeshTime();
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    
    const timeDiff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  const updateTimeDisplay = () => {
    const now = getBangladeshTime();
    
    setCurrentTime(now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }));
    
    setCurrentDate(now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    }));
  };

  useEffect(() => {
    updateTimeDisplay();
    
    // Update time every minute
    const interval = setInterval(updateTimeDisplay, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    currentTime,
    currentDate,
    getBangladeshTime,
    getTodayDateString,
    getTimeUntilMidnight,
  };
}
