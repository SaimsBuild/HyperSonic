import { useState } from 'react';
import { Habit } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Check, Circle, Flame, Trophy } from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  onCompleteHabit: (habitId: string) => void;
  onAddHabit: (name: string, daysToFail: number) => void;
  getTodayDateString: () => string;
}

export function HabitTracker({ habits, onCompleteHabit, onAddHabit, getTodayDateString }: HabitTrackerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [daysToFail, setDaysToFail] = useState(3);

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
          <h2 className="text-lg font-semibold">Active Habits</h2>
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
            
            return (
              <div key={habit.id} className="habit-card rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-sm">{habit.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-accent text-black px-2 py-1 rounded-full flex items-center">
                      <Trophy className="w-3 h-3 mr-1" />
                      Level {habit.level}
                    </span>
                    {isCompletedToday ? (
                      <Check className="text-secondary w-5 h-5" />
                    ) : (
                      <button
                        onClick={() => onCompleteHabit(habit.id)}
                        className="text-muted hover:text-white transition-colors"
                      >
                        <Circle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="flex items-center">
                    <Flame className="w-3 h-3 mr-1 text-accent" />
                    {habit.streak} day streak
                  </span>
                  <span>{habit.status}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {habits.length === 0 && (
          <div className="text-center py-8 text-muted">
            <p>No habits yet. Create your first habit to get started!</p>
          </div>
        )}
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-surface border-slate-700">
          <DialogHeader>
            <DialogTitle>Create New Habit</DialogTitle>
          </DialogHeader>
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
