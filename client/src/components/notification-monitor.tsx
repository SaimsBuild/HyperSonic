import { useEffect, useRef } from 'react';
import { AppData, Habit } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface NotificationMonitorProps {
  appData: AppData;
  getTodayDateString: () => string;
  getTimeUntilMidnight: () => { hours: number; minutes: number };
  isNotificationEnabled: boolean;
}

export function NotificationMonitor({ 
  appData, 
  getTodayDateString,
  getTimeUntilMidnight,
  isNotificationEnabled
}: NotificationMonitorProps) {
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

    if (!isNotificationEnabled) {
      return;
    }

    const checkInterval = setInterval(() => {
      checkHabitBreaking();
      checkGoalProgress();
    }, 60000);

    checkHabitBreaking();
    checkGoalProgress();

    return () => clearInterval(checkInterval);
  }, [appData, isNotificationEnabled, getTodayDateString, getTimeUntilMidnight]);

  const sendPushNotification = async (title: string, body: string, tag?: string) => {
    try {
      await apiRequest('POST', '/api/push/send', {
        title,
        body,
        url: '/',
        tag
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  };

  const checkHabitBreaking = () => {
    const today = getTodayDateString();
    const { hours } = getTimeUntilMidnight();

    appData.habits.forEach((habit: Habit) => {
      if (habit.status !== 'active') return;
      
      const habitCompletedToday = habit.lastCompleted === today;
      
      if (!habitCompletedToday && hours <= 6 && !notifiedHabitsRef.current.has(habit.id)) {
        sendPushNotification(
          '⚠️ Habit at Risk!',
          `"${habit.name}" hasn't been completed yet. Complete it before midnight to maintain your ${habit.streak}-day streak!`,
          `habit-${habit.id}`
        );
        
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
          sendPushNotification(
            '📊 Goals Behind Schedule!',
            `You've only completed ${Math.round(progress)}% of your daily goals with ${hours} hours left. Time to catch up!`,
            'goals-progress'
          );
          
          notifiedGoalsRef.current = true;
        }
      }
    }
  };

  return null;
}
