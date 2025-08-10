import { useState, useEffect } from 'react';
import { Habit } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Check, Circle, Flame, Trophy, Crown, Star } from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  onCompleteHabit: (habitId: string) => void;
  onAddHabit: (name: string, daysToFail: number) => void;
  onRemoveHabit: (habitId: string) => void;
  getTodayDateString: () => string;
}

export function HabitTracker({ habits, onCompleteHabit, onAddHabit, onRemoveHabit, getTodayDateString }: HabitTrackerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [daysToFail, setDaysToFail] = useState(3);

  // Check for failed habits and remove them automatically
  useEffect(() => {
    const today = getTodayDateString();
    const todayDate = new Date(today);
    
    habits.forEach(habit => {
      if (habit.lastCompleted) {
        const lastCompletedDate = new Date(habit.lastCompleted);
        const daysDifference = Math.floor((todayDate.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Remove habit if not completed for 3 consecutive days
        if (daysDifference >= 3 && habit.status === 'active') {
          onRemoveHabit(habit.id);
        }
      } else {
        // If habit was never completed and created more than 3 days ago
        const createdDate = new Date(habit.createdAt);
        const daysSinceCreated = Math.floor((todayDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceCreated >= 3) {
          onRemoveHabit(habit.id);
        }
      }
    });
  }, [habits, getTodayDateString, onRemoveHabit]);

  const handleAddHabit = () => {
    if (habitName.trim()) {
      onAddHabit(habitName.trim(), daysToFail);
      setHabitName('');
      setDaysToFail(3);
      setShowAddModal(false);
    }
  };

  return (
    <>
      <div className="bg-surface rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Active Habits</h2>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-blue-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Habit
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map(habit => {
            const isCompletedToday = habit.lastCompleted === getTodayDateString();
            const is21DayStreak = habit.streak >= 21;
            
            return (
              <div key={habit.id} className={`habit-card rounded-lg p-4 ${is21DayStreak ? 'habit-mastery' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-sm flex items-center text-white">
                    {habit.name}
                    {is21DayStreak && (
                      <Crown className="w-4 h-4 ml-2 text-yellow-400 animate-pulse" />
                    )}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                      is21DayStreak 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold' 
                        : 'bg-accent text-black'
                    }`}>
                      {is21DayStreak ? (
                        <Star className="w-3 h-3 mr-1" />
                      ) : (
                        <Trophy className="w-3 h-3 mr-1" />
                      )}
                      {is21DayStreak ? 'Master' : `Level ${habit.level}`}
                    </span>
                    {isCompletedToday ? (
                      <Check className="text-secondary w-5 h-5" />
                    ) : (
                      <button
                        onClick={() => onCompleteHabit(habit.id)}
                        className="text-white hover:text-accent transition-colors"
                      >
                        <Circle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-white">
                  <span className="flex items-center">
                    <Flame className={`w-3 h-3 mr-1 ${is21DayStreak ? 'text-yellow-400' : 'text-accent'}`} />
                    <span className={is21DayStreak ? 'text-yellow-400 font-semibold' : ''}>
                      {habit.streak} day streak
                    </span>
                    {is21DayStreak && (
                      <span className="ml-2 text-yellow-400 font-bold">🏆</span>
                    )}
                  </span>
                  <span>{habit.status}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {habits.length === 0 && (
          <div className="text-center py-8 text-white">
            <p>No habits yet. Create your first habit to get started!</p>
          </div>
        )}
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-surface border-slate-700" aria-describedby="add-habit-description">
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
          </DialogHeader>
          <p id="add-habit-description" className="sr-only">Create a new habit that you want to track daily. Set the number of days after which the habit will be automatically removed if not maintained.</p>
          <div className="space-y-4">
            <Input
              placeholder="Habit name (e.g., Read 10 pages)"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder-muted"
            />
            <Input
              type="number"
              placeholder="Days to fail (default: 3)"
              min="1"
              max="30"
              value={daysToFail}
              onChange={(e) => setDaysToFail(parseInt(e.target.value) || 3)}
              className="bg-slate-800 border-slate-600 text-white placeholder-muted"
            />
            <div className="flex space-x-3">
              <Button
                onClick={handleAddHabit}
                className="flex-1 bg-primary hover:bg-blue-600 text-white"
              >
                Create Habit
              </Button>
              <Button
                onClick={() => {
                  setShowAddModal(false);
                  setHabitName('');
                  setDaysToFail(3);
                }}
                variant="outline"
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
