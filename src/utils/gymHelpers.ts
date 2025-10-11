/**
 * Gym Helpers - API v2.0
 * Utilities for handling gym-related data transformations
 */

import { TemplateAssignment } from '../types/gym';

/**
 * Map day number to Spanish day name
 * API v2.0 uses: 0=Sunday, 1=Monday, ..., 6=Saturday
 */
export const getDayName = (dayNumber: number): string => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[dayNumber] || 'Desconocido';
};

/**
 * Map day number to short Spanish day name
 */
export const getDayShort = (dayNumber: number): string => {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return days[dayNumber] || '';
};

/**
 * Get current day number (0-6)
 * 0=Sunday, 1=Monday, ..., 6=Saturday
 */
export const getCurrentDayNumber = (): number => {
  return new Date().getDay();
};

/**
 * Check if a template is scheduled for today
 * @param template Template assignment to check
 * @returns true if template is active and scheduled for today
 */
export const isScheduledToday = (template: TemplateAssignment): boolean => {
  if (template.status !== 'active') {
    return false;
  }

  const today = getCurrentDayNumber();
  return template.frequency.includes(today);
};

/**
 * Check if a template is scheduled for a specific date
 * @param template Template assignment to check
 * @param date Date to check (YYYY-MM-DD or Date object)
 * @returns true if template is scheduled for that date
 */
export const isScheduledForDate = (template: TemplateAssignment, date: string | Date): boolean => {
  if (template.status !== 'active') {
    return false;
  }

  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const dayNumber = targetDate.getDay();
  
  return template.frequency.includes(dayNumber);
};

/**
 * Get frequency days as Spanish names array
 * @param frequency Array of day numbers [0-6]
 * @returns Array of Spanish day names
 */
export const getFrequencyDaysNames = (frequency: number[]): string[] => {
  return frequency.map(getDayName);
};

/**
 * Get frequency days as short Spanish names
 * @param frequency Array of day numbers [0-6]
 * @returns Array of short Spanish day names
 */
export const getFrequencyDaysShort = (frequency: number[]): string[] => {
  return frequency.map(getDayShort);
};

/**
 * Format frequency for display (e.g., "Lun, Mié, Vie")
 * @param frequency Array of day numbers [0-6]
 * @returns Formatted string
 */
export const formatFrequency = (frequency: number[]): string => {
  const sorted = [...frequency].sort((a, b) => a - b);
  return getFrequencyDaysShort(sorted).join(', ');
};

/**
 * Get next scheduled workout date for a template
 * @param template Template assignment
 * @returns Date object of next workout, or null if none scheduled
 */
export const getNextWorkoutDate = (template: TemplateAssignment): Date | null => {
  if (template.status !== 'active' || template.frequency.length === 0) {
    return null;
  }

  const today = new Date();
  const currentDayNumber = today.getDay();
  
  // Find next day in frequency array
  const sortedFrequency = [...template.frequency].sort((a, b) => a - b);
  
  // Check if there's a day later this week
  const nextDayThisWeek = sortedFrequency.find(day => day > currentDayNumber);
  
  if (nextDayThisWeek !== undefined) {
    const daysUntil = nextDayThisWeek - currentDayNumber;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntil);
    return nextDate;
  }
  
  // Otherwise, get first day of next week
  const firstDay = sortedFrequency[0];
  const daysUntil = 7 - currentDayNumber + firstDay;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntil);
  return nextDate;
};

/**
 * Check if template is within its active period
 * @param template Template assignment
 * @returns true if current date is between start_date and end_date (if set)
 */
export const isWithinActivePeriod = (template: TemplateAssignment): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(template.start_date);
  startDate.setHours(0, 0, 0, 0);
  
  if (today < startDate) {
    return false;
  }
  
  if (template.end_date) {
    const endDate = new Date(template.end_date);
    endDate.setHours(0, 0, 0, 0);
    
    if (today > endDate) {
      return false;
    }
  }
  
  return true;
};

/**
 * Get active templates for today
 * @param templates Array of template assignments
 * @returns Filtered array of templates scheduled for today
 */
export const getTodayTemplates = (templates: TemplateAssignment[]): TemplateAssignment[] => {
  return templates.filter(template => 
    isScheduledToday(template) && isWithinActivePeriod(template)
  );
};

/**
 * Get upcoming workouts for the next N days
 * @param templates Array of template assignments
 * @param days Number of days to look ahead (default: 7)
 * @returns Array of {date, templates[]} for upcoming workouts
 */
export const getUpcomingWorkouts = (
  templates: TemplateAssignment[], 
  days: number = 7
): { date: Date; templates: TemplateAssignment[] }[] => {
  const upcoming: { date: Date; templates: TemplateAssignment[] }[] = [];
  const today = new Date();
  
  for (let i = 1; i <= days; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);
    
    const dayTemplates = templates.filter(template => 
      isScheduledForDate(template, futureDate) && isWithinActivePeriod(template)
    );
    
    if (dayTemplates.length > 0) {
      upcoming.push({
        date: futureDate,
        templates: dayTemplates
      });
    }
  }
  
  return upcoming;
};

/**
 * Format date range for display
 * @param startDate Start date (YYYY-MM-DD or Date)
 * @param endDate End date (YYYY-MM-DD or Date) or null
 * @returns Formatted string (e.g., "01/10/2025 - 31/12/2025" or "Desde 01/10/2025")
 */
export const formatDateRange = (startDate: string | Date, endDate: string | Date | null): string => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const startFormatted = start.toLocaleDateString('es-AR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  
  if (!endDate) {
    return `Desde ${startFormatted}`;
  }
  
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const endFormatted = end.toLocaleDateString('es-AR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  
  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Map goal to Spanish label
 */
export const getGoalLabel = (goal: string): string => {
  const labels: { [key: string]: string } = {
    'strength': 'Fuerza',
    'hypertrophy': 'Hipertrofia',
    'endurance': 'Resistencia',
    'general': 'General',
    'weight_loss': 'Pérdida de Peso',
    'cardio': 'Cardiovascular',
    'flexibility': 'Flexibilidad'
  };
  
  return labels[goal] || goal;
};

/**
 * Map level to Spanish label
 */
export const getLevelLabel = (level: string): string => {
  const labels: { [key: string]: string } = {
    'beginner': 'Principiante',
    'intermediate': 'Intermedio',
    'advanced': 'Avanzado'
  };
  
  return labels[level] || level;
};

/**
 * Map status to Spanish label
 */
export const getStatusLabel = (status: string): string => {
  const labels: { [key: string]: string } = {
    'active': 'Activo',
    'paused': 'Pausado',
    'completed': 'Completado',
    'cancelled': 'Cancelado',
    'pending': 'Pendiente',
    'skipped': 'Omitido'
  };
  
  return labels[status] || status;
};

/**
 * Get color for status
 */
export const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    'active': '#00973D',      // Verde
    'completed': '#00973D',   // Verde
    'paused': '#FFC107',      // Amarillo
    'cancelled': '#DC3545',   // Rojo
    'pending': '#17A2B8',     // Azul
    'skipped': '#999999'      // Gris
  };
  
  return colors[status] || '#999999';
};

/**
 * Format RPE for display
 */
export const formatRPE = (rpe: number | null | undefined): string => {
  if (rpe === null || rpe === undefined) {
    return '-';
  }
  return `RPE ${rpe.toFixed(1)}/10`;
};

/**
 * Format reps range for display
 */
export const formatReps = (repsMin?: number, repsMax?: number, reps?: string): string => {
  if (reps) {
    return reps;
  }
  
  if (repsMin !== undefined && repsMax !== undefined) {
    return repsMin === repsMax ? `${repsMin}` : `${repsMin}-${repsMax}`;
  }
  
  return 'A determinar';
};

/**
 * Format rest time for display
 */
export const formatRestTime = (seconds: number): string => {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes} min`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} min`;
  }
  return `${seconds} seg`;
};

/**
 * Format duration in seconds to HH:MM:SS
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format date for display
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format weight information for display
 * Handles new weight fields (weight_min, weight_max, weight_target) and legacy weight field
 */
export const formatWeightText = (set: {
  weight_min?: number | null;
  weight_max?: number | null;
  weight_target?: number | null;
  weight?: number | null;
}): string => {
  // Priority 1: Use weight_target if available
  if (set.weight_target !== null && set.weight_target !== undefined) {
    return `${set.weight_target} kg`;
  }
  
  // Priority 2: Use weight range (min-max) if both available
  if (set.weight_min !== null && set.weight_min !== undefined && 
      set.weight_max !== null && set.weight_max !== undefined) {
    if (set.weight_min === set.weight_max) {
      return `${set.weight_min} kg`;
    }
    return `${set.weight_min}-${set.weight_max} kg`;
  }
  
  // Priority 3: Use only weight_min or weight_max if available
  if (set.weight_min !== null && set.weight_min !== undefined) {
    return `≥${set.weight_min} kg`;
  }
  
  if (set.weight_max !== null && set.weight_max !== undefined) {
    return `≤${set.weight_max} kg`;
  }
  
  // Priority 4: Fallback to legacy weight field
  if (set.weight !== null && set.weight !== undefined) {
    return `${set.weight} kg`;
  }
  
  return 'A determinar';
};
