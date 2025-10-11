# 🏠 Configuración para Servidor Local

## 📋 **Resumen de Cambios**

Se ha actualizado la configuración de la Villa Mitre App para apuntar al servidor Laravel local en lugar del servidor remoto.

### **🔧 Archivos Actualizados**

#### **1. .env**
```bash
# Antes
API_BASE_URL=http://surtekbb.com/api

# Ahora
API_BASE_URL=http://localhost:8000/api
```

#### **2. app.json**
```json
{
  "extra": {
    "API_BASE_URL": "http://localhost:8000/api"
  }
}
```

#### **3. src/utils/environment.ts**
```typescript
// Production fallback actualizado
return 'http://localhost:8000/api';
```

#### **4. docs/API-MOBILE-CONTRACTS.md**
```markdown
## 🌐 BASE URL
Development: http://localhost:8000/api
Health Check: http://localhost:8000/api/health
```

### **🚀 Nuevo Script de Testing**

Se agregó un script para probar la conectividad con el servidor:

```bash
npm run test:api
```

Este script verifica:
- ✅ Conectividad básica con el servidor
- ✅ Health check endpoint
- ✅ Endpoints de autenticación
- ✅ Endpoints del gym service

## 🏃‍♂️ **Cómo Usar**

### **1. Iniciar el Servidor Laravel**
```bash
# En el directorio del backend Laravel
php artisan serve
```

### **2. Verificar Conectividad**
```bash
# En el directorio de la app móvil
npm run test:api
```

### **3. Iniciar la App Móvil**
```bash
npm start
# o
npm run android
# o
npm run ios
```

## 🌐 **URLs de Acceso**

### **Servidor Web**
- **Frontend**: http://localhost:8000
- **API Base**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/api/health

### **Endpoints Principales**
- **Login**: `POST http://localhost:8000/api/auth/login`
- **Register**: `POST http://localhost:8000/api/auth/register`
- **User Data**: `GET http://localhost:8000/api/user`
- **Gym Week**: `GET http://localhost:8000/api/gym/my-week`
- **Gym Day**: `GET http://localhost:8000/api/gym/my-day`

## 🔍 **Verificación Manual**

### **Test con cURL**
```bash
# Test básico
curl http://localhost:8000

# Test API health
curl http://localhost:8000/api/health

# Test login endpoint
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"dni":"test","password":"test"}'
```

### **Test en Navegador**
1. Abrir: http://localhost:8000
2. Verificar que el servidor Laravel responde
3. Probar: http://localhost:8000/api/health

## 🐛 **Troubleshooting**

### **Error: Connection Refused**
```bash
❌ Basic Connectivity Failed: connect ECONNREFUSED 127.0.0.1:8000
```

**Solución:**
1. Verificar que Laravel esté ejecutándose: `php artisan serve`
2. Confirmar que usa el puerto 8000
3. Probar manualmente: `curl http://localhost:8000`

### **Error: Network Request Failed (React Native)**
```bash
❌ Network request failed
```

**Soluciones:**
1. **Android Emulator**: Usar `http://10.0.2.2:8000/api`
2. **iOS Simulator**: Usar `http://localhost:8000/api`
3. **Dispositivo físico**: Usar IP de la máquina (ej: `http://192.168.1.100:8000/api`)

### **Error: Cleartext Traffic**
```bash
❌ Cleartext HTTP traffic not permitted
```

**Solución:** Ya configurado en `app.json`:
```json
{
  "plugins": [
    ["expo-build-properties", {
      "android": {
        "usesCleartextTraffic": true
      }
    }]
  ]
}
```

## 📱 **Configuración por Plataforma**

### **Android Emulator**
- URL automática: `http://10.0.2.2:8000/api`
- Mapea automáticamente a `localhost:8000` del host

### **iOS Simulator**
- URL automática: `http://localhost:8000/api`
- Acceso directo al localhost del host

### **Dispositivo Físico**
Para usar en dispositivo físico, actualizar manualmente:
```bash
# Encontrar IP de la máquina
ipconfig  # Windows
ifconfig  # Mac/Linux

# Actualizar .env con la IP
API_BASE_URL=http://192.168.1.100:8000/api
```

## ✅ **Verificación de Configuración**

### **Script de Verificación**
```bash
npm run test:api
```

**Salida Esperada (Servidor Funcionando):**
```
✅ Health Check: 200 OK
✅ Login endpoint responding (validation error expected)
✅ Register endpoint responding (validation error expected)
✅ Weekly Plan endpoint responding (auth required)
✅ Daily Workout endpoint responding (auth required)
```

**Salida Esperada (Servidor Apagado):**
```
❌ Basic Connectivity Failed: connect ECONNREFUSED
🚨 CONNECTION REFUSED - Server might not be running
💡 Make sure to start the server with: php artisan serve
```

## 🎯 **Próximos Pasos**

1. **Iniciar Laravel**: `php artisan serve`
2. **Verificar API**: `npm run test:api`
3. **Iniciar App**: `npm start`
4. **Probar funcionalidades** del gym service

---

**📝 Configuración actualizada el**: 18 de Septiembre, 2025  
**🎯 Target**: http://localhost:8000/api  
**✅ Status**: Configuración completa, listo para desarrollo local
