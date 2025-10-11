import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors';
import { useActiveWorkout } from '../../hooks/useActiveWorkout';
import { RestTimer } from '../../components/gym/RestTimer';
import { SetProgressInput } from '../../components/gym/SetProgressInput';
import { ExerciseCard } from '../../components/gym/ExerciseCard';
import { formatRestTime, formatDuration } from '../../utils/gymHelpers';

interface ActiveWorkoutScreenProps {
  route: {
    params: {
      templateId: string;
      title: string;
    };
  };
}

export const ActiveWorkoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { templateId, title } = route.params as ActiveWorkoutScreenProps['route']['params'];

  const {
    workoutState,
    loading,
    error,
    startWorkout,
    completeSet,
    startRest,
    endRest,
    moveToNext,
    finishWorkout,
    cancelWorkout,
    getWorkoutStats,
    isActive,
    currentExercise,
    currentSet,
  } = useActiveWorkout();

  const [showSetInput, setShowSetInput] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // ✅ Inicializar entrenamiento si no está activo
  useEffect(() => {
    if (!isActive && !loading) {
      startWorkout(templateId, title);
    }
  }, [templateId, title, isActive, loading, startWorkout]);

  // ✅ Actualizar tiempo cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Manejar botón atrás de Android
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true; // Prevenir navegación automática
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const handleBackPress = () => {
    Alert.alert(
      'Salir del Entrenamiento',
      '¿Estás seguro que quieres salir? Se perderá el progreso actual.',
      [
        { text: 'Continuar Entrenando', style: 'cancel' },
        { 
          text: 'Salir', 
          style: 'destructive',
          onPress: () => {
            cancelWorkout();
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleCompleteSet = (progress: any) => {
    if (!workoutState || !currentExercise) return;

    completeSet(workoutState.currentExerciseIndex, workoutState.currentSetIndex, progress);
    setShowSetInput(false);

    // Iniciar descanso automáticamente si no es el último set
    const isLastSet = workoutState.currentSetIndex === currentExercise.sets.length - 1;
    const isLastExercise = workoutState.currentExerciseIndex === workoutState.exercises.length - 1;

    if (!isLastSet || !isLastExercise) {
      const restSeconds = currentSet?.rest_seconds || 60;
      startRest(restSeconds);
    } else {
      // Es el último set del último ejercicio
      handleFinishWorkout();
    }
  };

  const handleRestComplete = () => {
    endRest();
    moveToNext();
  };

  const handleSkipRest = () => {
    endRest();
    moveToNext();
  };

  const handleFinishWorkout = async () => {
    Alert.alert(
      'Finalizar Entrenamiento',
      '¿Has completado tu entrenamiento?',
      [
        { text: 'Continuar', style: 'cancel' },
        {
          text: 'Finalizar',
          style: 'default',
          onPress: async () => {
            const result = await finishWorkout();
            if (result) {
              // Navegar a resumen o dashboard
              (navigation as any).navigate('WorkoutSummary', { sessionId: result.session_id });
            }
          },
        },
      ]
    );
  };

  const stats = getWorkoutStats();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Iniciando entrenamiento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.ERROR} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => startWorkout(templateId, title)}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!workoutState || !currentExercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando ejercicios...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const elapsedTime = Math.floor((currentTime - workoutState.startTime) / 1000);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con estadísticas */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.workoutTitle} numberOfLines={1}>
            {workoutState.templateTitle}
          </Text>
          <Text style={styles.workoutStats}>
            {formatDuration(elapsedTime)} • {stats?.completedSets}/{stats?.totalSets} series
          </Text>
        </View>

        <TouchableOpacity onPress={handleFinishWorkout} style={styles.finishButton}>
          <Ionicons name="checkmark" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${stats?.progressPercentage || 0}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {stats?.progressPercentage || 0}% completado
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Ejercicio Actual */}
        <View style={styles.currentExerciseContainer}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseNumber}>
              Ejercicio {workoutState.currentExerciseIndex + 1} de {workoutState.exercises.length}
            </Text>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
          </View>

          <ExerciseCard 
            exercise={currentExercise} 
            onPress={() => {}} // No expandible durante entrenamiento
          />

          {/* Set Actual */}
          <View style={styles.currentSetContainer}>
            <Text style={styles.currentSetTitle}>
              Serie {workoutState.currentSetIndex + 1} de {currentExercise.sets.length}
            </Text>
            
            {currentSet && (
              <View style={styles.setDetails}>
                <View style={styles.setInfo}>
                  <Ionicons name="fitness" size={20} color={COLORS.PRIMARY_GREEN} />
                  <Text style={styles.setInfoText}>
                    {currentSet.reps_min && currentSet.reps_max 
                      ? `${currentSet.reps_min}-${currentSet.reps_max} reps`
                      : `${currentSet.reps} reps`
                    }
                  </Text>
                </View>
                
                {currentSet.weight && (
                  <View style={styles.setInfo}>
                    <Ionicons name="barbell" size={20} color={COLORS.PRIMARY_GREEN} />
                    <Text style={styles.setInfoText}>{currentSet.weight} kg</Text>
                  </View>
                )}
                
                <View style={styles.setInfo}>
                  <Ionicons name="time" size={20} color={COLORS.PRIMARY_GREEN} />
                  <Text style={styles.setInfoText}>
                    Descanso: {formatRestTime(currentSet.rest_seconds)}
                  </Text>
                </View>
              </View>
            )}

            {/* Botón para completar set */}
            {!workoutState.isResting && (
              <TouchableOpacity
                style={styles.completeSetButton}
                onPress={() => setShowSetInput(true)}
              >
                <Ionicons name="checkmark-circle" size={24} color={COLORS.WHITE} />
                <Text style={styles.completeSetButtonText}>Completar Serie</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Próximos Ejercicios */}
        <View style={styles.upcomingContainer}>
          <Text style={styles.upcomingTitle}>Próximos Ejercicios</Text>
          {workoutState.exercises
            .slice(workoutState.currentExerciseIndex + 1, workoutState.currentExerciseIndex + 4)
            .map((exercise, index) => (
              <View key={exercise.id} style={styles.upcomingExercise}>
                <Text style={styles.upcomingExerciseNumber}>
                  {workoutState.currentExerciseIndex + index + 2}
                </Text>
                <Text style={styles.upcomingExerciseName}>{exercise.name}</Text>
                <Text style={styles.upcomingExerciseSets}>
                  {exercise.sets.length} series
                </Text>
              </View>
            ))}
        </View>
      </ScrollView>

      {/* Rest Timer */}
      <RestTimer
        restSeconds={currentSet?.rest_seconds || 60}
        onComplete={handleRestComplete}
        onSkip={handleSkipRest}
        isActive={workoutState.isResting}
      />

      {/* Set Progress Input Modal */}
      <SetProgressInput
        visible={showSetInput}
        set={currentSet!}
        setNumber={workoutState.currentSetIndex + 1}
        onComplete={handleCompleteSet}
        onCancel={() => setShowSetInput(false)}
      />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  workoutStats: {
    fontSize: 14,
    color: COLORS.WHITE,
    opacity: 0.9,
    marginTop: 2,
  },
  finishButton: {
    padding: 8,
  },
  progressContainer: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.GRAY_LIGHTER,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY_GREEN,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 6,
  },
  scrollView: {
    flex: 1,
  },
  currentExerciseContainer: {
    backgroundColor: COLORS.WHITE,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseHeader: {
    marginBottom: 16,
  },
  exerciseNumber: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 4,
  },
  currentSetContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHTER,
  },
  currentSetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  setDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  setInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  setInfoText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  completeSetButton: {
    backgroundColor: COLORS.PRIMARY_GREEN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  completeSetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  upcomingContainer: {
    backgroundColor: COLORS.WHITE,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  upcomingExercise: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHTEST,
  },
  upcomingExerciseNumber: {
    width: 24,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
  },
  upcomingExerciseName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 12,
  },
  upcomingExerciseSets: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
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

export default ActiveWorkoutScreen;
