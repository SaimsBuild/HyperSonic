import { useState, useEffect } from 'react';
import { ActivityLogEntry } from '@shared/schema';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityCalendarProps {
  activityLog: Record<string, ActivityLogEntry>;
  getTodayDateString: () => string;
}

export function ActivityCalendar({ activityLog, getTodayDateString }: ActivityCalendarProps) {
  // Use Bangladesh time for calendar display  
  const getBangladeshDate = () => {
    const now = new Date();
    // Add 6 hours to UTC time for Bangladesh time (UTC+6)
    const bangladeshTime = new Date(now.getTime() + (6 * 60 * 60 * 1000));
    return bangladeshTime;
  };
  
  const [currentDate, setCurrentDate] = useState(() => {
    const bdTime = getBangladeshDate();
    // Set to first day of current month in Bangladesh time
    return new Date(bdTime.getUTCFullYear(), bdTime.getUTCMonth(), 1);
  });

  // Update calendar when date changes (especially at midnight)
  useEffect(() => {
    const updateCalendar = () => {
      const bdTime = getBangladeshDate();
      const currentMonthYear = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const bangladeshMonthYear = new Date(bdTime.getUTCFullYear(), bdTime.getUTCMonth(), 1);
      
      // If we're viewing the current month but the month has changed in Bangladesh time
      if (currentMonthYear.getTime() !== bangladeshMonthYear.getTime() && 
          currentDate.getFullYear() === bdTime.getUTCFullYear() && 
          Math.abs(currentDate.getMonth() - bdTime.getUTCMonth()) <= 1) {
        setCurrentDate(bangladeshMonthYear);
      }
    };

    const interval = setInterval(updateCalendar, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [currentDate, getBangladeshDate]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
  };

  // Calculate days remaining in current month
  const getDaysRemainingInMonth = () => {
    const now = getBangladeshDate();
    const lastDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
    const daysRemaining = lastDayOfMonth.getUTCDate() - now.getUTCDate();
    return daysRemaining;
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = getTodayDateString();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const isCurrentMonth = date.getMonth() === month;
      const isToday = dateStr === today;
      const activity = activityLog[dateStr];
      
      let activityClass = '';
      if (activity) {
        if (activity.level === 3) activityClass = 'high-activity';
        else if (activity.level === 2) activityClass = 'medium-activity';
        else if (activity.level === 1) activityClass = 'low-activity';
      }
      
      days.push(
        <div
          key={dateStr}
          className={`calendar-day text-sm ${
            isCurrentMonth ? '' : 'text-muted opacity-50'
          } ${isToday ? 'today ring-2 ring-primary' : ''} ${activityClass}`}
        >
          {date.getDate()}
        </div>
      );
    }
    
    return days;
  };

  const daysRemaining = getDaysRemainingInMonth();

  return (
    <div className="bg-surface rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Activity Calendar</h2>
          <div className="flex items-center mt-1 text-sm text-accent">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="font-medium">{daysRemaining} days left in {monthNames[getBangladeshDate().getUTCMonth()]}</span>
          </div>
          <div className="text-xs text-muted mt-1">
            Bangladesh Date: {getBangladeshDate().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={previousMonth}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-slate-700 text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium px-3">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <Button
            onClick={nextMonth}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-slate-700 text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => {
              // Test: simulate next day in Bangladesh
              const bdTime = getBangladeshDate();
              const nextDay = new Date(bdTime);
              nextDay.setDate(nextDay.getDate() + 1);
              setCurrentDate(new Date(nextDay.getFullYear(), nextDay.getMonth(), 1));
            }}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-slate-700 text-yellow-400"
            title="Test: Simulate Next Day"
          >
            +1D
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-4">
        {renderCalendar()}
      </div>
      
      <div className="flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gradient-to-r from-secondary to-green-600 rounded mr-2"></div>
          <span className="text-muted">High Activity</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gradient-to-r from-accent to-yellow-600 rounded mr-2"></div>
          <span className="text-muted">Medium Activity</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gradient-to-r from-muted to-slate-600 rounded mr-2"></div>
          <span className="text-muted">Low Activity</span>
        </div>
      </div>
    </div>
  );
}
