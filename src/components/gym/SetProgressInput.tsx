import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { ExerciseSet } from '../../types/gym';
import { SetProgress } from '../../hooks/useActiveWorkout';
import { formatWeightText } from '../../utils/gymHelpers';

interface SetProgressInputProps {
  set: ExerciseSet;
  setNumber: number;
  previousProgress?: SetProgress;
  onComplete: (progress: Partial<SetProgress>) => void;
  onCancel: () => void;
  visible: boolean;
}

export const SetProgressInput: React.FC<SetProgressInputProps> = ({
  set,
  setNumber,
  previousProgress,
  onComplete,
  onCancel,
  visible,
}) => {
  const [reps, setReps] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [rpe, setRpe] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');

  // ✅ Inicializar con valores previos o sugeridos
  useEffect(() => {
    if (visible) {
      // Usar progreso previo si existe
      if (previousProgress) {
        setReps(previousProgress.reps?.toString() || '');
        setWeight(previousProgress.weight?.toString() || '');
        setRpe(previousProgress.rpe);
        setNotes(previousProgress.notes || '');
      } else {
        // Valores sugeridos del set planificado
        const suggestedReps = getSuggestedReps();
        setReps(suggestedReps);
        setWeight('');
        setRpe(null);
        setNotes('');
      }
    }
  }, [visible, previousProgress, set]);

  const getSuggestedReps = (): string => {
    if (set.reps_min && set.reps_max) {
      return set.reps_min.toString(); // Empezar con el mínimo
    }
    if (set.reps && typeof set.reps === 'string') {
      // Extraer número de strings como "8-12" o "10"
      const match = set.reps.match(/^\d+/);
      return match ? match[0] : '';
    }
    return '';
  };

  const getPlannedRepsText = (): string => {
    if (set.reps_min && set.reps_max) {
      return `${set.reps_min}-${set.reps_max} reps`;
    }
    if (set.reps) {
      return `${set.reps} reps`;
    }
    return 'Reps a determinar';
  };

  const handleComplete = () => {
    const repsNum = parseInt(reps);
    const weightNum = parseFloat(weight);

    // Validaciones básicas
    if (!reps || isNaN(repsNum) || repsNum <= 0) {
      Alert.alert('Error', 'Ingresa un número válido de repeticiones');
      return;
    }

    if (weight && (isNaN(weightNum) || weightNum < 0)) {
      Alert.alert('Error', 'Ingresa un peso válido (o déjalo vacío)');
      return;
    }

    if (rpe && (rpe < 1 || rpe > 10)) {
      Alert.alert('Error', 'El RPE debe estar entre 1 y 10');
      return;
    }

    const progress: Partial<SetProgress> = {
      reps: repsNum,
      weight: weight ? weightNum : null,
      rpe,
      notes: notes.trim() || undefined,
    };

    onComplete(progress);
  };

  const handleRpeSelect = (selectedRpe: number) => {
    setRpe(selectedRpe === rpe ? null : selectedRpe);
  };

  const getRpeColor = (rpeValue: number): string => {
    if (rpeValue <= 3) return COLORS.SUCCESS;
    if (rpeValue <= 6) return COLORS.WARNING;
    if (rpeValue <= 8) return COLORS.ERROR;
    return '#8B0000'; // Dark red for 9-10
  };

  const getRpeLabel = (rpeValue: number): string => {
    const labels = {
      1: 'Muy fácil',
      2: 'Fácil',
      3: 'Moderado',
      4: 'Algo difícil',
      5: 'Difícil',
      6: 'Muy difícil',
      7: 'Extremo',
      8: 'Máximo-1',
      9: 'Máximo-2',
      10: 'Máximo',
    };
    return labels[rpeValue as keyof typeof labels] || '';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Serie {setNumber}</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.TEXT_SECONDARY} />
            </TouchableOpacity>
          </View>

          {/* Planned vs Actual */}
          <View style={styles.plannedSection}>
            <Text style={styles.plannedLabel}>Planificado:</Text>
            <Text style={styles.plannedText}>{getPlannedRepsText()}</Text>
            {(set.weight_target || set.weight_min || set.weight_max || set.weight) && (
              <Text style={styles.plannedText}>Peso: {formatWeightText(set)}</Text>
            )}
          </View>

          {/* Reps Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Repeticiones realizadas *</Text>
            <TextInput
              style={styles.numberInput}
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"
              placeholder="Ej: 10"
              placeholderTextColor={COLORS.TEXT_TERTIARY}
              autoFocus={true}
              autoComplete="off"
              textContentType="none"
              importantForAutofill="no"
              spellCheck={false}
              autoCorrect={false}
              keyboardAppearance="light"
              returnKeyType="next"
            />
          </View>

          {/* Weight Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Peso usado (kg)</Text>
            <TextInput
              style={styles.numberInput}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder="Ej: 20.5"
              placeholderTextColor={COLORS.TEXT_TERTIARY}
              autoComplete="off"
              textContentType="none"
              importantForAutofill="no"
              spellCheck={false}
              autoCorrect={false}
              keyboardAppearance="light"
            />
          </View>

          {/* RPE Selector */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>
              RPE - Esfuerzo Percibido {rpe && `(${rpe}/10)`}
            </Text>
            {rpe && (
              <Text style={styles.rpeDescription}>{getRpeLabel(rpe)}</Text>
            )}
            <View style={styles.rpeContainer}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.rpeButton,
                    rpe === value && {
                      backgroundColor: getRpeColor(value),
                      borderColor: getRpeColor(value),
                    },
                  ]}
                  onPress={() => handleRpeSelect(value)}
                >
                  <Text
                    style={[
                      styles.rpeButtonText,
                      rpe === value && styles.rpeButtonTextSelected,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Notas (opcional)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Ej: Técnica perfecta, sin dolor"
              placeholderTextColor={COLORS.TEXT_TERTIARY}
              multiline={true}
              numberOfLines={2}
              autoComplete="off"
              textContentType="none"
              importantForAutofill="no"
              spellCheck={false}
              autoCorrect={false}
              keyboardAppearance="light"
              returnKeyType="done"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={handleComplete}
            >
              <Ionicons name="checkmark" size={20} color={COLORS.WHITE} />
              <Text style={styles.completeButtonText}>Completar Serie</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  closeButton: {
    padding: 4,
  },
  plannedSection: {
    backgroundColor: COLORS.GRAY_LIGHTEST,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  plannedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  plannedText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  numberInput: {
    borderWidth: 2,
    borderColor: COLORS.GRAY_LIGHT,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: COLORS.WHITE,
  },
  notesInput: {
    borderWidth: 2,
    borderColor: COLORS.GRAY_LIGHT,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: COLORS.WHITE,
    textAlignVertical: 'top',
  },
  rpeDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  rpeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rpeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.GRAY_LIGHT,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rpeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
  },
  rpeButtonTextSelected: {
    color: COLORS.WHITE,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  completeButton: {
    backgroundColor: COLORS.PRIMARY_GREEN,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
});

export default SetProgressInput;
