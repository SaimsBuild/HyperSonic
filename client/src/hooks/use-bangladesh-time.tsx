import { useState, useEffect } from 'react';

export function useBangladeshTime() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const getBangladeshTime = () => {
    // Get current UTC time
    const now = new Date();
    // Convert to Bangladesh time (UTC+6)
    const bangladeshTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    return bangladeshTime;
  };

  const getTodayDateString = () => {
    const bangladeshTime = getBangladeshTime();
    // Format as YYYY-MM-DD in Bangladesh timezone
    const year = bangladeshTime.getFullYear();
    const month = String(bangladeshTime.getMonth() + 1).padStart(2, '0');
    const day = String(bangladeshTime.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTimeUntilMidnight = () => {
    const now = getBangladeshTime();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
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
    getTimeUntilMidnight,
  };
}
