/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'client' | 'trainer' | 'nutritionist' | 'assessment_expert' | 'admin' | 'system';

export interface User {
  id: string;
  full_name: string;
  role: Role;
  mobile: string;
  email?: string;
  avatarUrl?: string;
  specialties?: string[];
  bio?: string;
  rating?: number;
  reviewCount?: number;
  city?: string;
  certifications?: string[];
  availability?: string[];
  sessionCount?: number;
}

export interface Exercise {
  name: string;
  details: string;
}

export interface SessionExercise {
  id: string;
  name: string;
  instructions: string;
  client_completed: boolean;
}

export interface TrainingSession {
  id: string;
  session_name: string;
  session_type: 'strength' | 'yoga' | 'nutrition' | 'cardio' | 'recovery';
  trainer_name: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_url?: string;
  trainer_note?: string;
  status: 'scheduled' | 'completed';
  exercises: SessionExercise[];
}

export interface Activity {
  id: string;
  title: string;
  category: string;
  time: string;
  status: 'completed' | 'pending' | 'missed';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'alert' | 'success' | 'reminder';
  isRead: boolean;
  actionType?: 'session_detail' | 'check_in' | 'plan_update';
}

export interface ProgressMetric {
  label: string;
  current: number;
  target: number;
  unit: string;
}

export interface HealthProfile {
  dob: string; // ISO 8601
  age: number;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  height_cm: number;
  heightDisplayUnit: 'cm' | 'ft/in';
  weight_kg: number;
  weightDisplayUnit: 'kg' | 'lbs';
  city: string;
  goals_json: string[];
  healthconditions_json: string[];
  activity_level: number;
  fitness_level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface TrainingProgram {
  program_id: string;
  trainer: {
    trainer_id: string;
    full_name: string;
    photo_url: string;
    specialisations: string[];
  };
  program_name: string;
  duration_weeks: number;
  sessions_per_week: number;
  goals: string[];
  client_approval_status: 'pending' | 'approved' | 'changes_requested';
  created_at: string;
  client_notes?: string;
  client_notes_submitted_at?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence?: 'High' | 'Low' | 'Medium';
}

export type MealType = string;

export interface MealLog {
  type: MealType;
  items: FoodItem[];
  time: string;
}

export interface NutritionLog {
  date: string;
  meals: MealLog[];
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface MealEntry {
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  description: string;
  time: string;
  image_url?: string;
}

export interface DailyTrackingLog {
  log_date: string;
  water_litres: number;
  steps_manual: number | null;
  steps_wearable?: number | null;
  sleep_hours: number | null;
  bedtime?: string | null;
  waketime?: string | null;
  sleep_quality_score?: number | null;
  mood_score: number | null;
  energy_level?: number | null;
  pain_score?: number | null;
  mobility_score?: number | null;
  trainer_note?: string;
  meals: MealEntry[];
  last_wearable_sync?: string;
}

export type WeeklyReportStatus = 'available' | 'generating' | 'no_data';

export interface WeeklyReportMetricTrend {
  day_offset: number; // 0 for Mon, 6 for Sun
  value: number;
}

export interface WeeklyReport {
  week_number: number;
  start_date: string;
  end_date: string;
  status: WeeklyReportStatus;
  averages: {
    readiness: number;
    sleep_hours: number;
    water_litres: number;
    mood_score: number;
    energy_level: number;
    pain_score: number;
    mobility_score: number;
    steps: number;
  };
  trends: {
    best_day: string;
    consistent_metric: string;
    sleep: WeeklyReportMetricTrend[];
    water: WeeklyReportMetricTrend[];
    mood: WeeklyReportMetricTrend[];
    energy: WeeklyReportMetricTrend[];
    pain: WeeklyReportMetricTrend[];
    mobility: WeeklyReportMetricTrend[];
    steps: WeeklyReportMetricTrend[];
  };
  daily_readiness: {
    day: string;
    score: number | null;
  }[];
  trainer_week_note?: string;
  client_reflection?: string;
  client_viewed: boolean;
  client_viewed_at?: string;
}
