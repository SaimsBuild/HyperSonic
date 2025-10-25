import { useEffect, useRef } from 'react';
import { AppData, Habit } from '@shared/schema';
import { useNotifications } from '@/hooks/use-notifications';

interface NotificationMonitorProps {
  appData: AppData;
  getTodayDateString: () => string;
  getTimeUntilMidnight: () => { hours: number; minutes: number };
}

export function NotificationMonitor({ 
  appData, 
  getTodayDateString,
  getTimeUntilMidnight 
}: NotificationMonitorProps) {
  const { sendNotification, permission } = useNotifications();
  const notifiedHabitsRef = useRef<Set<string>>(new Set());
  const notifiedGoalsRef = useRef<boolean>(false);
  const lastCheckDateRef = useRef<string>('');

  useEffect(() => {
    const today = getTodayDateString();
    
    if (lastCheckDateRef.current !== today) {
      notifiedHabitsRef.current.clear();
      notifiedGoalsRef.current = false;
      lastCheckDateRef.current = today;
    }

    if (permission !== 'granted') {
      return;
    }

    const checkInterval = setInterval(() => {
      checkHabitBreaking();
      checkGoalProgress();
    }, 60000);

    checkHabitBreaking();
    checkGoalProgress();

    return () => clearInterval(checkInterval);
  }, [appData, permission, getTodayDateString, getTimeUntilMidnight]);

  const checkHabitBreaking = () => {
    const today = getTodayDateString();
    const { hours } = getTimeUntilMidnight();

    appData.habits.forEach((habit: Habit) => {
      if (habit.status !== 'active') return;
      
      const habitCompletedToday = habit.lastCompleted === today;
      
      if (!habitCompletedToday && hours <= 6 && !notifiedHabitsRef.current.has(habit.id)) {
        sendNotification('⚠️ Habit at Risk!', {
          body: `"${habit.name}" hasn't been completed yet. Complete it before midnight to maintain your ${habit.streak}-day streak!`,
          tag: `habit-${habit.id}`,
          requireInteraction: false,
        });
        
        notifiedHabitsRef.current.add(habit.id);
      }
    });
  };

  const checkGoalProgress = () => {
    const { hours } = getTimeUntilMidnight();
    
    if (hours <= 5 && !notifiedGoalsRef.current) {
      const completedGoals = appData.dailyGoals.filter(goal => goal.completed).length;
      const totalGoals = appData.dailyGoals.length;
      
      if (totalGoals > 0) {
        const progress = (completedGoals / totalGoals) * 100;
        
        if (progress < 50) {
          sendNotification('📊 Goals Behind Schedule!', {
            body: `You've only completed ${Math.round(progress)}% of your daily goals with ${hours} hours left. Time to catch up!`,
            tag: 'goals-progress',
            requireInteraction: false,
          });
          
          notifiedGoalsRef.current = true;
        }
      }
    }
  };

  return null;
}
