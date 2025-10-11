import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise, ExerciseSet, WorkoutSession, SessionProgress } from '../types/gym';
import { gymService } from '../services/gymService';

export interface SetProgress {
  setIndex: number;
  reps: number | null;
  weight: number | null;
  rpe: number | null; // Rate of Perceived Exertion (1-10)
  completed: boolean;
  restStartTime?: number;
  notes?: string;
}

export interface ExerciseProgress {
  exerciseId: string;
  exerciseOrder: number;
  sets: SetProgress[];
  completed: boolean;
  startTime?: number;
  endTime?: number;
}

export interface ActiveWorkoutState {
  templateId: string;
  templateTitle: string;
  exercises: Exercise[];
  progress: ExerciseProgress[];
  currentExerciseIndex: number;
  currentSetIndex: number;
  startTime: number;
  isResting: boolean;
  restEndTime?: number;
  totalDuration: number;
  isCompleted: boolean;
}

const STORAGE_KEY = 'active_workout_state';

export const useActiveWorkout = () => {
  const [workoutState, setWorkoutState] = useState<ActiveWorkoutState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Cargar estado guardado al inicializar
  useEffect(() => {
    loadSavedWorkout();
  }, []);

  // ✅ Guardar estado automáticamente cuando cambia
  useEffect(() => {
    if (workoutState) {
      saveWorkoutState();
    }
  }, [workoutState]);

  const loadSavedWorkout = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved) as ActiveWorkoutState;
        setWorkoutState(state);
      }
    } catch (err) {
      console.error('Error loading saved workout:', err);
    }
  };

  const saveWorkoutState = async () => {
    if (!workoutState) return;
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workoutState));
    } catch (err) {
      console.error('Error saving workout state:', err);
    }
  };

  const clearSavedWorkout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Error clearing saved workout:', err);
    }
  };

  // ✅ Iniciar nuevo entrenamiento
  const startWorkout = useCallback(async (templateId: string, templateTitle: string) => {
    try {
      setLoading(true);
      setError(null);

      // Obtener detalles del template
      const templateDetails = await gymService.getTemplateDetails(parseInt(templateId));
      
      const initialProgress: ExerciseProgress[] = templateDetails.exercises.map((exercise) => ({
        exerciseId: exercise.id.toString(),
        exerciseOrder: exercise.order,
        sets: exercise.sets.map((_, index) => ({
          setIndex: index,
          reps: null,
          weight: null,
          rpe: null,
          completed: false,
        })),
        completed: false,
      }));

      const newState: ActiveWorkoutState = {
        templateId,
        templateTitle,
        exercises: templateDetails.exercises,
        progress: initialProgress,
        currentExerciseIndex: 0,
        currentSetIndex: 0,
        startTime: Date.now(),
        isResting: false,
        totalDuration: 0,
        isCompleted: false,
      };

      setWorkoutState(newState);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar entrenamiento');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Completar un set
  const completeSet = useCallback((exerciseIndex: number, setIndex: number, progress: Partial<SetProgress>) => {
    if (!workoutState) return;

    setWorkoutState(prev => {
      if (!prev) return prev;

      const newProgress = [...prev.progress];
      const exerciseProgress = { ...newProgress[exerciseIndex] };
      const setProgress = { ...exerciseProgress.sets[setIndex] };

      // Actualizar progreso del set
      Object.assign(setProgress, progress, { completed: true });
      exerciseProgress.sets[setIndex] = setProgress;

      // Verificar si el ejercicio está completo
      const allSetsCompleted = exerciseProgress.sets.every(set => set.completed);
      if (allSetsCompleted && !exerciseProgress.completed) {
        exerciseProgress.completed = true;
        exerciseProgress.endTime = Date.now();
      }

      newProgress[exerciseIndex] = exerciseProgress;

      return {
        ...prev,
        progress: newProgress,
      };
    });
  }, [workoutState]);

  // ✅ Iniciar descanso
  const startRest = useCallback((restSeconds: number) => {
    if (!workoutState) return;

    setWorkoutState(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        isResting: true,
        restEndTime: Date.now() + (restSeconds * 1000),
      };
    });
  }, [workoutState]);

  // ✅ Terminar descanso
  const endRest = useCallback(() => {
    if (!workoutState) return;

    setWorkoutState(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        isResting: false,
        restEndTime: undefined,
      };
    });
  }, [workoutState]);

  // ✅ Navegar a siguiente ejercicio/set
  const moveToNext = useCallback(() => {
    if (!workoutState) return;

    setWorkoutState(prev => {
      if (!prev) return prev;

      const currentExercise = prev.exercises[prev.currentExerciseIndex];
      const nextSetIndex = prev.currentSetIndex + 1;

      // Si hay más sets en el ejercicio actual
      if (nextSetIndex < currentExercise.sets.length) {
        return {
          ...prev,
          currentSetIndex: nextSetIndex,
        };
      }

      // Si hay más ejercicios
      const nextExerciseIndex = prev.currentExerciseIndex + 1;
      if (nextExerciseIndex < prev.exercises.length) {
        return {
          ...prev,
          currentExerciseIndex: nextExerciseIndex,
          currentSetIndex: 0,
        };
      }

      // Entrenamiento completado
      return {
        ...prev,
        isCompleted: true,
      };
    });
  }, [workoutState]);

  // ✅ Finalizar entrenamiento
  const finishWorkout = useCallback(async () => {
    if (!workoutState) return null;

    try {
      setLoading(true);
      setError(null);

      const endTime = Date.now();
      const duration = Math.floor((endTime - workoutState.startTime) / 1000); // segundos

      // ✅ NUEVO: Preparar datos para enviar al backend (nueva estructura API)
      const sessionData: SessionProgress = {
        exercise_progress: workoutState.progress.map(exerciseProgress => {
          return {
            exercise_id: parseInt(exerciseProgress.exerciseId),
            sets: exerciseProgress.sets.map((setProgress, index) => ({
              set_number: index + 1,
              reps_completed: setProgress.reps || 0,
              weight: setProgress.weight || null,
              rpe_actual: setProgress.rpe || null,
              notes: setProgress.notes || null,
            })),
          };
        }),
        student_notes: null, // TODO: Agregar campo para notas del estudiante
        completed_at: new Date(endTime).toISOString(),
      };

      // ✅ NUEVO: Generar sessionId (por ahora usar templateId, luego será proporcionado por el backend)
      const sessionId = workoutState.templateId;

      // Enviar al backend
      const result = await gymService.completeSession(sessionId, sessionData);

      // Limpiar estado guardado
      await clearSavedWorkout();
      setWorkoutState(null);

      return result;
    } catch (err: any) {
      setError(err.message || 'Error al finalizar entrenamiento');
      return null;
    } finally {
      setLoading(false);
    }
  }, [workoutState]);

  // ✅ Cancelar entrenamiento
  const cancelWorkout = useCallback(async () => {
    await clearSavedWorkout();
    setWorkoutState(null);
  }, []);

  // ✅ Calcular estadísticas en tiempo real
  const getWorkoutStats = useCallback(() => {
    if (!workoutState) return null;

    const completedExercises = workoutState.progress.filter(ex => ex.completed).length;
    const totalExercises = workoutState.exercises.length;
    
    const completedSets = workoutState.progress.reduce((total, ex) => 
      total + ex.sets.filter(set => set.completed).length, 0
    );
    const totalSets = workoutState.exercises.reduce((total, ex) => total + ex.sets.length, 0);

    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - workoutState.startTime) / 1000);

    return {
      completedExercises,
      totalExercises,
      completedSets,
      totalSets,
      elapsedSeconds,
      progressPercentage: Math.round((completedSets / totalSets) * 100),
    };
  }, [workoutState]);

  return {
    // Estado
    workoutState,
    loading,
    error,
    
    // Acciones
    startWorkout,
    completeSet,
    startRest,
    endRest,
    moveToNext,
    finishWorkout,
    cancelWorkout,
    
    // Utilidades
    getWorkoutStats,
    
    // Estado computado
    isActive: !!workoutState && !workoutState.isCompleted,
    currentExercise: workoutState ? workoutState.exercises[workoutState.currentExerciseIndex] : null,
    currentSet: workoutState ? workoutState.exercises[workoutState.currentExerciseIndex]?.sets[workoutState.currentSetIndex] : null,
  };
};
