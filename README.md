# Villa Mitre App

Aplicación móvil para el Club Villa Mitre desarrollada con React Native y Expo.

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn
- Expo CLI
- EAS CLI (para builds)

### Instalación
```bash
# Clonar el repositorio
git clone [repository-url]
cd vmapp2

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar en modo desarrollo
npm start
```

### Desarrollo
```bash
# Iniciar con Expo Go
npm start

# Iniciar en Android
npm run android

# Iniciar en iOS
npm run ios
```

## 📱 Builds

### APK para Android
```bash
# Build de preview (testing)
npm run build:android

# Build de producción
eas build --platform android --profile production
```

### Configuración
- **Package ID**: `com.villamitre.vmapp2`
- **API Base**: `http://surtekbb.com/api`
- **Credenciales de prueba**: DNI `59964604`, Password `password123`

## 📚 Documentación

Toda la documentación del proyecto se encuentra en la carpeta [`docs/`](./docs/):

- **[Arquitectura](./docs/ARCHITECTURE.md)** - Estructura y patrones del proyecto
- **[API Contracts](./docs/API-MOBILE-CONTRACTS.md)** - Documentación de endpoints
- **[Guía de Dependencias](./docs/DEPENDENCIES.md)** - Librerías y versiones
- **[Integración Frontend-Backend](./docs/FRONTEND_BACKEND_INTEGRATION.md)** - Guía de integración
- **[Plan de Testing](./docs/TEST_PLAN.md)** - Estrategia de pruebas
- **[Troubleshooting de Red](./docs/NETWORK_TROUBLESHOOTING.md)** - Solución de problemas

## 🛠️ Tecnologías

- **Frontend**: React Native + Expo
- **Estado**: Redux Toolkit
- **Navegación**: React Navigation
- **HTTP Client**: Axios
- **Testing**: Jest + React Native Testing Library
- **Build**: EAS Build

## 🏗️ Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── screens/        # Pantallas de la app
├── services/       # Servicios API
├── store/          # Estado global
├── utils/          # Utilidades
├── types/          # Tipos TypeScript
└── styles/         # Estilos globales
```

## 🔧 Scripts Disponibles

```bash
npm start           # Iniciar Expo dev server
npm run android     # Ejecutar en Android
npm run ios         # Ejecutar en iOS
npm run web         # Ejecutar en web
npm run build:android   # Build APK Android
npm run build:ios       # Build iOS
npm test            # Ejecutar tests
npm run lint        # Linter
```

## 🌐 Entornos

### Desarrollo
- Mock server con Mirage.js
- Hot reload habilitado
- Debug tools disponibles

### Producción
- API real: `http://surtekbb.com/api`
- Optimizaciones habilitadas
- Error tracking

## 📋 Estado del Proyecto

### Funcionalidades Core
- ✅ Autenticación implementada
- ✅ Navegación configurada
- ✅ Integración API completa
- ✅ Build APK funcional
- 🔄 SSL certificate (pendiente)
- 📋 Push notifications (planificado)

### Sistema Gym (API v2.0)
- ✅ **Tipos TypeScript actualizados** - Soporte completo para API v2.0
- ✅ **gymService migrado** - Nuevos endpoints de sesiones y progreso
- ✅ **Helpers creados** - Utilidades para frecuencias y formateo
- 🔄 **Pantallas en migración** - Dashboard, Calendar, Templates
- 📋 **Entrenamiento activo** - Pantalla en desarrollo
- 📋 **Historial de progreso** - Próxima fase

Ver: [Plan de Migración Gym v2.0](./docs/GYM_V2_MIGRATION_PLAN.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y pertenece al Club Villa Mitre.

## 📞 Soporte

Para soporte técnico o consultas, contactar al equipo de desarrollo.

---

**Última actualización**: Septiembre 2025  
**Versión**: 1.0.0
