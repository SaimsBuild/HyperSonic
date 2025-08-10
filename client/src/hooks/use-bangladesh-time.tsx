import { useState, useEffect } from 'react';

export function useBangladeshTime() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const getBangladeshTime = () => {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
  };

  const getTodayDateString = () => {
    return getBangladeshTime().toISOString().split('T')[0];
  };

  const updateTimeDisplay = () => {
    const now = getBangladeshTime();
    
    setCurrentTime(now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Dhaka'
    }));
    
    setCurrentDate(now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      timeZone: 'Asia/Dhaka'
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
  };
}
