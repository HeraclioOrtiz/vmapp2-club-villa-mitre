# Villa Mitre App - Arquitectura del Proyecto

## Información General

**Proyecto**: Villa Mitre App  
**Tecnología**: React Native con Expo  
**Backend**: Laravel API (surtekbb.com)  
**Estado**: En desarrollo/producción  

## Estructura del Proyecto

```
vmapp2/
├── src/
│   ├── components/          # Componentes reutilizables de UI
│   ├── constants/           # Constantes de la aplicación
│   ├── hooks/              # Custom hooks de React
│   ├── mirage/             # Mock server para desarrollo
│   ├── providers/          # Context providers (Auth, etc.)
│   ├── screens/            # Pantallas principales de la app
│   ├── services/           # Servicios para llamadas API
│   ├── store/              # Estado global (Redux/Zustand)
│   │   └── slices/         # Slices del store
│   ├── styles/             # Estilos globales y temas
│   ├── types/              # Definiciones de TypeScript
│   └── utils/              # Utilidades y helpers
├── assets/                 # Recursos estáticos (imágenes, fonts)
├── docs/                   # Documentación del proyecto
├── types/                  # Tipos TypeScript globales
├── app.json               # Configuración de Expo
├── eas.json               # Configuración de EAS Build
└── package.json           # Dependencias y scripts
```

## Arquitectura de la Aplicación

### 1. Frontend (React Native + Expo)

#### Navegación
- **Biblioteca**: React Navigation
- **Estructura**: Stack Navigator principal
- **Autenticación**: Navegación condicional basada en estado de auth

#### Estado Global
- **Gestión**: Redux Toolkit / Context API
- **Persistencia**: AsyncStorage para datos locales
- **Slices principales**:
  - `authSlice`: Autenticación y usuario
  - `userSlice`: Datos del usuario
  - Otros slices según funcionalidad

#### Servicios API
- **Cliente HTTP**: Axios
- **Base URL**: Configurable via environment
- **Interceptors**: Para autenticación y manejo de errores
- **Servicios principales**:
  - `authService`: Login/registro
  - `estadoCuentaService`: Estado de cuenta
  - `userService`: Gestión de usuarios

### 2. Backend Integration

#### API Endpoints
- **Base URL**: `http://surtekbb.com/api`
- **Autenticación**: Token-based (Bearer)
- **Formato**: JSON REST API

#### Principales Endpoints
```
POST /auth/login          # Autenticación
POST /auth/register       # Registro
GET  /user/profile        # Perfil del usuario
GET  /estado-cuenta       # Estado de cuenta
GET  /actividades         # Actividades del club
```

### 3. Configuración de Entornos

#### Variables de Entorno
```bash
API_BASE_URL=http://surtekbb.com/api
USE_MIRAGE_SERVER=false
APP_VERSION=1.0.0
```

#### Configuración por Entorno
- **Desarrollo**: Mirage.js para mock data
- **Staging**: API de desarrollo
- **Producción**: API de producción

### 4. Build y Deployment

#### Expo Application Services (EAS)
- **Perfiles de build**:
  - `development`: Para desarrollo con dev client
  - `preview`: Para testing interno
  - `production`: Para distribución final

#### Configuración Android
- **Package ID**: `com.villamitre.vmapp2`
- **Permisos**: Cámara, ubicación
- **HTTP Support**: Configurado via `expo-build-properties`

## Patrones de Diseño Utilizados

### 1. Service Layer Pattern
- Separación clara entre UI y lógica de negocio
- Servicios dedicados para cada dominio de la API

### 2. Provider Pattern
- Context providers para estado global
- AuthProvider para manejo de autenticación

### 3. Custom Hooks Pattern
- Hooks reutilizables para lógica común
- Separación de concerns en componentes

### 4. Environment Configuration Pattern
- Configuración centralizada en `environment.ts`
- Fallbacks y validación de configuración

## Flujo de Datos

```
UI Component → Custom Hook → Service → API
     ↓              ↓          ↓        ↓
State Update ← Store ← Response ← Backend
```

## Seguridad

### 1. Autenticación
- JWT tokens para autenticación
- Refresh token mechanism
- Logout automático en expiración

### 2. Network Security
- HTTPS en producción (pendiente certificado SSL)
- HTTP temporal con `usesCleartextTraffic`
- Validación de certificados

### 3. Datos Sensibles
- No hardcodeo de API keys
- Variables de entorno para configuración
- Encriptación de datos locales sensibles

## Testing

### 1. Estrategia de Testing
- Unit tests para utilidades y servicios
- Integration tests para flujos críticos
- E2E tests para funcionalidades principales

### 2. Mock Data
- Mirage.js para desarrollo sin backend
- Datos de prueba consistentes
- Toggle entre real API y mock

## Performance

### 1. Optimizaciones
- Lazy loading de pantallas
- Memoización de componentes pesados
- Optimización de imágenes

### 2. Caching
- AsyncStorage para datos persistentes
- Cache de respuestas API críticas
- Invalidación inteligente de cache

## Próximos Pasos

1. **SSL Certificate**: Migrar a HTTPS completo
2. **Push Notifications**: Implementar notificaciones
3. **Offline Support**: Funcionalidad offline básica
4. **Performance Monitoring**: Integrar herramientas de monitoreo
5. **Automated Testing**: Expandir cobertura de tests

## Documentación Relacionada

- [API Contracts](./API-MOBILE-CONTRACTS.md)
- [Frontend Changes Required](./FRONTEND-CHANGES-REQUIRED.md)
- [Network Troubleshooting](./NETWORK_TROUBLESHOOTING.md)
- [Dependencies](./DEPENDENCIES.md)
- [Test Plan](./TEST_PLAN.md)
