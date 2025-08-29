# Dependencias Requeridas para VMApp2

## Dependencias de Producción

Ejecutar este comando para instalar todas las dependencias necesarias:

```bash
npm install @reduxjs/toolkit react-redux redux-persist miragejs @react-native-async-storage/async-storage
```

### Desglose de dependencias:

- **@reduxjs/toolkit**: ^2.0.1 - Toolkit oficial de Redux con utilities
- **react-redux**: ^9.0.4 - Bindings de React para Redux
- **redux-persist**: ^6.0.0 - Persistencia de estado Redux
- **miragejs**: ^0.1.48 - Mock server para desarrollo
- **@react-native-async-storage/async-storage**: ^1.21.0 - Storage persistente para React Native

## Dependencias ya instaladas

Estas dependencias ya están en el proyecto:
- **@expo/vector-icons**: Para iconos
- **@react-navigation/drawer**: Navegación tipo drawer
- **@react-navigation/native**: Navegación principal
- **@react-navigation/native-stack**: Stack navigator
- **react-native-maps**: Mapas nativos
- **react-leaflet**: Mapas para web
- **react-native-chart-kit**: Gráficos
- **react-native-qrcode-svg**: Códigos QR

## Pasos de instalación

1. **Instalar las nuevas dependencias:**
   ```bash
   npm install @reduxjs/toolkit react-redux redux-persist miragejs @react-native-async-storage/async-storage
   ```

2. **Actualizar el archivo de store para usar AsyncStorage real:**
   - Descomentar la línea de import de AsyncStorage en `src/store/index.ts`
   - Reemplazar el storage temporal con AsyncStorage

3. **Verificar que todo funcione:**
   ```bash
   npm run web
   ```

## Estructura de archivos creada

```
src/
├── types/
│   └── index.ts              # Interfaces TypeScript
├── store/
│   ├── index.ts              # Configuración del store
│   └── slices/               # Redux slices
│       ├── authSlice.ts
│       ├── actividadesSlice.ts
│       ├── beneficiosSlice.ts
│       ├── cuponesSlice.ts
│       ├── puntosSlice.ts
│       └── localesSlice.ts
├── services/
│   ├── index.ts              # Export central
│   ├── api.ts                # Cliente API base
│   ├── authService.ts
│   ├── actividadesService.ts
│   ├── beneficiosService.ts
│   ├── cuponesService.ts
│   ├── puntosService.ts
│   └── localesService.ts
├── mirage/
│   └── server.ts             # Mock server
├── hooks/
│   ├── redux.ts              # Hooks tipados de Redux
│   ├── useAuth.ts
│   ├── useActividades.ts
│   ├── useBeneficios.ts
│   ├── useCupones.ts
│   ├── usePuntos.ts
│   └── useLocales.ts
├── providers/
│   └── AppProvider.tsx       # Provider principal
└── utils/
    ├── constants.ts          # Constantes de la app
    └── helpers.ts            # Utilidades
```

## Funcionalidades implementadas

✅ **Redux Store** completo con persistencia
✅ **Mirage.js** para mock de APIs
✅ **TypeScript** interfaces completas
✅ **Custom Hooks** para cada dominio
✅ **Servicios** organizados por responsabilidad
✅ **Navegación** integrada con autenticación
✅ **Manejo de errores** y loading states
✅ **Arquitectura escalable** y mantenible
