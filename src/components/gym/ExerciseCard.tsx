import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { Ionicons } from '@expo/vector-icons';
import { Exercise } from '../../types/gym';
import { gymService } from '../../services/gymService';
import { COLORS } from '../../constants/colors';
import { formatReps, formatRestTime, getLevelLabel, formatWeightText } from '../../utils/gymHelpers';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onPress,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return COLORS.SUCCESS;
      case 'intermediate': return COLORS.WARNING;
      case 'advanced': return COLORS.ERROR;
      default: return COLORS.GRAY_MEDIUM;
    }
  };

  const getDifficultyText = (difficulty?: string) => {
    return getLevelLabel(difficulty || 'intermediate'); // ✅ Usar helper
  };

  return (
    <View style={styles.container}>
      {/* Exercise Header */}
      <TouchableOpacity 
        style={styles.header}
        onPress={onPress || toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <View style={styles.orderBadge}>
            <Text style={styles.orderText}>{exercise.order}</Text>
          </View>
          
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.exerciseMeta}>
              <Text style={styles.setsCount}>
                {exercise.sets.length} serie{exercise.sets.length !== 1 ? 's' : ''}
              </Text>
              
              {/* ✅ NUEVO: Mostrar múltiples músculos como badges */}
              {exercise.target_muscle_groups && exercise.target_muscle_groups.length > 0 ? (
                <View style={styles.musclesContainer}>
                  {exercise.target_muscle_groups.slice(0, 2).map((muscle, index) => (
                    <View key={index} style={styles.muscleBadge}>
                      <Ionicons name="body-outline" size={10} color={COLORS.PRIMARY_GREEN} />
                      <Text style={styles.muscleText}>{muscle}</Text>
                    </View>
                  ))}
                  {exercise.target_muscle_groups.length > 2 && (
                    <Text style={styles.moreText}>+{exercise.target_muscle_groups.length - 2}</Text>
                  )}
                </View>
              ) : (
                <View style={styles.metaBadge}>
                  <Ionicons name="body-outline" size={12} color={COLORS.PRIMARY_GREEN} />
                  <Text style={styles.badgeText}>
                    {exercise.muscle_group || 'General'}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={[styles.expandIcon, expanded && { transform: [{ rotate: '180deg' }] }]}>
            <Ionicons name="chevron-down" size={20} color={COLORS.GRAY_MEDIUM} />
          </View>
        </View>

        {/* Exercise Details Row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailBadge}>
            <Ionicons name="fitness-outline" size={14} color={COLORS.PRIMARY_GREEN} />
            <Text style={styles.detailText}>
              {exercise.equipment || 'Ninguno'}
            </Text>
          </View>
          
          <View style={[styles.detailBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) + '20' }]}>
            <Ionicons name="trending-up-outline" size={14} color={getDifficultyColor(exercise.difficulty)} />
            <Text style={[styles.detailText, { color: getDifficultyColor(exercise.difficulty) }]}>
              {getDifficultyText(exercise.difficulty)}
            </Text>
          </View>
        </View>
        
        {exercise.notes && (
          <View style={styles.notesContainer}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.INFO} />
            <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Expandable Sets Details */}
      {expanded && (
        <View style={styles.setsContainer}>
          <View style={styles.setsContent}>
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Instrucciones:</Text>
              <Text style={styles.instructionsText}>
                {exercise.instructions || 'No hay instrucciones específicas disponibles para este ejercicio.'}
              </Text>
            </View>

            <Text style={styles.setsTitle}>Series:</Text>
            {exercise.sets.map((set, index) => (
              <View key={index} style={styles.setRow}>
                <View style={styles.setNumber}>
                  <Text style={styles.setNumberText}>{index + 1}</Text>
                </View>
                
                <View style={styles.setDetails}>
                  <View style={styles.setMainInfo}>
                    <Text style={styles.repsText}>
                      {formatReps(set.reps_min, set.reps_max, set.reps)} {set.reps !== 'A determinar' ? 'reps' : ''}
                    </Text>
                    <Text style={styles.restText}>
                      <Ionicons name="time-outline" size={14} color={COLORS.GRAY_MEDIUM} />
                      {' '}{formatRestTime(set.rest_seconds)}
                    </Text>
                  </View>
                  
                  {/* Peso destacado */}
                  {(set.weight_target || set.weight_min || set.weight_max || set.weight) && (
                    <View style={styles.weightHighlight}>
                      <View style={styles.weightIconContainer}>
                        <Ionicons name="barbell" size={20} color={COLORS.PRIMARY_GREEN} />
                      </View>
                      <View style={styles.weightInfoContainer}>
                        <Text style={styles.weightLabel}>Peso recomendado</Text>
                        <View style={styles.weightValueRow}>
                          <Text style={styles.weightValue}>{formatWeightText(set)}</Text>
                          {set.weight_min && set.weight_max && set.weight_target && (
                            <View style={styles.weightBadges}>
                              <View style={styles.weightBadge}>
                                <Text style={styles.weightBadgeLabel}>Mín</Text>
                                <Text style={styles.weightBadgeValue}>{set.weight_min}</Text>
                              </View>
                              <View style={styles.weightBadge}>
                                <Text style={styles.weightBadgeLabel}>Obj</Text>
                                <Text style={styles.weightBadgeValue}>{set.weight_target}</Text>
                              </View>
                              <View style={styles.weightBadge}>
                                <Text style={styles.weightBadgeLabel}>Máx</Text>
                                <Text style={styles.weightBadgeValue}>{set.weight_max}</Text>
                              </View>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                  
                  {/* Información adicional del set */}
                  <View style={styles.setExtraInfo}>
                    {set.duration !== null && set.duration !== undefined && (
                      <View style={styles.durationBadge}>
                        <Ionicons name="timer-outline" size={14} color={COLORS.INFO} />
                        <Text style={styles.durationText}>
                          {' '}Duración: {set.duration}s
                        </Text>
                      </View>
                    )}
                  </View>
                    
                  <View style={styles.setMeta}>
                    {set.tempo && (
                      <Text style={styles.tempoText}>
                        <Ionicons name="speedometer-outline" size={12} color={COLORS.INFO} />
                        {' '}Tempo: {set.tempo}
                      </Text>
                    )}
                    
                    {set.rpe_target && (
                      <Text style={styles.rpeText}>
                        <Ionicons name="pulse-outline" size={12} color={COLORS.WARNING} />
                        {' '}RPE: {set.rpe_target}/10
                      </Text>
                    )}
                  </View>
                  
                  {set.notes && (
                    <Text style={styles.setNotes}>
                      <Ionicons name="chatbubble-outline" size={12} color={COLORS.GRAY_MEDIUM} />
                      {' '}{set.notes}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY_GREEN,
  },
  header: {
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.PRIMARY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  setsCount: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  expandIcon: {
    padding: 4,
  },
  expandText: {
    fontSize: 12,
    color: COLORS.PRIMARY_GREEN,
  },
  exerciseNotes: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
    marginTop: 4,
    marginLeft: 8,
    flex: 1,
  },
  setsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHTEST,
  },
  setsContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  setNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.GRAY_LIGHTEST,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  setNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  setDetails: {
    flex: 1,
  },
  repsText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  setMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  restText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  tempoText: {
    fontSize: 12,
    color: COLORS.INFO,
  },
  rpeText: {
    fontSize: 12,
    color: COLORS.WARNING,
    fontWeight: '500',
  },
  setNotes: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
    fontStyle: 'italic',
    marginTop: 4,
  },
  // New styles for enhanced exercise card
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY_LIGHTEST,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    color: COLORS.PRIMARY_GREEN,
    marginLeft: 4,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY_LIGHTEST,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailText: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 4,
  },
  // ✅ NUEVOS: Estilos para múltiples músculos
  musclesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  muscleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_GREEN + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_GREEN + '30',
  },
  muscleText: {
    fontSize: 9,
    color: COLORS.PRIMARY_GREEN,
    marginLeft: 2,
    fontWeight: '500',
  },
  moreText: {
    fontSize: 9,
    color: COLORS.GRAY_MEDIUM,
    fontWeight: '500',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  instructionsContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: COLORS.BACKGROUND_TERTIARY,
    borderRadius: 8,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  setsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  setMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  setExtraInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 4,
  },
  weightText: {
    fontSize: 12,
    color: COLORS.PRIMARY_GREEN,
    fontWeight: '500',
  },
  durationText: {
    fontSize: 12,
    color: COLORS.INFO,
    fontWeight: '500',
  },
  // ✅ NUEVOS ESTILOS PARA PESO DESTACADO
  weightHighlight: {
    flexDirection: 'row',
    backgroundColor: COLORS.PRIMARY_GREEN + '10',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.PRIMARY_GREEN,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  weightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY_GREEN + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  weightInfoContainer: {
    flex: 1,
  },
  weightLabel: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  weightValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  weightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GREEN,
  },
  weightBadges: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  weightBadge: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_GREEN + '30',
    alignItems: 'center',
  },
  weightBadgeLabel: {
    fontSize: 9,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  weightBadgeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GREEN,
    marginTop: 2,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.INFO + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});

export default ExerciseCard;
