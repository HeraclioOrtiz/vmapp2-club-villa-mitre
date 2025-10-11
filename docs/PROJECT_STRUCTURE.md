# Estructura del Proyecto Villa Mitre App

## Árbol de Directorios

```
vmapp2/
├── 📁 src/                          # Código fuente principal
│   ├── 📁 components/               # Componentes reutilizables de UI
│   │   ├── common/                  # Componentes comunes (Button, Input, etc.)
│   │   ├── forms/                   # Componentes de formularios
│   │   └── navigation/              # Componentes de navegación
│   │
│   ├── 📁 screens/                  # Pantallas principales de la aplicación
│   │   ├── AuthScreens/             # Pantallas de autenticación
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx           # Pantalla principal
│   │   ├── ProfileScreen.tsx        # Perfil del usuario
│   │   ├── ActividadesScreen.tsx    # Actividades del club
│   │   └── EstadoCuentaScreen.tsx   # Estado de cuenta
│   │
│   ├── 📁 services/                 # Servicios para comunicación con API
│   │   ├── authService.ts           # Autenticación
│   │   ├── estadoCuentaService.ts   # Estado de cuenta
│   │   ├── userService.ts           # Gestión de usuarios
│   │   └── apiClient.ts             # Cliente HTTP base
│   │
│   ├── 📁 store/                    # Estado global de la aplicación
│   │   ├── index.ts                 # Configuración del store
│   │   └── slices/                  # Slices de Redux
│   │       ├── authSlice.ts         # Estado de autenticación
│   │       └── userSlice.ts         # Estado del usuario
│   │
│   ├── 📁 hooks/                    # Custom hooks de React
│   │   ├── useAuth.ts               # Hook de autenticación
│   │   ├── useApi.ts                # Hook para llamadas API
│   │   └── useStorage.ts            # Hook para AsyncStorage
│   │
│   ├── 📁 utils/                    # Utilidades y helpers
│   │   ├── environment.ts           # Configuración de entornos
│   │   ├── storage.ts               # Utilidades de almacenamiento
│   │   ├── validation.ts            # Validaciones
│   │   └── constants.ts             # Constantes globales
│   │
│   ├── 📁 types/                    # Definiciones de TypeScript
│   │   ├── auth.ts                  # Tipos de autenticación
│   │   ├── user.ts                  # Tipos de usuario
│   │   ├── api.ts                   # Tipos de API
│   │   └── navigation.ts            # Tipos de navegación
│   │
│   ├── 📁 styles/                   # Estilos y temas
│   │   ├── theme.ts                 # Tema principal
│   │   ├── colors.ts                # Paleta de colores
│   │   └── typography.ts            # Tipografías
│   │
│   ├── 📁 providers/                # Context providers
│   │   ├── AuthProvider.tsx         # Provider de autenticación
│   │   └── ThemeProvider.tsx        # Provider de tema
│   │
│   ├── 📁 mirage/                   # Mock server para desarrollo
│   │   ├── server.ts                # Configuración del servidor
│   │   ├── factories/               # Factories para datos mock
│   │   └── fixtures/                # Datos de prueba
│   │
│   └── 📁 constants/                # Constantes de la aplicación
│       ├── api.ts                   # URLs y endpoints
│       ├── storage.ts               # Keys de almacenamiento
│       └── navigation.ts            # Rutas de navegación
│
├── 📁 assets/                       # Recursos estáticos
│   ├── images/                      # Imágenes
│   ├── icons/                       # Iconos
│   ├── fonts/                       # Fuentes personalizadas
│   └── splash-icon.png              # Splash screen
│
├── 📁 docs/                         # Documentación del proyecto
│   ├── ARCHITECTURE.md              # Arquitectura del proyecto
│   ├── API-MOBILE-CONTRACTS.md      # Contratos de API
│   ├── DEPENDENCIES.md              # Dependencias y versiones
│   ├── FRONTEND_BACKEND_INTEGRATION.md
│   ├── NETWORK_TROUBLESHOOTING.md   # Solución de problemas de red
│   ├── TEST_PLAN.md                 # Plan de testing
│   └── PROJECT_STRUCTURE.md         # Este archivo
│
├── 📁 types/                        # Tipos TypeScript globales
│   └── global.d.ts                  # Declaraciones globales
│
├── 📄 app.json                      # Configuración de Expo
├── 📄 eas.json                      # Configuración de EAS Build
├── 📄 package.json                  # Dependencias y scripts
├── 📄 tsconfig.json                 # Configuración de TypeScript
├── 📄 .env                          # Variables de entorno
├── 📄 .env.example                  # Ejemplo de variables de entorno
├── 📄 App.tsx                       # Componente raíz de la aplicación
├── 📄 index.js                      # Punto de entrada
└── 📄 README.md                     # Documentación principal
```

## Descripción de Directorios

### 📁 `src/components/`
Componentes reutilizables de UI organizados por categoría:
- **common/**: Componentes básicos (Button, Input, Card, etc.)
- **forms/**: Componentes específicos para formularios
- **navigation/**: Componentes de navegación personalizados

### 📁 `src/screens/`
Pantallas principales de la aplicación. Cada pantalla representa una vista completa:
- Organizadas por funcionalidad
- Incluyen lógica de estado local
- Conectadas al store global cuando es necesario

### 📁 `src/services/`
Servicios para comunicación con APIs externas:
- Un servicio por dominio de negocio
- Manejo centralizado de errores
- Interceptors para autenticación

### 📁 `src/store/`
Estado global de la aplicación usando Redux Toolkit:
- **slices/**: Cada slice maneja un dominio específico
- Configuración centralizada del store
- Middleware para persistencia

### 📁 `src/hooks/`
Custom hooks para lógica reutilizable:
- Encapsulan lógica compleja
- Facilitan testing
- Promueven reutilización de código

### 📁 `src/utils/`
Utilidades y funciones helper:
- **environment.ts**: Configuración de entornos
- **storage.ts**: Wrapper para AsyncStorage
- **validation.ts**: Funciones de validación

### 📁 `src/types/`
Definiciones de TypeScript organizadas por dominio:
- Tipos para entidades de negocio
- Interfaces para APIs
- Tipos para navegación

### 📁 `src/styles/`
Sistema de diseño y estilos:
- **theme.ts**: Configuración del tema
- **colors.ts**: Paleta de colores
- **typography.ts**: Estilos de texto

### 📁 `src/providers/`
Context providers para estado global:
- **AuthProvider**: Manejo de autenticación
- **ThemeProvider**: Gestión de temas

### 📁 `src/mirage/`
Mock server para desarrollo:
- Simula API backend
- Datos de prueba consistentes
- Facilita desarrollo offline

## Convenciones de Nomenclatura

### Archivos
- **Componentes**: PascalCase (`LoginScreen.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useAuth.ts`)
- **Servicios**: camelCase con sufijo `Service` (`authService.ts`)
- **Tipos**: camelCase (`auth.ts`)
- **Utilidades**: camelCase (`environment.ts`)

### Directorios
- **Minúsculas**: Para utilidades y servicios (`utils/`, `services/`)
- **PascalCase**: Para componentes cuando contienen un componente principal

### Variables y Funciones
- **camelCase**: Para variables y funciones
- **PascalCase**: Para componentes React
- **UPPER_SNAKE_CASE**: Para constantes

## Patrones de Organización

### 1. Separación por Dominio
Cada funcionalidad principal tiene su propia carpeta con:
- Componentes específicos
- Tipos relacionados
- Servicios dedicados

### 2. Índices de Barril
Archivos `index.ts` para exportaciones limpias:
```typescript
// src/components/index.ts
export { Button } from './common/Button';
export { LoginForm } from './forms/LoginForm';
```

### 3. Colocación por Proximidad
Archivos relacionados se mantienen cerca:
- Tests junto a componentes
- Tipos junto a servicios que los usan

### 4. Configuración Centralizada
- Variables de entorno en `.env`
- Configuración de build en `app.json` y `eas.json`
- Constantes globales en `src/constants/`

## Flujo de Datos

```
Screen → Hook → Service → API
  ↓       ↓       ↓       ↓
Store ← Action ← Response ← Backend
```

## Mejores Prácticas

1. **Un archivo, una responsabilidad**
2. **Importaciones absolutas** usando path mapping
3. **Exportaciones nombradas** preferidas sobre default
4. **Tipado estricto** con TypeScript
5. **Documentación** en archivos complejos

Esta estructura promueve:
- ✅ Mantenibilidad
- ✅ Escalabilidad  
- ✅ Testabilidad
- ✅ Reutilización de código
- ✅ Separación de responsabilidades
