# 🔗 Frontend-Backend Integration Guide

## ✅ Cambios Implementados

### 1. **Adaptación de Interfaces de Usuario**
- ✅ Actualizada interface `Usuario` para coincidir con el backend Laravel
- ✅ Agregados campos del backend: `user_type`, `type_label`, `promotion_status`, etc.
- ✅ Mantenidos campos legacy para compatibilidad con componentes existentes

### 2. **Persistencia de Tokens**
- ✅ Implementado `AsyncStorage` para guardar tokens de autenticación
- ✅ Métodos agregados en `ApiClient`: `setAuthToken()`, `removeAuthToken()`, `hasAuthToken()`
- ✅ Manejo automático de tokens en login/logout

### 3. **Estandarización de Respuestas API**
- ✅ Actualizado `ApiClient` para manejar formato Laravel `{ data: ... }`
- ✅ Mejorado manejo de errores con mensajes específicos de Laravel
- ✅ Soporte para errores de validación estructurados

### 4. **Servicio de Autenticación**
- ✅ Actualizado `AuthService` para extraer datos correctamente
- ✅ Agregado mapeo automático de datos de usuario
- ✅ Métodos helper: `isAuthenticated()`, `getUserData()`

### 5. **Redux Store**
- ✅ Actualizado `authSlice` para nueva estructura de respuestas
- ✅ Agregado `checkAuthStatus` thunk
- ✅ Mapeo automático de datos de usuario en todas las acciones

### 6. **Utilidades de Mapeo**
- ✅ Creado `userMapper.ts` con funciones de mapeo
- ✅ Compatibilidad entre campos del backend y frontend
- ✅ Funciones helper para display de datos

## 🚀 Configuración para Desarrollo

### Variables de Entorno
Crea un archivo `.env` basado en `.env.example`:

```bash
# Para desarrollo local con Laravel
API_BASE_URL=http://localhost:8000/api
USE_MIRAGE_SERVER=false

# Para usar mock server (desarrollo sin backend)
# USE_MIRAGE_SERVER=true
```

### Configuración del Backend Laravel
Asegúrate de que el backend Laravel esté corriendo en `http://localhost:8000` con:

```bash
cd vmServer
php artisan serve
```

## 📱 Flujo de Autenticación

### 1. Login/Register
```typescript
// El usuario se autentica
const response = await authService.login({ dni: '12345678', password: 'password' });

// Token se guarda automáticamente en AsyncStorage
// Usuario se mapea automáticamente al formato frontend
```

### 2. Persistencia de Sesión
```typescript
// Al iniciar la app, verificar si hay token guardado
const isAuth = await authService.isAuthenticated();

if (isAuth) {
  // Obtener datos del usuario desde el backend
  const userData = await authService.getUserData();
}
```

### 3. Logout
```typescript
// Logout limpia token local y notifica al backend
await authService.logout();
```

## 🔧 Estructura de Datos

### Usuario Backend → Frontend
```typescript
// Backend (Laravel)
{
  id: 1,
  dni: "12345678",
  user_type: "api",
  name: "PÉREZ, JUAN",
  socio_id: "12345",
  barcode: "12345"
}

// Frontend (mapeado automáticamente)
{
  id: 1,
  dni: "12345678",
  user_type: "api",
  name: "PÉREZ, JUAN",
  // Campos legacy para compatibilidad
  nroSocio: "12345",     // = socio_id
  codigoBarras: "12345", // = barcode
  validoHasta: "2025-12-31T00:00:00.000Z"
}
```

### Respuestas de API
```typescript
// Login/Register Response
{
  data: {
    token: "1|abc123...",
    user: { /* usuario completo */ },
    fetched_from_api: true,
    refreshed: false
  }
}

// User Data Response
{
  data: { /* usuario completo */ }
}
```

## 🛠️ Componentes Actualizados

### ApiClient
- ✅ Manejo automático de tokens
- ✅ Headers de autenticación
- ✅ Manejo de errores mejorado

### AuthService
- ✅ Persistencia de tokens
- ✅ Mapeo de datos de usuario
- ✅ Métodos helper

### Redux AuthSlice
- ✅ Acciones actualizadas para nueva estructura
- ✅ Mapeo automático en reducers
- ✅ Estado de autenticación persistente

## 🔍 Testing

### Verificar Integración
1. **Backend funcionando**: `curl http://localhost:8000/api/auth/login`
2. **Frontend conectado**: Cambiar `USE_MIRAGE_SERVER=false` en `.env`
3. **Login funcional**: Probar login con DNI y password válidos

### Debugging
- Logs en consola muestran requests/responses de API
- AsyncStorage puede inspeccionarse con React Native Debugger
- Redux DevTools muestra estado de autenticación

## ⚠️ Notas Importantes

### Compatibilidad
- Campos legacy mantenidos para no romper componentes existentes
- Mapeo automático entre formatos backend/frontend
- Fallbacks para datos faltantes

### Seguridad
- Tokens guardados de forma segura en AsyncStorage
- Headers de autenticación automáticos
- Logout limpia tokens locales

### Desarrollo
- Mirage.js sigue funcionando para desarrollo sin backend
- Switch fácil entre mock y real API via variables de entorno
- Logs detallados en modo desarrollo

## 🎯 Próximos Pasos

1. **Testing**: Probar flujo completo de autenticación
2. **Componentes**: Actualizar componentes que usen datos de usuario
3. **Validación**: Verificar que todos los campos se muestren correctamente
4. **Producción**: Configurar URL de producción en variables de entorno
