import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors';

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
import { useStudentTemplates } from '../../hooks/useStudentTemplates';
import { TemplateAssignment } from '../../types/gym';

const TemplatesListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { templates, professor, loading, error, refetch } = useStudentTemplates();
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'completed'>('all');

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleTemplatePress = (template: TemplateAssignment) => {
    // Navigate to template details - using any for now to avoid navigation type issues
    (navigation as any).navigate('DailyWorkout', { 
      templateId: template.id,
      title: template.daily_template.title 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'paused': return colors.warning;
      case 'completed': return colors.info;
      default: return colors.gray[500];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'paused': return 'Pausada';
      case 'completed': return 'Completada';
      default: return status;
    }
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
    switch (level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return level;
    }
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

  const filteredTemplates = templates.filter(template => {
    if (statusFilter === 'all') return true;
    return template.status === statusFilter;
  });

  const renderFilterButton = (filter: typeof statusFilter, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        statusFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setStatusFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        statusFilter === filter && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderTemplateCard = ({ item }: { item: TemplateAssignment }) => (
    <TouchableOpacity
      style={styles.templateCard}
      onPress={() => handleTemplatePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.templateHeader}>
        <View style={styles.templateTitleRow}>
          <Ionicons 
            name={getGoalIcon(item.daily_template.goal) as any} 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.templateTitle} numberOfLines={2}>
            {item.daily_template.title}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.templateInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color={colors.gray[600]} />
          <Text style={styles.infoText}>{item.daily_template.estimated_duration_min} min</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="fitness-outline" size={16} color={colors.gray[600]} />
          <Text style={styles.infoText}>{item.daily_template.exercises_count} ejercicios</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(item.daily_template.level) }]}>
            <Text style={styles.levelText}>{getLevelText(item.daily_template.level)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.frequencySection}>
        <Text style={styles.frequencyLabel}>Días:</Text>
        <Text style={styles.frequencyText}>{item.frequency_days.join(', ')}</Text>
      </View>

      {item.professor_notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notas del profesor:</Text>
          <Text style={styles.notesText} numberOfLines={2}>{item.professor_notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading && templates.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis Plantillas</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando plantillas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && templates.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis Plantillas</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={styles.errorTitle}>Error al cargar plantillas</Text>
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
        <Text style={styles.headerTitle}>Mis Plantillas</Text>
        {professor && (
          <Text style={styles.professorInfo}>Profesor: {professor.name}</Text>
        )}
      </View>

      <View style={styles.filtersContainer}>
        {renderFilterButton('all', 'Todas')}
        {renderFilterButton('active', 'Activas')}
        {renderFilterButton('paused', 'Pausadas')}
        {renderFilterButton('completed', 'Completadas')}
      </View>

      <FlatList
        data={filteredTemplates}
        renderItem={renderTemplateCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color={colors.gray[400]} />
            <Text style={styles.emptyTitle}>
              {statusFilter === 'all' ? 'No tienes plantillas asignadas' : `No hay plantillas ${getStatusText(statusFilter).toLowerCase()}`}
            </Text>
            <Text style={styles.emptyMessage}>
              Tu profesor aún no te ha asignado ninguna rutina de entrenamiento.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
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
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.gray[600],
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  listContainer: {
    padding: 20,
  },
  templateCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  templateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  templateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: colors.gray[600],
    marginLeft: 4,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  frequencySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  frequencyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  frequencyText: {
    fontSize: 14,
    color: colors.gray[600],
    flex: 1,
  },
  notesSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[500],
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: colors.gray[700],
    fontStyle: 'italic',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default TemplatesListScreen;
