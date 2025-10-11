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
import { gymService } from '../../services/gymService';
import { WeeklyPlan, DayOverview, DayAssignment } from '../../types/gym';
import { useStudentTemplates } from '../../hooks/useStudentTemplates';
import { getDayShort } from '../../utils/gymHelpers';

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

const WeeklyCalendarScreen: React.FC = () => {
  const navigation = useNavigation();
  const { templates, professor } = useStudentTemplates();
  
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));

  useEffect(() => {
    loadWeeklyCalendar();
  }, [currentWeekStart]);

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  const loadWeeklyCalendar = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const dateStr = currentWeekStart.toISOString().split('T')[0];
      
      // Try new student endpoint first
      try {
        const calendar = await gymService.getMyWeeklyCalendar(dateStr);
        setWeeklyPlan(calendar);
      } catch (newEndpointError) {
        console.warn('New endpoint failed, trying legacy:', newEndpointError);
        // Fallback to legacy endpoint
        const calendar = await gymService.getMyWeek(dateStr);
        setWeeklyPlan(calendar);
      }
    } catch (err: any) {
      console.error('Failed to load weekly calendar:', err);
      setError(err.userMessage || err.message || 'Error al cargar calendario');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadWeeklyCalendar(true);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const handleDayPress = (day: DayOverview, assignment?: DayAssignment) => {
    // ✅ NUEVO: Manejar múltiples assignments
    if (day.has_workouts) {
      if (assignment) {
        // Navegación directa a un assignment específico
        (navigation as any).navigate('DailyWorkout', {
          templateId: assignment.id,
          title: assignment.daily_template.title,
          date: day.date
        });
      } else if (day.assignments && day.assignments.length === 1) {
        // Si solo hay un assignment, navegar directamente
        const singleAssignment = day.assignments[0];
        (navigation as any).navigate('DailyWorkout', {
          templateId: singleAssignment.id,
          title: singleAssignment.daily_template.title,
          date: day.date
        });
      } else if (day.assignments && day.assignments.length > 1) {
        // Si hay varios, mostrar selector (por ahora tomar el primero)
        const firstAssignment = day.assignments[0];
        (navigation as any).navigate('DailyWorkout', {
          templateId: firstAssignment.id,
          title: firstAssignment.daily_template.title,
          date: day.date
        });
      }
    }
  };

  const formatWeekRange = () => {
    if (!weeklyPlan) return '';
    
    const startDate = new Date(weeklyPlan.week_start || currentWeekStart);
    const endDate = new Date(weeklyPlan.week_end || new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000));
    
    const startStr = startDate.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
    const endStr = endDate.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
    
    return `${startStr} - ${endStr}`;
  };

  const getDayName = (dayShort: string): string => {
    // ✅ NUEVO: day_short viene del backend ahora
    return dayShort || '';
  };

  const isToday = (date: string): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  };

  const renderDayCard = (day: DayOverview) => {
    const today = isToday(day.date);
    const hasWorkout = day.has_workouts;
    const multipleWorkouts = day.assignments && day.assignments.length > 1;
    
    return (
      <TouchableOpacity
        key={day.date}
        style={[
          styles.dayCard,
          today && styles.todayCard,
          hasWorkout && styles.workoutCard,
          !hasWorkout && styles.restCard
        ]}
        onPress={() => handleDayPress(day)}
        disabled={!hasWorkout}
        activeOpacity={0.7}
      >
        <View style={styles.dayHeader}>
          <Text style={[
            styles.dayName,
            today && styles.todayText,
            hasWorkout && styles.workoutText
          ]}>
            {getDayName(day.day_short)}
          </Text>
          <Text style={[
            styles.dayNumber,
            today && styles.todayText,
            hasWorkout && styles.workoutText
          ]}>
            {day.day_number}
          </Text>
        </View>

        <View style={styles.dayContent}>
          {hasWorkout ? (
            <>
              <Ionicons 
                name="fitness" 
                size={24} 
                color={today ? colors.white : colors.primary} 
              />
              {day.assignments && day.assignments.length > 0 ? (
                <Text style={[
                  styles.workoutTitle,
                  today && styles.todayText
                ]} numberOfLines={2}>
                  {day.assignments[0].daily_template.title}
                </Text>
              ) : (
                <Text style={[
                  styles.workoutTitle,
                  today && styles.todayText
                ]}>Entrenamiento</Text>
              )}
              {multipleWorkouts && (
                <Text style={[
                  styles.multipleWorkouts,
                  today && styles.todayText
                ]}>+{day.assignments.length - 1} más</Text>
              )}
            </>
          ) : (
            <>
              <Ionicons 
                name="bed-outline" 
                size={24} 
                color={colors.gray[400]} 
              />
              <Text style={styles.restText}>Descanso</Text>
            </>
          )}
        </View>

        {today && (
          <View style={styles.todayBadge}>
            <Text style={styles.todayBadgeText}>HOY</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading && !weeklyPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendario Semanal</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando calendario...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !weeklyPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendario Semanal</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={styles.errorTitle}>Error al cargar calendario</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadWeeklyCalendar()}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendario Semanal</Text>
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
        {/* Week Navigation */}
        <View style={styles.weekNavigation}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateWeek('prev')}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.weekRange}>{formatWeekRange()}</Text>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateWeek('next')}
          >
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {weeklyPlan?.days.map(renderDayCard)}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Leyenda</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Entrenamiento</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.gray[400] }]} />
              <Text style={styles.legendText}>Descanso</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.warning }]} />
              <Text style={styles.legendText}>Hoy</Text>
            </View>
          </View>
        </View>
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
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  weekRange: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  todayCard: {
    backgroundColor: colors.warning,
  },
  workoutCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  restCard: {
    backgroundColor: colors.gray[100],
  },
  dayHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[600],
    textTransform: 'uppercase',
  },
  dayNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 2,
  },
  todayText: {
    color: colors.white,
  },
  workoutText: {
    color: colors.primary,
  },
  dayContent: {
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  workoutTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginTop: 8,
  },
  restText: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 8,
    fontStyle: 'italic',
  },
  multipleWorkouts: {
    fontSize: 10,
    color: colors.gray[600],
    marginTop: 4,
    fontWeight: '500',
  },
  todayBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  todayBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.warning,
  },
  legend: {
    marginTop: 32,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: colors.gray[600],
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

export default WeeklyCalendarScreen;
