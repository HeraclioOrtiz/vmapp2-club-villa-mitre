// Gym Service Types - API v2.0
// Based on new hierarchical assignment system
// Updated: October 2025

// Professor information
export interface Professor {
  id: number;
  name: string;
  email: string;
}

// Template assignment from professor to student
export interface TemplateAssignment {
  id: number;
  daily_template: DailyTemplate;
  start_date: string; // YYYY-MM-DD
  end_date: string | null; // YYYY-MM-DD or null for indefinite
  frequency: number[]; // Array of day numbers: 0=Sunday, 1=Monday, ..., 6=Saturday
  frequency_days: string[]; // e.g., ["Lunes", "Miércoles", "Viernes"]
  professor_notes: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  assigned_by: {
    id: number;
    name: string;
    email?: string;
  };
  created_at: string; // ISO 8601
}

// Daily template information
export interface DailyTemplate {
  id: number;
  title: string;
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'general' | 'weight_loss' | 'cardio' | 'flexibility';
  level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration_min: number;
  tags: string[];
  exercises_count: number;
  created_at?: string; // ISO 8601
}

// Student templates response
export interface StudentTemplatesResponse {
  professor: Professor;
  templates: TemplateAssignment[];
}

export interface WeeklyPlan {
  week_start: string; // YYYY-MM-DD
  week_end: string;   // YYYY-MM-DD
  days: DayOverview[];
}

export interface DayOverview {
  date: string;        // YYYY-MM-DD format
  day_name: string;    // Full day name in English (e.g., "Monday")
  day_short: string;   // Short day name (e.g., "Mon")
  day_number: number;  // 0=Sunday, 1=Monday, ..., 6=Saturday
  has_workouts: boolean;
  assignments: DayAssignment[];
}

export interface DayAssignment {
  id: number;
  daily_template: {
    id: number;
    title: string;
    goal: string;
    level: string;
    estimated_duration_min: number;
  };
  professor_notes: string;
  assigned_by: {
    name: string;
  };
}

export interface DailyWorkout {
  title: string | null;
  exercises: Exercise[];
}

export interface Exercise {
  id: number;
  name: string;
  order: number;
  target_muscle_groups?: string[]; // Array of muscle groups
  muscle_group?: string; // Legacy support
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
  instructions?: string;
  sets: Set[];
  notes?: string;
}

export interface Set {
  id: number;             // ID único del set
  set_number: number;     // Número de la serie (1, 2, 3, ...)
  reps_min?: number;      // Reps mínimas del rango
  reps_max?: number;      // Reps máximas del rango
  reps?: string;          // Legacy: e.g., "8-10" or "12"
  rpe_target?: number;    // RPE scale 1.0-10.0
  rest_seconds: number;   // Rest time in seconds
  tempo?: string;         // e.g., "3-1-1" (eccentric-pause-concentric)
  weight?: number | null; // Peso sugerido (LEGACY - usar weight_target)
  weight_min?: number | null;    // Peso mínimo recomendado (kg)
  weight_max?: number | null;    // Peso máximo recomendado (kg)
  weight_target?: number | null; // Peso objetivo/sugerido (kg)
  duration?: number | null; // Duración en segundos (puede ser null)
  notes?: string | null;
}

// Alias for backward compatibility
export type ExerciseSet = Set;

// UI State types
export interface GymState {
  currentWeek: WeeklyPlan | null;
  todayWorkout: DailyWorkout | null;
  selectedDate: string;
  loading: boolean;
  error: string | null;
  workoutSummary: WorkoutSummary | null;
}

// Error types for gym service
export interface GymError {
  code: 'NETWORK_ERROR' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'SERVER_ERROR' | 'UNKNOWN_ERROR' | 'NO_ASSIGNMENT' | 'VALIDATION_ERROR';
  message: string;
  details?: any;
  userMessage?: string; // User-friendly message for UI
  retryable?: boolean; // Whether the error can be retried
}

// Workout status types for better UX
export type WorkoutStatus = 
  | 'loading'
  | 'no_assignment' 
  | 'rest_day'
  | 'workout_available'
  | 'error'
  | 'network_error';

// Enhanced workout summary for better state management
export interface WorkoutSummary {
  status: WorkoutStatus;
  hasWorkout: boolean;
  title: string | null;
  exerciseCount: number;
  message?: string; // Status message for UI
  canRetry?: boolean; // Whether user can retry loading
}

// Navigation types
export type GymStackParamList = {
  GymHome: undefined;
  WeeklyPlan: undefined;
  DailyWorkout: { date?: string };
  ExerciseDetail: { exercise: Exercise };
};

// API Response types (matching backend)
export interface ApiWeeklyPlanResponse {
  week_start: string | null;
  week_end: string | null;
  days: {
    weekday: number;
    date: string;
    has_session: boolean;
    title: string | null;
  }[];
}

export interface ApiDailyWorkoutResponse {
  title: string | null;
  exercises: {
    name: string;
    order: number;
    sets: {
      reps: string;
      rest_seconds: number;
      tempo?: string;
      rpe_target?: number;
      notes?: string;
    }[];
    notes?: string;
  }[];
}

// ===== NEW: Session Progress Types =====

// Session status
export type SessionStatus = 'pending' | 'completed' | 'skipped' | 'cancelled';

// Session information
export interface WorkoutSession {
  id: number;
  assignment_id: number;
  scheduled_date: string; // YYYY-MM-DD
  status: SessionStatus;
  completed_at?: string | null; // ISO 8601
  student_notes?: string | null;
  professor_feedback?: string | null;
  rating?: number | null; // 1.0 - 5.0
  created_at: string; // ISO 8601
}

// Extended session with workout details
export interface WorkoutSessionDetails extends WorkoutSession {
  template_title: string;
  duration_seconds: number;
  start_time: string; // ISO 8601
  exercises: {
    id: number;
    name: string;
    completed: boolean;
    sets: {
      id: number;
      set_number: number;
      reps_completed: number;
      weight?: number | null; // LEGACY
      weight_min?: number | null;
      weight_max?: number | null;
      weight_target?: number | null;
      rpe_actual?: number | null;
      completed: boolean;
      notes?: string | null;
    }[];
  }[];
}

// Progress for a single set
export interface SetProgress {
  set_number: number;
  reps_completed: number;
  weight?: number | null; // LEGACY
  weight_min?: number | null;
  weight_max?: number | null;
  weight_target?: number | null;
  rpe_actual?: number | null; // Actual RPE perceived by student
  notes?: string | null;
}

// Progress for a single exercise
export interface ExerciseProgress {
  exercise_id: number;
  sets: SetProgress[];
}

// Complete session request
export interface CompleteSessionRequest {
  exercise_progress: ExerciseProgress[];
  student_notes?: string | null;
  completed_at: string; // ISO 8601
}

// ✅ ACTUALIZADO: Complete session response (POST /api/student/progress/{session_id}/complete)
export interface CompleteSessionResponse {
  session_id: number;
  status: string;
  completed_at: string; // ISO 8601
  exercises_completed: number;
  total_exercises: number;
}

// ===== NEW: Active Workout Types =====

// ✅ ACTUALIZADO: Session progress for API (POST /api/student/progress/{session_id}/complete)
export interface SessionProgress {
  exercise_progress: SessionExerciseProgress[];
  student_notes: string | null;
  completed_at: string; // ISO 8601
}

// ✅ ACTUALIZADO: Exercise progress for session
export interface SessionExerciseProgress {
  exercise_id: number;
  sets: SessionSetProgress[];
}

// ✅ ACTUALIZADO: Set progress for session
export interface SessionSetProgress {
  set_number: number;
  reps_completed: number;
  weight: number | null; // LEGACY
  weight_min?: number | null;
  weight_max?: number | null;
  weight_target?: number | null;
  rpe_actual: number | null;
  notes: string | null;
}

// ✅ LEGACY: Mantener para compatibilidad con useActiveWorkout
export interface LegacySessionProgress {
  template_id: string;
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
  duration_seconds: number;
  exercises: LegacySessionExerciseProgress[];
  notes?: string | null;
}

export interface LegacySessionExerciseProgress {
  exercise_id: string;
  order: number;
  sets: LegacySessionSetProgress[];
  completed: boolean;
}

export interface LegacySessionSetProgress {
  set_number: number;
  planned_reps: string;
  actual_reps: number;
  weight: number; // LEGACY
  weight_min?: number | null;
  weight_max?: number | null;
  weight_target?: number | null;
  rpe: number | null;
  rest_seconds: number;
  completed: boolean;
  notes: string | null;
}

// ✅ LEGACY: Exercise details in session (mantener para compatibilidad)
export interface SessionExerciseDetails {
  exercise_id: string;
  exercise_name?: string;
  order: number;
  sets: SessionSetProgress[];
  completed: boolean;
}

// Local workout state (while training, offline)
export interface LocalWorkoutState {
  session_id: number;
  template_id: number;
  started_at: string; // ISO 8601
  current_exercise_index: number;
  exercises_progress: ExerciseProgress[];
  is_synced: boolean;
}

// Utility types
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday, 1=Monday, ..., 6=Saturday

