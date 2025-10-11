import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import { DailyWorkout, GymError, WorkoutStatus } from '../../types/gym';
import { gymService } from '../../services/gymService';
import { ExerciseCard } from '../../components/gym/ExerciseCard';

// Navigation types (will be integrated with main navigation later)
type RootStackParamList = {
  DailyWorkout: { date?: string; templateId?: number; title?: string };
};

type DailyWorkoutScreenRouteProp = RouteProp<RootStackParamList, 'DailyWorkout'>;
type DailyWorkoutScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'DailyWorkout'>;

export const DailyWorkoutScreen: React.FC = () => {
  const navigation = useNavigation<DailyWorkoutScreenNavigationProp>();
  const route = useRoute<DailyWorkoutScreenRouteProp>();
  
  const [workout, setWorkout] = useState<DailyWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<WorkoutStatus>('loading');
  
  const date = route.params?.date;
  const templateId = route.params?.templateId;
  const title = route.params?.title;
  const isToday = !date || date === new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadWorkout();
  }, [date, templateId]);

  const loadWorkout = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
        setStatus('loading');
      }
      setError(null);

      let dailyWorkout: DailyWorkout;
      
      // Use new student endpoint if templateId is provided
      if (templateId) {
        dailyWorkout = await gymService.getTemplateDetails(templateId);
      } else {
        // Fallback to legacy endpoint for backward compatibility
        dailyWorkout = await gymService.getMyDay(date);
      }
      
      setWorkout(dailyWorkout);
      
      // Determine status based on workout content
      if (!dailyWorkout.title || dailyWorkout.exercises.length === 0) {
        setStatus('no_assignment');
        setError(null);
      } else {
        setStatus('workout_available');
        setError(null);
      }
    } catch (err: any) {
      console.error('Failed to load workout:', err);
      
      // Enhanced error handling
      if (err.response?.status === 404) {
        setStatus('no_assignment');
        setError(null);
        setWorkout({ title: null, exercises: [] });
      } else if (err.response?.status === 401) {
        setStatus('error');
        setError('Sesión expirada. Inicia sesión nuevamente');
      } else if (err.message?.includes('Network request failed')) {
        setStatus('network_error');
        setError('Sin conexión. Verifica tu internet');
      } else {
        setStatus('error');
        const gymError = err as GymError;
        setError(gymError.userMessage || gymError.message || 'Error al cargar la rutina');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadWorkout(true);
  };

  const handleRetry = () => {
    loadWorkout();
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Hoy';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
        {workout?.title && (
          <Text style={styles.workoutTitle}>{workout.title}</Text>
        )}
      </View>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Cargando rutina...</Text>
    </View>
  );

  const renderError = () => {
    const isNetworkError = status === 'network_error';
    const canRetry = status !== 'error' || !error?.includes('Sesión expirada');
    
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>
          {isNetworkError ? '📡' : '⚠️'}
        </Text>
        <Text style={styles.errorTitle}>
          {isNetworkError ? 'Sin conexión' : 'Error'}
        </Text>
        <Text style={styles.errorText}>{error}</Text>
        {canRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>
              {isNetworkError ? 'Reintentar' : 'Volver a cargar'}
            </Text>
          </TouchableOpacity>
        )}
        {!canRetry && (
          <Text style={styles.helpText}>
            Cierra la app e inicia sesión nuevamente
          </Text>
        )}
      </View>
    );
  };

  const renderNoWorkout = () => {
    const isNoAssignment = status === 'no_assignment';
    
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noWorkoutIcon}>
          {isNoAssignment ? '📋' : '😴'}
        </Text>
        <Text style={styles.noWorkoutTitle}>
          {isNoAssignment 
            ? 'Sin rutina asignada'
            : isToday ? 'Día de descanso' : 'Sin entrenamiento'
          }
        </Text>
        <Text style={styles.noWorkoutSubtitle}>
          {isNoAssignment
            ? 'No tienes rutina programada para este día'
            : isToday 
              ? '¡Perfecto para recuperarte!' 
              : 'No hay rutina programada para este día'
          }
        </Text>
        {isNoAssignment && (
          <TouchableOpacity style={styles.refreshButton} onPress={handleRetry}>
            <Text style={styles.refreshButtonText}>Actualizar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const handleStartWorkout = () => {
    Alert.alert(
      'Iniciar Entrenamiento',
      '¿Estás listo para comenzar tu rutina de entrenamiento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Iniciar',
          style: 'default',
          onPress: () => {
            // TODO: Implement workout tracking functionality
            Alert.alert('¡Entrenamiento iniciado!', 'Funcionalidad de seguimiento en desarrollo');
          },
        },
      ]
    );
  };

  const renderWorkout = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#007AFF']}
          tintColor="#007AFF"
        />
      }
    >
      {/* Start Workout Button */}
      <TouchableOpacity 
        style={styles.startWorkoutButton} 
        onPress={handleStartWorkout}
        activeOpacity={0.8}
      >
        <Ionicons name="play-circle" size={24} color="#FFFFFF" />
        <Text style={styles.startWorkoutText}>Iniciar Entrenamiento</Text>
      </TouchableOpacity>

      {workout!.exercises.map((exercise, index) => (
        <ExerciseCard
          key={`${exercise.order}-${index}`}
          exercise={exercise}
        />
      ))}
      
      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      {status === 'loading' && renderLoading()}
      {(status === 'error' || status === 'network_error') && renderError()}
      {status === 'no_assignment' && renderNoWorkout()}
      {status === 'workout_available' && workout && renderWorkout()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: '#007AFF',
    fontWeight: '300',
  },
  headerContent: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  noWorkoutIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  noWorkoutTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  noWorkoutSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  bottomSpacing: {
    height: 32,
  },
  // Enhanced error styles
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  // Refresh button styles
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Start workout button styles
  startWorkoutButton: {
    backgroundColor: '#00973D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startWorkoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default DailyWorkoutScreen;
