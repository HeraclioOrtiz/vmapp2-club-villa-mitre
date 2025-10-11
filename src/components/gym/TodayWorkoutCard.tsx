import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { gymService } from '../../services/gymService';
import { WorkoutSummary } from '../../types/gym';

interface TodayWorkoutCardProps {
  onPress: () => void;
}

export const TodayWorkoutCard: React.FC<TodayWorkoutCardProps> = ({
  onPress,
}) => {
  const [summary, setSummary] = useState<WorkoutSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodayWorkout();
  }, []);

  const loadTodayWorkout = async () => {
    try {
      setLoading(true);
      setError(null);
      const workoutSummary = await gymService.getTodayWorkoutSummary();
      setSummary(workoutSummary);
      
      // Clear error if summary indicates an error state
      if (workoutSummary.status === 'error' || workoutSummary.status === 'network_error') {
        setError(workoutSummary.message || 'Error al cargar rutina');
      }
    } catch (err: any) {
      console.error('Failed to load today workout:', err);
      setError('Error inesperado al cargar rutina');
      setSummary({
        status: 'error',
        hasWorkout: false,
        title: null,
        exerciseCount: 0,
        message: 'Error inesperado',
        canRetry: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando rutina...</Text>
        </View>
      </View>
    );
  }

  if (error || !summary) {
    return (
      <TouchableOpacity style={styles.container} onPress={loadTodayWorkout}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Error al cargar rutina</Text>
          <Text style={styles.retryText}>Toca para reintentar</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Handle different workout statuses
  if (summary?.status === 'no_assignment') {
    return (
      <View style={[styles.container, styles.noAssignmentContainer]}>
        <View style={styles.noAssignmentContent}>
          <Text style={styles.noAssignmentIcon}>📋</Text>
          <Text style={styles.noAssignmentTitle}>Sin rutina asignada</Text>
          <Text style={styles.noAssignmentSubtitle}>
            {summary.message || 'No tienes rutina para hoy'}
          </Text>
          {summary.canRetry && (
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={loadTodayWorkout}
            >
              <Text style={styles.retryButtonText}>Actualizar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (!summary?.hasWorkout) {
    return (
      <View style={[styles.container, styles.restDayContainer]}>
        <View style={styles.restDayContent}>
          <Text style={styles.restDayIcon}>😴</Text>
          <Text style={styles.restDayTitle}>Día de descanso</Text>
          <Text style={styles.restDaySubtitle}>¡Perfecto para recuperarte!</Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.container, styles.workoutContainer]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.workoutHeader}>
        <View style={styles.workoutIcon}>
          <Text style={styles.workoutIconText}>💪</Text>
        </View>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutLabel}>Tu rutina de hoy</Text>
          <Text style={styles.workoutTitle}>{summary.title}</Text>
          <Text style={styles.workoutDetails}>
            {summary.exerciseCount} ejercicio{summary.exerciseCount !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.arrowIcon}>
          <Text style={styles.arrowText}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
    marginBottom: 4,
  },
  retryText: {
    fontSize: 12,
    color: '#666',
  },
  restDayContainer: {
    backgroundColor: '#f8f9fa',
  },
  restDayContent: {
    alignItems: 'center',
    padding: 20,
  },
  restDayIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  restDayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  restDaySubtitle: {
    fontSize: 14,
    color: '#666',
  },
  workoutContainer: {
    backgroundColor: '#fff',
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutIconText: {
    fontSize: 20,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  workoutDetails: {
    fontSize: 14,
    color: '#666',
  },
  arrowIcon: {
    padding: 4,
  },
  arrowText: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: '300',
  },
  // No Assignment styles
  noAssignmentContainer: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  noAssignmentContent: {
    alignItems: 'center',
    padding: 20,
  },
  noAssignmentIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  noAssignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
    textAlign: 'center',
  },
  noAssignmentSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TodayWorkoutCard;
