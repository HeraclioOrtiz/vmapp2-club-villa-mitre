# VMApp2 - Club Villa Mitre App

Una aplicación móvil React Native + Expo para la gestión del Club Villa Mitre con arquitectura Redux y mock API.

## 🚀 Instalación y Setup

### 1. Instalar dependencias

```bash
npm install @reduxjs/toolkit react-redux redux-persist miragejs @react-native-async-storage/async-storage
```

### 2. Ejecutar la aplicación

```bash
# Para web (recomendado para desarrollo)
npm run web

# Para móvil físico
npm start
# Luego escanear QR con Expo Go

# Para simuladores
npm run android  # Android
npm run ios      # iOS (solo macOS)
```

## 📁 Arquitectura del Proyecto

```
src/
├── types/              # Interfaces TypeScript
├── store/              # Redux store y slices
├── services/           # Servicios API
├── mirage/            # Mock server
├── hooks/             # Custom hooks
├── providers/         # React providers
└── utils/             # Utilidades
```

## 🔧 Funcionalidades Implementadas

### ✅ Redux Store Completo
- **Auth**: Autenticación con persistencia
- **Actividades**: Gestión de actividades deportivas
- **Beneficios**: Áreas y servicios del club
- **Cupones**: Sistema de cupones con categorías
- **Puntos**: Sistema de puntos y canje
- **Locales**: Ubicaciones para mapas

### ✅ Mock API con Mirage.js
- Datos realistas para desarrollo
- Endpoints completos para todas las funcionalidades
- Simulación de delays de red

### ✅ Screens Refactorizadas
- **LoginScreen**: Integrado con Redux auth
- **MisActividadesScreen**: Carga datos desde Redux
- Manejo de loading states y errores

## 🎯 Uso de la Nueva Arquitectura

### Custom Hooks Disponibles

```typescript
// Autenticación
const { login, logout, user, isAuthenticated, loading, error } = useAuth();

// Actividades
const { actividades, loading, error, loadActividades } = useActividades();

// Beneficios
const { beneficios, loading, error } = useBeneficios();

// Cupones
const { cupones, categoriaSeleccionada, selectCategoria } = useCupones();

// Puntos
const { puntos, loading, canjear } = usePuntos();

// Locales
const { locales, loading } = useLocales();
```

### Ejemplo de Integración

```typescript
import { useActividades } from '../src/hooks/useActividades';

function MiScreen() {
  const { actividades, loading, error } = useActividades();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;
  
  return (
    <View>
      {actividades.map(actividad => (
        <ActividadCard key={actividad.id} actividad={actividad} />
      ))}
    </View>
  );
}
```

## 🔄 Estado de Migración

### ✅ Completado
- Arquitectura Redux base
- Mock server Mirage.js
- LoginScreen refactorizado
- MisActividadesScreen refactorizado
- Custom hooks implementados

### 🔄 Pendiente
- MisBeneficiosScreen
- MisCuponesScreen
- MisPuntosScreen
- MiCarnetScreen
- Integración de mapas con Redux

## 🧪 Testing

### Credenciales de Login (Mock)
- **Email**: cualquier email válido
- **Password**: cualquier contraseña

### Datos Mock Disponibles
- 16 actividades deportivas
- 7 áreas de beneficios
- 6 cupones con categorías
- Sistema de puntos funcional
- 3 locales para mapas

## 🛠️ Próximos Pasos

1. **Completar migración de screens restantes**
2. **Integrar mapas con Redux**
3. **Agregar persistencia offline**
4. **Implementar autenticación real**
5. **Testing unitario**

## 📱 Compatibilidad

- ✅ **Web**: Funciona completamente
- ✅ **iOS**: Compatible con Expo Go
- ✅ **Android**: Compatible con Expo Go
- ✅ **Cross-platform**: Mapas adaptativos (Leaflet/Native)

## 🎨 Características UI/UX

- Diseño responsive
- Loading states elegantes
- Manejo de errores con alertas
- Navegación fluida
- Carnet digital con QR/códigos de barras
- Gráficos interactivos para puntos

---

**Desarrollado con React Native + Expo + Redux Toolkit + TypeScript**
