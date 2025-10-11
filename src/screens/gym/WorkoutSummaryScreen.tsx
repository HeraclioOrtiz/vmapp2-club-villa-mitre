import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors';
import { gymService } from '../../services/gymService';
import { WorkoutSessionDetails } from '../../types/gym';
import { formatDuration, formatDate, formatWeightText } from '../../utils/gymHelpers';

interface WorkoutSummaryScreenProps {
  route: {
    params: {
      sessionId: string;
    };
  };
}

export const WorkoutSummaryScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sessionId } = route.params as WorkoutSummaryScreenProps['route']['params'];

  const [session, setSession] = useState<WorkoutSessionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessionDetails();
  }, [sessionId]);

  const loadSessionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sessionData = await gymService.getSessionDetails(sessionId);
      setSession(sessionData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar resumen');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!session) return;

    const completedExercises = session.exercises.filter(ex => ex.completed).length;
    const totalSets = session.exercises.reduce((total, ex) => total + ex.sets.length, 0);
    const completedSets = session.exercises.reduce((total, ex) => 
      total + ex.sets.filter(set => set.completed).length, 0
    );

    const shareText = `💪 Entrenamiento Completado!

📋 ${session.template_title}
⏱️ Duración: ${formatDuration(session.duration_seconds)}
🏋️ Ejercicios: ${completedExercises}/${session.exercises.length}
📊 Series: ${completedSets}/${totalSets}
📅 ${formatDate(session.start_time)}

#VillaMitre #Gimnasio #Entrenamiento`;

    try {
      await Share.share({
        message: shareText,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const calculateStats = () => {
    if (!session) return null;

    const completedExercises = session.exercises.filter(ex => ex.completed).length;
    const totalExercises = session.exercises.length;
    
    const completedSets = session.exercises.reduce((total, ex) => 
      total + ex.sets.filter(set => set.completed).length, 0
    );
    const totalSets = session.exercises.reduce((total, ex) => total + ex.sets.length, 0);

    const totalReps = session.exercises.reduce((total, ex) => 
      total + ex.sets.reduce((setTotal, set) => setTotal + (set.reps_completed || 0), 0), 0
    );

    const totalWeight = session.exercises.reduce((total, ex) => 
      total + ex.sets.reduce((setTotal, set) => {
        const weight = set.weight_target || set.weight_min || set.weight_max || set.weight || 0;
        return setTotal + (weight * (set.reps_completed || 0));
      }, 0
      ), 0
    );

    const averageRpe = session.exercises.reduce((total, ex) => {
      const rpeValues = ex.sets.filter(set => set.rpe_actual).map(set => set.rpe_actual!);
      const avgRpe = rpeValues.length > 0 ? rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length : 0;
      return total + avgRpe;
    }, 0) / session.exercises.length;

    return {
      completedExercises,
      totalExercises,
      completedSets,
      totalSets,
      totalReps,
      totalWeight: Math.round(totalWeight),
      averageRpe: Math.round(averageRpe * 10) / 10,
      completionPercentage: Math.round((completedSets / totalSets) * 100),
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando resumen...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.ERROR} />
          <Text style={styles.errorText}>{error || 'Sesión no encontrada'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('GymDashboard' as never)}
          style={styles.headerButton}
        >
          <Ionicons name="close" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Resumen</Text>
        
        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <Ionicons name="share-outline" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Message */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={COLORS.SUCCESS} />
          </View>
          <Text style={styles.successTitle}>¡Entrenamiento Completado!</Text>
          <Text style={styles.successSubtitle}>{session.template_title}</Text>
          <Text style={styles.successDate}>{formatDate(session.start_time)}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="time-outline" size={24} color={COLORS.PRIMARY_GREEN} />
              <Text style={styles.statValue}>{formatDuration(session.duration_seconds)}</Text>
              <Text style={styles.statLabel}>Duración</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="fitness-outline" size={24} color={COLORS.PRIMARY_GREEN} />
              <Text style={styles.statValue}>
                {stats?.completedExercises}/{stats?.totalExercises}
              </Text>
              <Text style={styles.statLabel}>Ejercicios</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="barbell-outline" size={24} color={COLORS.PRIMARY_GREEN} />
              <Text style={styles.statValue}>
                {stats?.completedSets}/{stats?.totalSets}
              </Text>
              <Text style={styles.statLabel}>Series</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="trending-up-outline" size={24} color={COLORS.PRIMARY_GREEN} />
              <Text style={styles.statValue}>{stats?.totalReps}</Text>
              <Text style={styles.statLabel}>Repeticiones</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="speedometer-outline" size={24} color={COLORS.PRIMARY_GREEN} />
              <Text style={styles.statValue}>{stats?.totalWeight} kg</Text>
              <Text style={styles.statLabel}>Volumen Total</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="heart-outline" size={24} color={COLORS.PRIMARY_GREEN} />
              <Text style={styles.statValue}>{stats?.averageRpe}/10</Text>
              <Text style={styles.statLabel}>RPE Promedio</Text>
            </View>
          </View>
        </View>

        {/* Progress Circle */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Progreso Completado</Text>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercentage}>{stats?.completionPercentage}%</Text>
          </View>
        </View>

        {/* Exercise Details */}
        <View style={styles.exercisesContainer}>
          <Text style={styles.exercisesTitle}>Detalle de Ejercicios</Text>
          
          {session.exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseNumber}>{index + 1}</Text>
                <Text style={styles.exerciseName}>{exercise.name || `Ejercicio ${index + 1}`}</Text>
                {exercise.completed && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.SUCCESS} />
                )}
              </View>
              
              <View style={styles.setsContainer}>
                {exercise.sets.map((set, setIndex) => (
                  <View key={setIndex} style={styles.setRow}>
                    <Text style={styles.setNumber}>{set.set_number}</Text>
                    <Text style={styles.setData}>
                      {set.reps_completed} reps
                      {(set.weight_target || set.weight_min || set.weight_max || set.weight) ? ` × ${formatWeightText(set)}` : ''}
                      {set.rpe_actual ? ` (RPE ${set.rpe_actual})` : ''}
                    </Text>
                    {set.completed && (
                      <Ionicons name="checkmark" size={16} color={COLORS.SUCCESS} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => navigation.navigate('GymDashboard' as never)}
          >
            <Ionicons name="home-outline" size={20} color={COLORS.WHITE} />
            <Text style={styles.primaryButtonText}>Volver al Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('ProgressHistory' as never)}
          >
            <Ionicons name="analytics-outline" size={20} color={COLORS.PRIMARY_GREEN} />
            <Text style={styles.secondaryButtonText}>Ver Historial</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
  },
  header: {
    backgroundColor: COLORS.PRIMARY_GREEN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  scrollView: {
    flex: 1,
  },
  successContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.WHITE,
    margin: 16,
    borderRadius: 16,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 4,
  },
  successDate: {
    fontSize: 14,
    color: COLORS.TEXT_TERTIARY,
    textAlign: 'center',
  },
  statsContainer: {
    margin: 16,
    marginTop: 0,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
    textAlign: 'center',
  },
  progressContainer: {
    backgroundColor: COLORS.WHITE,
    margin: 16,
    marginTop: 0,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY_GREEN + '20',
    borderWidth: 8,
    borderColor: COLORS.PRIMARY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GREEN,
  },
  exercisesContainer: {
    margin: 16,
    marginTop: 0,
  },
  exercisesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.PRIMARY_GREEN,
    color: COLORS.WHITE,
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
  },
  exerciseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  setsContainer: {
    gap: 8,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  setNumber: {
    width: 24,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  setData: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 8,
  },
  actionsContainer: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY_GREEN,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  secondaryButton: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY_GREEN,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY_GREEN,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.ERROR,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY_GREEN,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
});

export default WorkoutSummaryScreen;
