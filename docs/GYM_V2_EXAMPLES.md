# 📖 Ejemplos Prácticos - API Gym v2.0

Ejemplos de código para implementar las nuevas funcionalidades.

---

## 1. Obtener Plantillas del Estudiante

### ✅ Nuevo (API v2.0)
```typescript
import { gymService } from '../services/gymService';
import { getTodayTemplates, formatFrequency } from '../utils/gymHelpers';

const MyTemplatesScreen = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await gymService.getMyTemplates();
      
      console.log('Profesor:', response.professor.name);
      console.log('Email:', response.professor.email);
      
      response.templates.forEach(template => {
        console.log('Template:', template.daily_template.title);
        console.log('Período:', template.start_date, '-', template.end_date);
        console.log('Días:', formatFrequency(template.frequency));
        console.log('Tags:', template.daily_template.tags.join(', '));
      });
      
      setData(response);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    // UI here
  );
};
```

---

## 2. Verificar si Hay Entrenamiento Hoy

### ✅ Nuevo (API v2.0)
```typescript
import { getTodayTemplates, getCurrentDayNumber } from '../utils/gymHelpers';

const DashboardScreen = () => {
  const { templates } = useStudentTemplates();
  
  // Método 1: Usando helper
  const todayWorkouts = getTodayTemplates(templates);
  
  // Método 2: Manual
  const today = getCurrentDayNumber(); // 0=Dom, 1=Lun, ..., 6=Sáb
  const hasWorkoutToday = templates.some(template => 
    template.status === 'active' && 
    template.frequency.includes(today)
  );

  return (
    <View>
      {todayWorkouts.length > 0 ? (
        <View>
          <Text>Tienes {todayWorkouts.length} entrenamiento(s) hoy</Text>
          {todayWorkouts.map(template => (
            <WorkoutCard key={template.id} template={template} />
          ))}
        </View>
      ) : (
        <Text>Día de descanso</Text>
      )}
    </View>
  );
};
```

### ❌ Antiguo (API v1.0 - NO usar)
```typescript
// DEPRECATED - No usar
const todayName = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
const todayCapitalized = todayName.charAt(0).toUpperCase() + todayName.slice(1);

const todayTemplate = templates.find(template => 
  template.frequency_days.includes(todayCapitalized) // ❌ Este campo ya no existe
);
```

---

## 3. Mostrar Calendario Semanal

### ✅ Nuevo (API v2.0)
```typescript
import { gymService } from '../services/gymService';

const WeeklyCalendarScreen = () => {
  const [calendar, setCalendar] = useState(null);

  useEffect(() => {
    loadCalendar();
  }, []);

  const loadCalendar = async () => {
    try {
      const data = await gymService.getMyWeeklyCalendar();
      
      console.log('Semana:', data.week_start, '-', data.week_end);
      
      data.days.forEach(day => {
        console.log(day.date, '-', day.day_name);
        console.log('Tiene entrenamientos:', day.has_workouts);
        
        if (day.assignments.length > 0) {
          day.assignments.forEach(assignment => {
            console.log('  -', assignment.daily_template.title);
            console.log('   Duración:', assignment.daily_template.estimated_duration_min, 'min');
          });
        }
      });
      
      setCalendar(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <ScrollView>
      {calendar?.days.map(day => (
        <View key={day.date}>
          <Text>{day.day_short} {day.date}</Text>
          
          {day.has_workouts ? (
            day.assignments.map(assignment => (
              <TouchableOpacity 
                key={assignment.id}
                onPress={() => handleWorkoutPress(assignment)}
              >
                <Text>{assignment.daily_template.title}</Text>
                <Text>{assignment.daily_template.estimated_duration_min} min</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>Descanso</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};
```

---

## 4. Detalles de Plantilla con Ejercicios

### ✅ Nuevo (API v2.0)
```typescript
import { gymService } from '../services/gymService';
import { formatReps, formatRestTime } from '../utils/gymHelpers';

const TemplateDetailScreen = ({ route }) => {
  const { templateId } = route.params;
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      const data = await gymService.getTemplateDetails(templateId);
      
      console.log('Título:', data.title);
      
      data.exercises.forEach(exercise => {
        console.log('\nEjercicio:', exercise.name);
        console.log('ID:', exercise.id); // ✅ Nuevo en v2.0
        
        // ✅ Músculos como array
        if (exercise.target_muscle_groups) {
          console.log('Músculos:', exercise.target_muscle_groups.join(', '));
        }
        
        console.log('Equipamiento:', exercise.equipment);
        console.log('Dificultad:', exercise.difficulty);
        
        exercise.sets.forEach(set => {
          console.log(`  Set ${set.set_number}:`, 
            formatReps(set.reps_min, set.reps_max, set.reps),
            '@', set.rpe_target ? `RPE ${set.rpe_target}` : '-',
            '/', formatRestTime(set.rest_seconds)
          );
        });
      });
      
      setWorkout(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <ScrollView>
      <Text style={styles.title}>{workout?.title}</Text>
      
      {workout?.exercises.map((exercise, index) => (
        <View key={exercise.id}>
          <Text>{index + 1}. {exercise.name}</Text>
          
          {/* Mostrar músculos como chips */}
          {exercise.target_muscle_groups && (
            <View style={styles.musclesContainer}>
              {exercise.target_muscle_groups.map((muscle, idx) => (
                <View key={idx} style={styles.muscleBadge}>
                  <Text>{muscle}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Sets */}
          {exercise.sets.map(set => (
            <View key={set.id}>
              <Text>
                Set {set.set_number}: {formatReps(set.reps_min, set.reps_max, set.reps)}
              </Text>
              <Text>Descanso: {formatRestTime(set.rest_seconds)}</Text>
              {set.rpe_target && <Text>RPE: {set.rpe_target}/10</Text>}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};
```

---

## 5. Iniciar Entrenamiento y Guardar Progreso Localmente

### ✅ Nuevo (API v2.0)
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalWorkoutState, ExerciseProgress, SetProgress } from '../types/gym';

const ActiveWorkoutScreen = ({ route }) => {
  const { sessionId, templateId, exercises } = route.params;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercisesProgress, setExercisesProgress] = useState<ExerciseProgress[]>([]);

  // Inicializar progreso
  useEffect(() => {
    initializeProgress();
  }, []);

  const initializeProgress = async () => {
    // Intentar cargar progreso guardado
    const saved = await AsyncStorage.getItem(`workout_session_${sessionId}`);
    
    if (saved) {
      const state: LocalWorkoutState = JSON.parse(saved);
      setCurrentExerciseIndex(state.current_exercise_index);
      setExercisesProgress(state.exercises_progress);
    } else {
      // Iniciar nuevo entrenamiento
      const initialProgress: ExerciseProgress[] = exercises.map(ex => ({
        exercise_id: ex.id,
        sets: []
      }));
      setExercisesProgress(initialProgress);
    }
  };

  // Guardar set completado
  const handleSetComplete = async (
    exerciseId: number, 
    setNumber: number,
    repsCompleted: number,
    weight?: number,
    rpeActual?: number,
    notes?: string
  ) => {
    const newSetProgress: SetProgress = {
      set_number: setNumber,
      reps_completed: repsCompleted,
      weight: weight || null,
      rpe_actual: rpeActual || null,
      notes: notes || null
    };

    // Actualizar estado
    const updatedProgress = exercisesProgress.map(ep => {
      if (ep.exercise_id === exerciseId) {
        return {
          ...ep,
          sets: [...ep.sets, newSetProgress]
        };
      }
      return ep;
    });

    setExercisesProgress(updatedProgress);

    // Guardar localmente
    const localState: LocalWorkoutState = {
      session_id: sessionId,
      template_id: templateId,
      started_at: new Date().toISOString(),
      current_exercise_index: currentExerciseIndex,
      exercises_progress: updatedProgress,
      is_synced: false
    };

    await AsyncStorage.setItem(
      `workout_session_${sessionId}`,
      JSON.stringify(localState)
    );
  };

  return (
    <View>
      {/* UI del entrenamiento */}
      <Text>Ejercicio {currentExerciseIndex + 1} de {exercises.length}</Text>
      
      {/* Inputs de progreso */}
      <TextInput 
        placeholder="Repeticiones"
        keyboardType="numeric"
        onChangeText={(text) => setRepsInput(parseInt(text))}
      />
      
      <TextInput 
        placeholder="Peso (kg)"
        keyboardType="numeric"
        onChangeText={(text) => setWeightInput(parseFloat(text))}
      />
      
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={0.5}
        onValueChange={setRpeInput}
      />
      <Text>RPE: {rpeInput.toFixed(1)}/10</Text>
      
      <Button 
        title="Set Completado"
        onPress={() => handleSetComplete(
          exercises[currentExerciseIndex].id,
          currentSetNumber,
          repsInput,
          weightInput,
          rpeInput
        )}
      />
    </View>
  );
};
```

---

## 6. Finalizar Entrenamiento y Enviar al Backend

### ✅ Nuevo (API v2.0)
```typescript
import { gymService } from '../services/gymService';
import { CompleteSessionRequest } from '../types/gym';

const WorkoutSummaryScreen = ({ route }) => {
  const { sessionId, exercisesProgress } = route.params;
  const [studentNotes, setStudentNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const requestData: CompleteSessionRequest = {
        exercise_progress: exercisesProgress,
        student_notes: studentNotes || null,
        completed_at: new Date().toISOString()
      };

      // Enviar al backend
      const response = await gymService.completeSession(sessionId, requestData);

      console.log('Sesión completada:', response.session_id);
      console.log('Ejercicios completados:', response.exercises_completed);
      console.log('Total de ejercicios:', response.total_exercises);

      // Limpiar datos locales
      await AsyncStorage.removeItem(`workout_session_${sessionId}`);

      // Mostrar confirmación
      Alert.alert(
        '¡Excelente trabajo!',
        `Entrenamiento guardado: ${response.exercises_completed}/${response.total_exercises} ejercicios completados`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('GymDashboard')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el entrenamiento. Intenta nuevamente.');
      console.error('Error al completar sesión:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View>
      <Text>Resumen del Entrenamiento</Text>
      
      {/* Estadísticas */}
      <Text>Ejercicios: {exercisesProgress.length}</Text>
      <Text>Sets totales: {exercisesProgress.reduce((acc, ex) => acc + ex.sets.length, 0)}</Text>
      
      {/* Notas del estudiante */}
      <TextInput
        placeholder="¿Cómo te sentiste hoy?"
        multiline
        value={studentNotes}
        onChangeText={setStudentNotes}
      />
      
      <Button 
        title={submitting ? "Enviando..." : "Finalizar Entrenamiento"}
        onPress={handleSubmit}
        disabled={submitting}
      />
    </View>
  );
};
```

---

## 7. Ver Historial de Entrenamientos

### ✅ Nuevo (API v2.0)
```typescript
import { gymService } from '../services/gymService';
import { WorkoutSession } from '../types/gym';
import { getStatusLabel, getStatusColor } from '../utils/gymHelpers';

const ProgressHistoryScreen = () => {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      // Obtener solo completadas
      const completedSessions = await gymService.getMyProgress('completed');
      setSessions(completedSessions);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSessionPress = async (sessionId: number) => {
    try {
      const details = await gymService.getSessionDetails(sessionId);
      
      console.log('Fecha:', details.scheduled_date);
      console.log('Completado:', details.completed_at);
      console.log('Notas:', details.student_notes);
      console.log('Feedback profesor:', details.professor_feedback);
      console.log('Rating:', details.rating);
      
      navigation.navigate('SessionDetail', { session: details });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <FlatList
      data={sessions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleSessionPress(item.id)}>
          <View>
            <Text>{item.scheduled_date}</Text>
            <Text style={{ color: getStatusColor(item.status) }}>
              {getStatusLabel(item.status)}
            </Text>
            {item.rating && <Text>⭐ {item.rating.toFixed(1)}/5.0</Text>}
            {item.professor_feedback && <Text>✉️ Hay feedback del profesor</Text>}
          </View>
        </TouchableOpacity>
      )}
    />
  );
};
```

---

## 8. Mostrar Próximos Entrenamientos

### ✅ Nuevo (API v2.0)
```typescript
import { getUpcomingWorkouts, formatDateRange } from '../utils/gymHelpers';

const DashboardScreen = () => {
  const { templates } = useStudentTemplates();
  
  const upcoming = getUpcomingWorkouts(templates, 7); // Próximos 7 días

  return (
    <View>
      <Text>Próximos Entrenamientos</Text>
      
      {upcoming.map(({ date, templates: dayTemplates }) => (
        <View key={date.toISOString()}>
          <Text>{date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          
          {dayTemplates.map(template => (
            <View key={template.id}>
              <Text>{template.daily_template.title}</Text>
              <Text>{template.daily_template.estimated_duration_min} min</Text>
              <Text>Vigencia: {formatDateRange(template.start_date, template.end_date)}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};
```

---

## 9. Helpers de Formato

### ✅ Uso de Helpers
```typescript
import { 
  formatReps, 
  formatRestTime, 
  formatRPE,
  formatDuration,
  getGoalLabel,
  getLevelLabel
} from '../utils/gymHelpers';

// Reps
formatReps(8, 12);        // "8-12"
formatReps(10, 10);       // "10"
formatReps(undefined, undefined, "A determinar"); // "A determinar"

// Descanso
formatRestTime(90);       // "1:30 min"
formatRestTime(120);      // "2 min"
formatRestTime(45);       // "45 seg"

// RPE
formatRPE(8.5);           // "RPE 8.5/10"
formatRPE(null);          // "-"

// Duración
formatDuration(3665);     // "1:01:05"
formatDuration(125);      // "2:05"

// Labels
getGoalLabel('strength');          // "Fuerza"
getGoalLabel('hypertrophy');       // "Hipertrofia"
getLevelLabel('intermediate');     // "Intermedio"
```

---

## 10. Manejo de Errores

### ✅ Manejo Completo
```typescript
import { gymService } from '../services/gymService';
import { GymError } from '../types/gym';

const MyComponent = () => {
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const data = await gymService.getMyTemplates();
      // Procesar data...
    } catch (err: any) {
      const gymError = err as GymError;
      
      switch (gymError.code) {
        case 'UNAUTHORIZED':
          // Sesión expirada
          setError('Tu sesión expiró. Por favor inicia sesión nuevamente.');
          navigation.navigate('Login');
          break;
          
        case 'NETWORK_ERROR':
          // Sin conexión
          setError('Sin conexión a internet. Verifica tu red.');
          break;
          
        case 'NOT_FOUND':
          // No encontrado
          setError('No se encontró la información solicitada.');
          break;
          
        case 'SERVER_ERROR':
          // Error del servidor
          setError('Error del servidor. Intenta más tarde.');
          break;
          
        default:
          setError(gymError.userMessage || 'Error inesperado');
      }
    }
  };

  return (
    <View>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Reintentar" onPress={loadData} />
        </View>
      )}
      {/* Rest of UI */}
    </View>
  );
};
```

---

## 📚 Referencias

- [Tipos TypeScript](../src/types/gym.ts)
- [Servicio Gym](../src/services/gymService.ts)
- [Helpers Gym](../src/utils/gymHelpers.ts)
- [Plan de Migración](./GYM_V2_MIGRATION_PLAN.md)
- [Resumen Ejecutivo](./GYM_V2_SUMMARY.md)

---

**Última actualización:** 2025-10-03
