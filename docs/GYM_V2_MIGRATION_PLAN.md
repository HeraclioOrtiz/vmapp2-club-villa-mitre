# 🔄 Plan de Migración - API Gym v2.0

**Fecha:** Octubre 2025  
**Estado:** En Progreso  
**Versión API:** 2.0

---

## ✅ COMPLETADO

### 1. Actualización de Tipos TypeScript
- ✅ `Professor` interface actualizada con `id`
- ✅ `TemplateAssignment` con nuevos campos: `start_date`, `end_date`, `frequency`, `assigned_by`, `created_at`
- ✅ `DailyTemplate` con `id`, `tags`, nuevos valores de `goal`
- ✅ `WeeklyPlan` y `DayOverview` reestructurados para API v2.0
- ✅ `DayAssignment` interface creada
- ✅ `Exercise` actualizado con `id`, `target_muscle_groups` (array)
- ✅ `Set` actualizado con `id`, `set_number`, `reps_min`, `reps_max`
- ✅ **NUEVOS:** `WorkoutSession`, `SetProgress`, `ExerciseProgress`, `CompleteSessionRequest`, `CompleteSessionResponse`, `LocalWorkoutState`
- ✅ `SessionStatus` type creado

### 2. Actualización de gymService.ts
- ✅ `getMyTemplates()` actualizado para API v2.0
- ✅ `getTemplateDetails()` actualizado con mapeo de `target_muscle_groups` (array)
- ✅ `getMyWeeklyCalendar()` actualizado con nueva estructura de calendario
- ✅ **NUEVO:** `completeSession()` - Completar sesión de entrenamiento
- ✅ **NUEVO:** `getMyProgress()` - Historial de progreso
- ✅ **NUEVO:** `getSessionDetails()` - Detalles de sesión específica
- ✅ Métodos legacy (`getMyWeek`, `getMyDay`) marcados como deprecated pero mantenidos para compatibilidad

### 3. Compatibilidad Backward
- ✅ Fallbacks para campos opcionales
- ✅ Soporte para estructuras legacy y nuevas
- ✅ Mapeo automático de `target_muscle_groups` (array) → `muscle_group` (string)
- ✅ Valores por defecto apropiados

---

## 🔨 PRÓXIMAS TAREAS

### FASE 2: Actualizar Pantallas Existentes

#### 2.1 GymDashboardScreen.tsx
**Cambios necesarios:**
```typescript
// ANTES (usa frequency_days):
const todayTemplate = templates.find(template => 
  template.status === 'active' && 
  template.frequency_days.includes(todayCapitalized)
);

// AHORA (debe usar frequency con números):
const today = new Date();
const dayNumber = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

const todayTemplate = templates.find(template => 
  template.status === 'active' && 
  template.frequency.includes(dayNumber)
);
```

**Campos adicionales a mostrar:**
- `start_date` y `end_date` del assignment
- `assigned_by.name` del profesor
- Tags de la plantilla

**Prioridad:** ALTA

#### 2.2 TemplatesListScreen.tsx
**Cambios necesarios:**
- Mostrar fechas de vigencia (`start_date` - `end_date`)
- Mostrar días de la semana usando `frequency` array
- Agregar filtro por status: `active`, `paused`, `completed`, `cancelled`

**Prioridad:** ALTA

#### 2.3 WeeklyCalendarScreen.tsx
**Cambios necesarios:**
```typescript
// ANTES:
interface DayOverview {
  has_session: boolean;
  title: string | null;
}

// AHORA:
interface DayOverview {
  has_workouts: boolean;
  assignments: DayAssignment[]; // MÚLTIPLES entrenamientos por día
}
```

**Funcionalidad nueva:**
- Mostrar múltiples entrenamientos por día
- Usar `day_name` y `day_short` del backend
- Navegación entre semanas con parámetro `date`

**Prioridad:** ALTA

#### 2.4 DailyWorkoutScreen.tsx
**Cambios necesarios:**
- Actualizar para usar nuevos campos de `Exercise` y `Set`
- Preparar para recibir `session_id` como parámetro
- Agregar botón "Iniciar Entrenamiento" → Pantalla de ejecución

**Prioridad:** MEDIA

---

### FASE 3: Pantalla de Entrenamiento Activo (NUEVA)

#### 3.1 Crear ActiveWorkoutScreen.tsx

**Props:**
```typescript
interface ActiveWorkoutScreenProps {
  templateId: number;
  sessionId: number;
  exercises: Exercise[];
}
```

**Funcionalidades:**
1. **Timer de descanso** entre sets
2. **Inputs de progreso:**
   - Repeticiones completadas (número)
   - Peso usado (número opcional)
   - RPE percibido (slider 1-10)
   - Notas por set (texto opcional)

3. **Almacenamiento local:**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveLocalProgress = async (sessionId: number, progress: LocalWorkoutState) => {
  await AsyncStorage.setItem(
    `workout_session_${sessionId}`, 
    JSON.stringify(progress)
  );
};
```

4. **Navegación entre ejercicios:**
   - Botón "Set Completado" → Siguiente set
   - Botón "Ejercicio Completado" → Siguiente ejercicio
   - Botón "Finalizar Sesión" → Pantalla de resumen

5. **Barra de progreso:**
   - Sets completados / Sets totales
   - Ejercicios completados / Ejercicios totales

**Prioridad:** ALTA (funcionalidad core)

---

#### 3.2 Crear WorkoutSummaryScreen.tsx

**Funcionalidades:**
1. Resumen post-entrenamiento:
   - Duración total
   - Ejercicios completados
   - Sets totales realizados
   - Comparación vs objetivos (RPE target vs actual)

2. **Envío de progreso:**
```typescript
const handleSubmitProgress = async () => {
  try {
    const progressData: CompleteSessionRequest = {
      exercise_progress: localProgress.exercises_progress,
      student_notes: studentNotes,
      completed_at: new Date().toISOString()
    };

    const result = await gymService.completeSession(sessionId, progressData);
    
    // Limpiar datos locales
    await AsyncStorage.removeItem(`workout_session_${sessionId}`);
    
    // Mostrar confirmación
    Alert.alert('¡Excelente!', 'Entrenamiento guardado correctamente');
    
    // Volver al dashboard
    navigation.navigate('GymDashboard');
  } catch (error) {
    Alert.alert('Error', 'No se pudo guardar el progreso');
  }
};
```

**Prioridad:** ALTA

---

### FASE 4: Historial de Entrenamientos (NUEVA)

#### 4.1 Crear ProgressHistoryScreen.tsx

**Funcionalidades:**
1. Lista de sesiones completadas
2. Filtros por fecha
3. Estadísticas generales

**Llamada API:**
```typescript
const loadHistory = async () => {
  const completedSessions = await gymService.getMyProgress('completed');
  setHistory(completedSessions);
};
```

**Prioridad:** MEDIA

#### 4.2 Crear SessionDetailScreen.tsx

**Funcionalidades:**
1. Ver detalles de sesión pasada
2. Progreso por ejercicio
3. Comparación con objetivos
4. Feedback del profesor (si existe)

**Prioridad:** MEDIA

---

### FASE 5: Hooks Personalizados (NUEVOS)

#### 5.1 useActiveWorkout.ts
```typescript
export const useActiveWorkout = (sessionId: number) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercisesProgress, setExercisesProgress] = useState<ExerciseProgress[]>([]);
  const [isRestMode, setIsRestMode] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);

  const completeSet = (exerciseId: number, setProgress: SetProgress) => {
    // Actualizar progreso local
    // Iniciar timer de descanso
  };

  const completeExercise = () => {
    // Avanzar al siguiente ejercicio
  };

  const saveProgress = async () => {
    // Guardar en AsyncStorage
  };

  return {
    currentExerciseIndex,
    exercisesProgress,
    isRestMode,
    restTimeRemaining,
    completeSet,
    completeExercise,
    saveProgress
  };
};
```

**Prioridad:** ALTA

#### 5.2 useWorkoutTimer.ts
```typescript
export const useWorkoutTimer = () => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = () => {
    setElapsedSeconds(0);
    setIsActive(false);
  };

  const formatTime = () => {
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return { elapsedSeconds, isActive, start, pause, reset, formatTime };
};
```

**Prioridad:** MEDIA

---

### FASE 6: Componentes Reutilizables (NUEVOS)

#### 6.1 RestTimer.tsx
Timer visual de descanso entre sets

**Prioridad:** ALTA

#### 6.2 SetProgressInput.tsx
Input para capturar progreso de un set

**Prioridad:** ALTA

#### 6.3 RPESlider.tsx
Slider 1-10 para capturar RPE percibido

**Prioridad:** MEDIA

#### 6.4 ExerciseBadges.tsx
Badges para mostrar músculos, equipamiento, dificultad

**Prioridad:** BAJA (ya existe parcialmente en ExerciseCard)

---

## 🔧 ACTUALIZACIONES MENORES

### Actualizar ExerciseCard.tsx
- Manejar `target_muscle_groups` como array
- Mostrar múltiples músculos con chips/badges
- Adaptar a nueva estructura de `Set`

**Ejemplo:**
```typescript
// Mostrar músculos
{exercise.target_muscle_groups && exercise.target_muscle_groups.length > 0 ? (
  <View style={styles.musclesContainer}>
    {exercise.target_muscle_groups.map((muscle, index) => (
      <View key={index} style={styles.muscleBadge}>
        <Text style={styles.muscleText}>{muscle}</Text>
      </View>
    ))}
  </View>
) : (
  <Text>{exercise.muscle_group || 'General'}</Text>
)}
```

**Prioridad:** MEDIA

---

## 📊 NAVEGACIÓN ACTUALIZADA

### Agregar nuevas rutas en HomeScreen.tsx (Drawer)
```typescript
<Drawer.Screen 
  name="ActiveWorkout" 
  component={ActiveWorkoutScreen}
  options={{ headerTitle: 'ENTRENAMIENTO EN CURSO' }}
/>
<Drawer.Screen 
  name="WorkoutSummary" 
  component={WorkoutSummaryScreen}
  options={{ headerTitle: 'RESUMEN ENTRENAMIENTO' }}
/>
<Drawer.Screen 
  name="ProgressHistory" 
  component={ProgressHistoryScreen}
  options={{ headerTitle: 'MI PROGRESO' }}
/>
<Drawer.Screen 
  name="SessionDetail" 
  component={SessionDetailScreen}
  options={{ headerTitle: 'DETALLE SESIÓN' }}
/>
```

**Prioridad:** ALTA (después de crear las pantallas)

---

## 🧪 TESTING

### Actualizar tests existentes
- `gymService.test.ts` → Agregar tests para nuevos métodos
- Mockear respuestas API v2.0
- Tests para `completeSession`, `getMyProgress`, `getSessionDetails`

### Crear nuevos tests
- `activeWorkout.test.ts`
- `workoutTimer.test.ts`
- Tests de integración para flujo completo de entrenamiento

**Prioridad:** MEDIA

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

### Crítico (Semana 1)
- [ ] Actualizar GymDashboardScreen para usar `frequency` array
- [ ] Actualizar WeeklyCalendarScreen para manejar múltiples assignments
- [ ] Crear ActiveWorkoutScreen básico
- [ ] Crear hook useActiveWorkout
- [ ] Crear componente RestTimer
- [ ] Crear componente SetProgressInput

### Alta Prioridad (Semana 2)
- [ ] Implementar almacenamiento local de progreso
- [ ] Crear WorkoutSummaryScreen
- [ ] Integrar completeSession API call
- [ ] Actualizar TemplatesListScreen
- [ ] Actualizar DailyWorkoutScreen
- [ ] Agregar navegación entre pantallas nuevas

### Media Prioridad (Semana 3)
- [ ] Crear ProgressHistoryScreen
- [ ] Crear SessionDetailScreen
- [ ] Implementar useWorkoutTimer hook
- [ ] Actualizar ExerciseCard para target_muscle_groups array
- [ ] Agregar validaciones y error handling

### Baja Prioridad (Semana 4+)
- [ ] Agregar animaciones
- [ ] Implementar gráficos de progreso
- [ ] Notificaciones de entrenamiento
- [ ] Modo offline completo
- [ ] Tests completos

---

## 🚨 CONSIDERACIONES IMPORTANTES

### 1. Compatibilidad Backward
Los métodos legacy se mantienen para compatibilidad pero están marcados como `@deprecated`. Migrar gradualmente las pantallas existentes.

### 2. Manejo de Errores
Todos los nuevos métodos usan el mismo sistema de error handling:
```typescript
try {
  const result = await gymService.completeSession(...);
} catch (error: any) {
  if (error.code === 'UNAUTHORIZED') {
    // Redirigir a login
  } else if (error.code === 'NETWORK_ERROR') {
    // Mostrar mensaje de red
  } else {
    // Error genérico
  }
}
```

### 3. Estado Local durante Entrenamiento
Usar AsyncStorage para persistir progreso localmente:
- Clave: `workout_session_${sessionId}`
- Limpiar después de enviar al backend
- Recuperar si app se cierra durante entrenamiento

### 4. Sincronización Offline
Plan futuro: Queue de requests pendientes si no hay conexión

### 5. Rendimiento
- Lazy loading de listas largas
- Cache de imágenes de ejercicios
- Pagination en historial

---

## 📞 SOPORTE

### Endpoints Documentados
Ver `GUIA_VERIFICACION_PANEL_ADMIN_PROFESORES.md` del backend

### Testing
```bash
npm run test:gym  # Tests de gimnasio
npm run test      # Todos los tests
```

### Ambiente de Desarrollo
- URL base: `https://villamitre.loca.lt/api`
- Usuario prueba: DNI "33333333", password "estudiante123"

---

## 🎯 OBJETIVO FINAL

**MVP Funcional (Fin Semana 2):**
- ✅ Ver plantillas asignadas con nuevos campos
- ✅ Calendario semanal con múltiples entrenamientos por día
- ✅ Iniciar entrenamiento
- ✅ Completar sets con progreso
- ✅ Enviar progreso al backend

**Versión Completa (Fin Semana 4):**
- ✅ Todo lo del MVP
- ✅ Historial de entrenamientos
- ✅ Timer de descanso
- ✅ Feedback del profesor
- ✅ Gráficos de progreso

---

**Última actualización:** 2025-10-03  
**Responsable:** Equipo Frontend Mobile
