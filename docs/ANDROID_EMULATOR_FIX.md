# 🔧 **Fix: Android Emulator Network Configuration**

## 🎯 **Problema Identificado**

### **Síntomas**
```
ERROR  💥 API request failed: [TypeError: Network request failed]
LOG  🌐 API Request: POST http://localhost:8000/api/auth/login
```

### **Causa Raíz**
- ✅ **Servidor Laravel funcionando** en `localhost:8000`
- ❌ **Android Emulator no puede acceder** a `localhost`
- ❌ **Configuración hardcodeada** en `.env` y `app.json`

## 🔍 **Diagnóstico Realizado**

### **✅ Servidor Laravel Operativo**
```bash
curl http://localhost:8000
# Status: 200 OK
# Content: Laravel welcome page
```

### **❌ Configuración Incorrecta para Emulador**
```typescript
// PROBLEMA: Configuración hardcodeada
API_BASE_URL=http://localhost:8000/api  // ← No funciona en Android Emulator
```

### **🎯 Solución: IP del Emulador Android**
```typescript
// SOLUCIÓN: IP específica del emulador
API_BASE_URL=http://10.0.2.2:8000/api  // ← Mapea a localhost del host
```

---

## 🔧 **Cambios Implementados**

### **1. .env - Actualizado**
```bash
# ANTES
API_BASE_URL=http://localhost:8000/api

# DESPUÉS
API_BASE_URL=http://10.0.2.2:8000/api
```

### **2. app.json - Actualizado**
```json
{
  "extra": {
    "API_BASE_URL": "http://10.0.2.2:8000/api"
  }
}
```

### **3. test-api-connection.js - Actualizado**
```javascript
// ANTES
const API_BASE_URL = 'http://localhost:8000';

// DESPUÉS
const API_BASE_URL = 'http://10.0.2.2:8000';
```

---

## 🌐 **Explicación Técnica**

### **Android Emulator Network Mapping**
```
Host Machine:     localhost:8000     (Laravel server)
Android Emulator: 10.0.2.2:8000     (Maps to host localhost)
iOS Simulator:    localhost:8000     (Direct access to host)
```

### **Por qué `10.0.2.2`?**
- **Android Emulator** corre en una VM separada
- **No tiene acceso directo** a `localhost` del host
- **`10.0.2.2`** es la IP especial que mapea al `localhost` del host
- **Configuración estándar** de Android SDK

---

## 🧪 **Validación**

### **Testing Post-Fix**
```bash
# 1. Verificar configuración
npm run test:api
# Debe conectar a http://10.0.2.2:8000

# 2. Probar login en app
{
  "dni": "12345678",
  "password": "password123"
}
# Debe funcionar sin "Network request failed"
```

### **Logs Esperados**
```
LOG  🌐 API Request: POST http://10.0.2.2:8000/api/auth/login
LOG  📊 Response: 200 OK (o 422 validation error)
```

---

## 📱 **Configuración por Plataforma**

### **Android Emulator**
```typescript
API_BASE_URL=http://10.0.2.2:8000/api
// ✅ Funciona correctamente
```

### **iOS Simulator**
```typescript
API_BASE_URL=http://localhost:8000/api
// ✅ También funciona (acceso directo)
```

### **Dispositivo Físico**
```typescript
API_BASE_URL=http://192.168.1.XXX:8000/api
// Usar IP real de la máquina en la red local
```

---

## 🔄 **Fallback Automático (Futuro)**

### **Configuración Inteligente**
```typescript
// environment.ts ya tiene lógica para esto
export const getApiBaseUrl = (): string => {
  // Prioridad: app.json > .env > platform-specific defaults
  
  if (__DEV__) {
    return Platform.OS === 'android' 
      ? 'http://10.0.2.2:8000/api'    // Android emulator
      : 'http://localhost:8000/api';  // iOS simulator
  }
  
  return 'http://production-url.com/api';
};
```

### **Para Usar Fallback Automático**
```bash
# Remover de .env y app.json para usar defaults automáticos
# API_BASE_URL=  # ← Comentar o remover
```

---

## 🚨 **Troubleshooting**

### **Si Sigue Sin Funcionar**

#### **1. Verificar Servidor Laravel**
```bash
curl http://localhost:8000
# Debe responder 200 OK
```

#### **2. Verificar Puerto**
```bash
netstat -an | findstr :8000
# Debe mostrar LISTENING en puerto 8000
```

#### **3. Verificar Firewall**
```bash
# Windows: Permitir conexiones en puerto 8000
# Configuración → Firewall → Permitir app
```

#### **4. Probar IP Alternativa**
```bash
# Si 10.0.2.2 no funciona, probar:
ipconfig  # Obtener IP real de la máquina
# Usar esa IP en lugar de 10.0.2.2
```

---

## 📊 **Estado Post-Fix**

### **✅ Esperado Después del Fix**
- ✅ **Login funciona** sin "Network request failed"
- ✅ **TodayWorkoutCard** carga correctamente
- ✅ **DailyWorkoutScreen** accesible
- ✅ **type_label** ya no es undefined

### **🧪 Casos de Prueba**
1. **Login exitoso** con credenciales de prueba
2. **TodayWorkoutCard** visible para usuarios API
3. **Navegación** Home → Card → DailyWorkoutScreen
4. **Navegación** Centro Deportivo → Gimnasio → Mi Rutina

---

**📝 Fecha**: 18 de Septiembre, 2025 - 16:32 ART  
**🎯 Problema**: Android Emulator network configuration  
**✅ Solución**: Cambio de `localhost` a `10.0.2.2`  
**🚀 Status**: Listo para testing
