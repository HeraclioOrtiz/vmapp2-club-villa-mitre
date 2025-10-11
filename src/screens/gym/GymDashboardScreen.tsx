import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors';
import { useStudentTemplates } from '../../hooks/useStudentTemplates';
import { gymService } from '../../services/gymService';
import { TemplateAssignment, Professor } from '../../types/gym';
import { 
  isScheduledToday, 
  getUpcomingWorkouts, 
  formatFrequency,
  formatDateRange,
  getGoalLabel,
  getLevelLabel 
} from '../../utils/gymHelpers';

// Create colors object compatible with the component
const colors = {
  primary: COLORS.PRIMARY_GREEN,
  success: COLORS.SUCCESS,
  warning: COLORS.WARNING,
  error: COLORS.ERROR,
  info: COLORS.INFO,
  background: COLORS.BACKGROUND_PRIMARY,
  white: COLORS.WHITE,
  black: COLORS.BLACK,
  text: COLORS.TEXT_PRIMARY,
  gray: {
    100: COLORS.GRAY_LIGHTEST,
    200: COLORS.GRAY_LIGHTER,
    400: COLORS.GRAY_LIGHT,
    500: COLORS.GRAY_MEDIUM,
    600: COLORS.TEXT_SECONDARY,
    700: COLORS.TEXT_TERTIARY,
  }
};

interface TodayWorkoutInfo {
  hasWorkout: boolean;
  template?: TemplateAssignment;
  message: string;
}

interface UpcomingWorkout {
  day: string;
  date: string;
  template: TemplateAssignment;
}

const GymDashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { templates, professor, loading, error, refetch } = useStudentTemplates();
  
  const [refreshing, setRefreshing] = useState(false);
  const [todayWorkout, setTodayWorkout] = useState<TodayWorkoutInfo | null>(null);
  const [upcomingWorkouts, setUpcomingWorkouts] = useState<UpcomingWorkout[]>([]);

  useEffect(() => {
    if (templates.length > 0) {
      calculateWorkouts();
    }
  }, [templates]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const calculateWorkouts = () => {
    // ✅ NUEVO: Usar helper para encontrar entrenamiento de hoy
    const todayTemplate = templates.find(template => 
      template.status === 'active' && 
      isScheduledToday(template)
    );

    if (todayTemplate) {
      setTodayWorkout({
        hasWorkout: true,
        template: todayTemplate,
        message: `${todayTemplate.daily_template.exercises_count} ejercicios • ${todayTemplate.daily_template.estimated_duration_min} min`
      });
    } else {
      setTodayWorkout({
        hasWorkout: false,
        message: 'Día de descanso'
      });
    }

    // ✅ NUEVO: Usar helper para obtener próximos entrenamientos
    const upcomingData = getUpcomingWorkouts(templates, 7);
    
    const upcoming: UpcomingWorkout[] = upcomingData.map(({ date, templates: dayTemplates }) => ({
      day: date.toLocaleDateString('es-ES', { weekday: 'long' }),
      date: date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      }),
      template: dayTemplates[0] // Por ahora tomar el primero si hay varios
    }));

    setUpcomingWorkouts(upcoming.slice(0, 5)); // Show next 5 workouts
  };

  const handleTodayWorkoutPress = () => {
    if (todayWorkout?.hasWorkout && todayWorkout?.template) {
      // ✅ NUEVO: Navegar a ActiveWorkout para entrenar en vivo
      (navigation as any).navigate('ActiveWorkout', {
        templateId: todayWorkout.template.id.toString(),
        title: todayWorkout.template.daily_template.title
      });
    }
  };
  const handleUpcomingWorkoutPress = (workout: UpcomingWorkout) => {
    (navigation as any).navigate('DailyWorkout', {
      templateId: workout.template.id,
      title: workout.template.daily_template.title
    });
  };

  const handleViewAllTemplates = () => {
    (navigation as any).navigate('TemplatesList');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return colors.success;
      case 'intermediate': return colors.warning;
      case 'advanced': return colors.error;
      default: return colors.gray[500];
    }
  };

  const getLevelText = (level: string) => {
    return getLevelLabel(level); // ✅ Usar helper
  };

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case 'strength': return 'barbell-outline';
      case 'cardio': return 'heart-outline';
      case 'flexibility': return 'body-outline';
      case 'endurance': return 'timer-outline';
      default: return 'fitness-outline';
    }
  };

  if (loading && templates.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard Gym</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando entrenamientos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && templates.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard Gym</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={styles.errorTitle}>Error al cargar datos</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard Gym</Text>
        {professor && (
          <Text style={styles.professorInfo}>Profesor: {professor.name}</Text>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Workout Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entrenamiento de Hoy</Text>
          
          <TouchableOpacity
            style={[
              styles.todayCard,
              !todayWorkout?.hasWorkout && styles.todayCardRest
            ]}
            onPress={handleTodayWorkoutPress}
            disabled={!todayWorkout?.hasWorkout}
            activeOpacity={0.7}
          >
            <View style={styles.todayCardHeader}>
              <Ionicons 
                name={todayWorkout?.hasWorkout ? 'fitness' : 'bed-outline'} 
                size={32} 
                color={todayWorkout?.hasWorkout ? colors.primary : colors.gray[500]} 
              />
              <View style={styles.todayCardInfo}>
                <Text style={[
                  styles.todayCardTitle,
                  !todayWorkout?.hasWorkout && styles.todayCardTitleRest
                ]}>
                  {todayWorkout?.hasWorkout ? todayWorkout.template?.daily_template.title : 'Día de Descanso'}
                </Text>
                <Text style={[
                  styles.todayCardMessage,
                  !todayWorkout?.hasWorkout && styles.todayCardMessageRest
                ]}>
                  {todayWorkout?.message}
                </Text>
              </View>
              {todayWorkout?.hasWorkout && (
                <Ionicons name="chevron-forward" size={24} color={colors.gray[400]} />
              )}
            </View>

            {todayWorkout?.hasWorkout && todayWorkout.template && (
              <View style={styles.todayCardDetails}>
                <View style={styles.todayCardBadges}>
                  <View style={[styles.levelBadge, { backgroundColor: getLevelColor(todayWorkout.template.daily_template.level) }]}>
                    <Text style={styles.levelText}>{getLevelText(todayWorkout.template.daily_template.level)}</Text>
                  </View>
                  <View style={styles.goalBadge}>
                    <Ionicons 
                      name={getGoalIcon(todayWorkout.template.daily_template.goal) as any} 
                      size={16} 
                      color={colors.primary} 
                    />
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Upcoming Workouts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Entrenamientos</Text>
            <TouchableOpacity onPress={handleViewAllTemplates}>
              <Text style={styles.viewAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {upcomingWorkouts.length > 0 ? (
            upcomingWorkouts.map((workout, index) => (
              <TouchableOpacity
                key={index}
                style={styles.upcomingCard}
                onPress={() => handleUpcomingWorkoutPress(workout)}
                activeOpacity={0.7}
              >
                <View style={styles.upcomingCardLeft}>
                  <Text style={styles.upcomingDay}>{workout.day}</Text>
                  <Text style={styles.upcomingDate}>{workout.date}</Text>
                </View>
                
                <View style={styles.upcomingCardCenter}>
                  <Text style={styles.upcomingTitle} numberOfLines={1}>
                    {workout.template.daily_template.title}
                  </Text>
                  <Text style={styles.upcomingInfo}>
                    {workout.template.daily_template.exercises_count} ejercicios • {workout.template.daily_template.estimated_duration_min} min
                  </Text>
                </View>

                <View style={styles.upcomingCardRight}>
                  <Ionicons 
                    name={getGoalIcon(workout.template.daily_template.goal) as any} 
                    size={20} 
                    color={colors.primary} 
                  />
                  <Ionicons name="chevron-forward" size={16} color={colors.gray[400]} />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyUpcoming}>
              <Ionicons name="calendar-outline" size={48} color={colors.gray[400]} />
              <Text style={styles.emptyUpcomingText}>No hay entrenamientos programados</Text>
            </View>
          )}
        </View>

        {/* Quick Stats Section */}
        {templates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{templates.filter(t => t.status === 'active').length}</Text>
                <Text style={styles.statLabel}>Plantillas Activas</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {templates.reduce((total, t) => t.status === 'active' ? total + t.frequency_days.length : total, 0)}
                </Text>
                <Text style={styles.statLabel}>Días por Semana</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {Math.round(templates.reduce((total, t) => t.status === 'active' ? total + t.daily_template.estimated_duration_min : total, 0) / Math.max(templates.filter(t => t.status === 'active').length, 1))}
                </Text>
                <Text style={styles.statLabel}>Min Promedio</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  professorInfo: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  todayCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  todayCardRest: {
    borderLeftColor: colors.gray[400],
  },
  todayCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayCardInfo: {
    flex: 1,
    marginLeft: 16,
  },
  todayCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  todayCardTitleRest: {
    color: colors.gray[600],
  },
  todayCardMessage: {
    fontSize: 14,
    color: colors.gray[600],
  },
  todayCardMessageRest: {
    color: colors.gray[500],
  },
  todayCardDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  todayCardBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  levelText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  goalBadge: {
    padding: 6,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
  },
  upcomingCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  upcomingCardLeft: {
    width: 80,
    alignItems: 'center',
  },
  upcomingDay: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  upcomingDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 2,
  },
  upcomingCardCenter: {
    flex: 1,
    marginLeft: 16,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  upcomingInfo: {
    fontSize: 12,
    color: colors.gray[600],
  },
  upcomingCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  emptyUpcoming: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyUpcomingText: {
    fontSize: 16,
    color: colors.gray[500],
    marginTop: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[600],
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray[600],
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GymDashboardScreen;
