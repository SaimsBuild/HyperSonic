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
    
    // Format time manually using UTC methods since we've adjusted to Bangladesh time
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    setCurrentTime(`${displayHours}:${String(minutes).padStart(2, '0')} ${ampm}`);
    
    // Format date manually 
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    setCurrentDate(`${weekdays[now.getUTCDay()]}, ${months[now.getUTCMonth()]} ${now.getUTCDate()}, ${now.getUTCFullYear()}`);
  };

  useEffect(() => {
    updateTimeDisplay();
    
    // Update time every second for precise timing around midnight
    const interval = setInterval(updateTimeDisplay, 1000);
    
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
