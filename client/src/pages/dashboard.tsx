import { useState, useEffect } from 'react';
import { useBangladeshTime } from '@/hooks/use-bangladesh-time';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { AppData, DailyGoal, Habit } from '@shared/schema';
import { HexagonProgress } from '@/components/hexagon-progress';
import { DailyGoals } from '@/components/daily-goals';
import { HabitTracker } from '@/components/habit-tracker';
import { ActivityCalendar } from '@/components/activity-calendar';
import { UrgeBreaker } from '@/components/urge-breaker';
import { Zap, RotateCcw } from 'lucide-react';

const initialAppData: AppData = {
  dailyGoals: [],
  habits: [],
  activityLog: {},
  lastResetDate: '',
};

export default function Dashboard() {
  const { currentTime, currentDate, getTodayDateString, getTimeUntilMidnight } = useBangladeshTime();
  const [appData, setAppData] = useLocalStorage<AppData>('hypersonic-data', initialAppData);
  const [showUrgeBreaker, setShowUrgeBreaker] = useState(false);

  // Check for daily reset at midnight Bangladesh time
  useEffect(() => {
    const checkDailyReset = () => {
      const today = getTodayDateString();
      
      if (appData.lastResetDate !== today) {
        console.log(`Daily reset triggered: ${appData.lastResetDate} -> ${today}`);
        
        // Reset daily goals by clearing completed status
        const resetGoals = appData.dailyGoals.map(goal => ({
          ...goal,
          completed: false
        }));
        
        setAppData(prev => ({
          ...prev,
          dailyGoals: resetGoals,
          lastResetDate: today
        }));
      }
    };

    // Check immediately
    checkDailyReset();
    
    // Check every minute for date change (especially around midnight)
    const interval = setInterval(checkDailyReset, 60000);
    
    return () => clearInterval(interval);
  }, [getTodayDateString, appData.lastResetDate, appData.dailyGoals, setAppData]);

  // Calculate progress
  const calculateProgress = () => {
    const completedGoals = appData.dailyGoals.filter(goal => goal.completed).length;
    const totalGoals = appData.dailyGoals.length;
    const today = getTodayDateString();
    const completedHabits = appData.habits.filter(habit => habit.lastCompleted === today).length;
    
    const goalProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 60 : 0;
    const habitProgress = appData.habits.length > 0 ? (completedHabits / appData.habits.length) * 40 : 0;
    
    const totalProgress = Math.min(goalProgress + habitProgress, 100);
    
    return {
      totalProgress: Math.round(totalProgress),
      completedGoals,
      totalGoals,
      completedHabits,
      totalTasks: completedGoals + completedHabits
    };
  };

  const { totalProgress, completedGoals, totalGoals, completedHabits, totalTasks } = calculateProgress();

  // Calculate streak (consecutive days with activity)
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date(getTodayDateString());
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (appData.activityLog[dateStr] && appData.activityLog[dateStr].level > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const updateActivityLog = (progress: number) => {
    const today = getTodayDateString();
    let activityLevel = 1;
    
    if (progress >= 80) activityLevel = 3;
    else if (progress >= 50) activityLevel = 2;
    
    setAppData(prev => ({
      ...prev,
      activityLog: {
        ...prev.activityLog,
        [today]: {
          date: today,
          level: activityLevel,
          goalsCompleted: completedGoals,
          habitsCompleted: completedHabits,
          urgeTasksCompleted: 0
        }
      }
    }));
  };

  useEffect(() => {
    updateActivityLog(totalProgress);
  }, [totalProgress, completedGoals, completedHabits]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="bg-surface border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">HyperSonic</h1>
              <p className="text-sm text-muted">Self-Discipline Tracker</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-lg font-semibold text-white">{currentTime}</div>
              <div className="text-sm text-muted">{currentDate}</div>
              <div className="text-xs text-accent mt-1">
                {(() => {
                  const { hours, minutes } = getTimeUntilMidnight();
                  return `Reset in: ${hours}h ${minutes}m`;
                })()}
              </div>
            </div>
            <button
              onClick={() => {
                // Manual reset for testing
                const today = getTodayDateString();
                const resetGoals = appData.dailyGoals.map(goal => ({
                  ...goal,
                  completed: false
                }));
                setAppData(prev => ({
                  ...prev,
                  dailyGoals: resetGoals,
                  lastResetDate: today
                }));
                console.log('Manual reset triggered');
              }}
              className="p-2 text-muted hover:text-accent transition-colors"
              title="Test Reset Goals"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Hexagon Progress & Daily Goals */}
          <div className="lg:col-span-1 space-y-6">
            {/* Hexagon Progress */}
            <div className="bg-surface rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold mb-6 text-center">Today's Progress</h2>
              
              <HexagonProgress 
                progress={totalProgress}
                completedTasks={totalTasks}
                streak={calculateStreak()}
              />
            </div>

            {/* Daily Goals */}
            <DailyGoals
              goals={appData.dailyGoals}
              onToggleGoal={(goalId) => {
                const updatedGoals = appData.dailyGoals.map(goal =>
                  goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
                );
                setAppData(prev => ({ ...prev, dailyGoals: updatedGoals }));
              }}
              onAddGoal={(text) => {
                const newGoal: DailyGoal = {
                  id: Date.now().toString(),
                  text,
                  completed: false,
                  createdAt: new Date().toISOString()
                };
                setAppData(prev => ({ ...prev, dailyGoals: [...prev.dailyGoals, newGoal] }));
              }}
              completedGoals={completedGoals}
              totalGoals={totalGoals}
            />

            {/* Urge Breaker Button */}
            <div 
              className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 border border-red-500 cursor-pointer hover:from-red-700 hover:to-red-800 transition-all"
              onClick={() => setShowUrgeBreaker(true)}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="text-lg font-semibold text-white">Urge Breaker</h3>
                <p className="text-sm text-red-100">Need help staying disciplined?</p>
              </div>
            </div>
          </div>

          {/* Middle Column: Habits & Calendar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Habits */}
            <HabitTracker
              habits={appData.habits}
              onCompleteHabit={(habitId) => {
                const today = getTodayDateString();
                const updatedHabits = appData.habits.map(habit => {
                  if (habit.id === habitId && habit.lastCompleted !== today) {
                    const newStreak = habit.streak + 1;
                    return {
                      ...habit,
                      lastCompleted: today,
                      streak: newStreak,
                      level: Math.floor(newStreak / 7) + 1
                    };
                  }
                  return habit;
                });
                setAppData(prev => ({ ...prev, habits: updatedHabits }));
              }}
              onAddHabit={(name, daysToFail) => {
                const newHabit: Habit = {
                  id: Date.now().toString(),
                  name,
                  streak: 0,
                  level: 1,
                  lastCompleted: null,
                  daysToFail,
                  status: 'active',
                  createdAt: new Date().toISOString()
                };
                setAppData(prev => ({ ...prev, habits: [...prev.habits, newHabit] }));
              }}
              onRemoveHabit={(habitId) => {
                const updatedHabits = appData.habits.filter(habit => habit.id !== habitId);
                setAppData(prev => ({ ...prev, habits: updatedHabits }));
              }}
              getTodayDateString={getTodayDateString}
            />

            {/* Calendar */}
            <ActivityCalendar
              activityLog={appData.activityLog}
              getTodayDateString={getTodayDateString}
            />
          </div>
        </div>
      </div>

      {/* Urge Breaker Modal */}
      <UrgeBreaker
        isOpen={showUrgeBreaker}
        onClose={() => setShowUrgeBreaker(false)}
        onCompleteTask={(taskText) => {
          // Update activity log with urge task completion
          const today = getTodayDateString();
          setAppData(prev => ({
            ...prev,
            activityLog: {
              ...prev.activityLog,
              [today]: {
                ...prev.activityLog[today],
                urgeTasksCompleted: (prev.activityLog[today]?.urgeTasksCompleted || 0) + 1
              }
            }
          }));
          setShowUrgeBreaker(false);
        }}
      />
    </div>
  );
}
