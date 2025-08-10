import { z } from "zod";

export const DailyGoalSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
  createdAt: z.string(),
});

export const HabitSchema = z.object({
  id: z.string(),
  name: z.string(),
  streak: z.number(),
  level: z.number(),
  lastCompleted: z.string().nullable(),
  daysToFail: z.number(),
  status: z.enum(['active', 'failed']),
  createdAt: z.string(),
});

export const UrgeTaskSchema = z.object({
  id: z.string(),
  icon: z.string(),
  text: z.string(),
  type: z.enum(['exercise', 'physical', 'mental']),
});

export const ActivityLogEntrySchema = z.object({
  date: z.string(),
  level: z.number(), // 1-3 (low, medium, high)
  goalsCompleted: z.number(),
  habitsCompleted: z.number(),
  urgeTasksCompleted: z.number(),
});

export const AppDataSchema = z.object({
  dailyGoals: z.array(DailyGoalSchema),
  habits: z.array(HabitSchema),
  activityLog: z.record(z.string(), ActivityLogEntrySchema),
  lastResetDate: z.string(),
});

export type DailyGoal = z.infer<typeof DailyGoalSchema>;
export type Habit = z.infer<typeof HabitSchema>;
export type UrgeTask = z.infer<typeof UrgeTaskSchema>;
export type ActivityLogEntry = z.infer<typeof ActivityLogEntrySchema>;
export type AppData = z.infer<typeof AppDataSchema>;

export const insertDailyGoalSchema = DailyGoalSchema.omit({ id: true, createdAt: true });
export const insertHabitSchema = HabitSchema.omit({ id: true, createdAt: true, level: true, streak: true });

export type InsertDailyGoal = z.infer<typeof insertDailyGoalSchema>;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
