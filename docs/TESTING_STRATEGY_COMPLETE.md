# 🧪 ESTRATEGIA DE TESTING COMPLETA - VILLA MITRE APP

## 🎯 **OBJETIVO**

Crear una suite de testing integral que valide todas las funcionalidades críticas de la app móvil Villa Mitre, enfocándose en los roles **usuario** y **estudiante** que son los únicos utilizados en la aplicación móvil.

---

## 📋 **FUNCIONALIDADES A TESTEAR**

### **🔐 AUTENTICACIÓN (CRÍTICO)**
- ✅ Login exitoso con credenciales válidas
- ✅ Login fallido con credenciales inválidas
- ✅ Registro de nuevo usuario
- ✅ Validaciones de contraseña (8 chars, mayúscula, minúscula, número, símbolo)
- ✅ Manejo de tokens Bearer
- ✅ Obtener perfil de usuario autenticado
- ✅ Logout y invalidación de sesión
- ✅ Manejo de errores 401, 422, 500

### **🏋️ SISTEMA GYM (CRÍTICO)**
- ✅ Ver plan semanal de entrenamiento
- ✅ Ver entrenamiento del día actual
- ✅ Ver entrenamiento de fecha específica
- ✅ Manejo de estados: sin rutina, día de descanso, rutina disponible
- ✅ Manejo de errores de red y timeout
- ✅ Refresh de datos (pull-to-refresh)
- ✅ Diferenciación entre usuarios local vs api

### **🎯 SISTEMA DE PROMOCIONES (IMPORTANTE)**
- ✅ Verificar elegibilidad para promoción
- ✅ Verificar DNI en sistema del club
- ✅ Solicitar promoción con datos válidos
- ✅ Manejo de estados: pending, approved, rejected
- ✅ Validaciones de formulario de promoción
- ✅ Manejo de fallos de API externa

### **👤 GESTIÓN DE PERFIL (BÁSICO)**
- ✅ Ver datos completos del usuario
- ✅ Actualizar información básica
- ✅ Manejo de tipos de usuario (local vs api)
- ✅ Campos específicos por tipo de usuario

---

## 🏗️ **ARQUITECTURA DE TESTING**

### **1. TESTS UNITARIOS**
- Servicios individuales (authService, gymService, promotionService)
- Utilidades y helpers
- Mappers de datos
- Validaciones de formularios

### **2. TESTS DE INTEGRACIÓN**
- Flujos completos de usuario
- Navegación entre pantallas
- Integración con Redux store
- Manejo de estados globales

### **3. TESTS DE API**
- Endpoints individuales
- Manejo de respuestas exitosas
- Manejo de errores HTTP
- Timeout y conectividad

### **4. TESTS DE UI**
- Renderizado de componentes
- Interacciones de usuario
- Estados de loading y error
- Navegación y routing

---

## 📁 **ESTRUCTURA DE ARCHIVOS**

```
src/__tests__/
├── setup.ts                           # Configuración global
├── mocks/
│   ├── authMocks.ts                   # Mocks de autenticación
│   ├── gymMocks.ts                    # Mocks de gym (ya existe)
│   ├── promotionMocks.ts              # Mocks de promociones
│   └── userMocks.ts                   # Mocks de usuarios
├── services/
│   ├── authService.test.ts            # Tests del servicio de auth
│   ├── gymService.test.ts             # Tests del servicio gym (ya existe)
│   ├── promotionService.test.ts       # Tests del servicio de promociones
│   └── userService.test.ts            # Tests del servicio de usuarios
├── components/
│   ├── auth/
│   │   ├── LoginScreen.test.tsx       # Tests de pantalla login
│   │   └── RegisterScreen.test.tsx    # Tests de pantalla registro
│   ├── gym/                           # Tests gym (ya existen)
│   └── promotion/
│       └── PromotionScreen.test.tsx   # Tests de promociones
├── integration/
│   ├── authFlow.test.ts               # Flujo completo de autenticación
│   ├── gymFlow.test.ts                # Flujo completo de gym
│   ├── promotionFlow.test.ts          # Flujo completo de promociones
│   └── userJourney.test.ts            # Journey completo del usuario
└── api/
    ├── authEndpoints.test.ts          # Tests de endpoints de auth
    ├── gymEndpoints.test.ts           # Tests de endpoints de gym
    └── promotionEndpoints.test.ts     # Tests de endpoints de promociones
```

---

## 🎯 **CASOS DE PRUEBA ESPECÍFICOS**

### **AUTENTICACIÓN**

#### **Login Exitoso**
```typescript
// Usuario local válido
DNI: "12345678", Password: "Password123!"
Esperado: Token + user_type: "local"

// Usuario API válido  
DNI: "59964604", Password: "password123"
Esperado: Token + user_type: "api" + datos adicionales
```

#### **Login Fallido**
```typescript
// Credenciales incorrectas
DNI: "12345678", Password: "wrongpassword"
Esperado: Error 401

// Usuario inexistente
DNI: "99999999", Password: "Password123!"
Esperado: Error 422
```

#### **Registro**
```typescript
// Registro exitoso
{
  name: "Test User",
  email: "test@example.com", 
  dni: "87654321",
  password: "Password123!",
  password_confirmation: "Password123!"
}
Esperado: Usuario creado + token
```

### **SISTEMA GYM**

#### **Ver Entrenamiento Diario**
```typescript
// Usuario con rutina asignada
GET /gym/my-day
Esperado: Array de ejercicios con sets, reps, descanso

// Usuario sin rutina (día de descanso)
GET /gym/my-day  
Esperado: { message: "Día de descanso", workout: null }

// Usuario sin asignación
GET /gym/my-day
Esperado: { message: "Sin rutina asignada", workout: null }
```

#### **Ver Semana Completa**
```typescript
// Usuario con plan semanal
GET /gym/my-week
Esperado: Array de 7 días con entrenamientos

// Usuario sin plan
GET /gym/my-week
Esperado: Array vacío o mensaje apropiado
```

### **PROMOCIONES**

#### **Verificar Elegibilidad**
```typescript
// Usuario local sin solicitud previa
GET /promotion/eligibility
Esperado: { eligible: true, can_request: true }

// Usuario con solicitud pendiente
GET /promotion/eligibility  
Esperado: { eligible: false, reason: "Solicitud pendiente" }

// Usuario ya promovido (API)
GET /promotion/eligibility
Esperado: { eligible: false, reason: "Ya es usuario API" }
```

#### **Solicitar Promoción**
```typescript
// Solicitud válida
POST /promotion/request
{
  reason: "Soy socio del club",
  additional_info: "Información adicional",
  club_password: "password_del_club"
}
Esperado: Solicitud creada con status "pending"
```

---

## 🔧 **CONFIGURACIÓN DE TESTING**

### **Jest Configuration**
```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testMatch: ['**/__tests__/**/*.test.{js,jsx,ts,tsx}'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### **Scripts de Testing**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:auth": "jest --testPathPattern=auth",
    "test:gym": "jest --testPathPattern=gym", 
    "test:promotion": "jest --testPathPattern=promotion",
    "test:integration": "jest --testPathPattern=integration",
    "test:api": "jest --testPathPattern=api",
    "test:ci": "jest --coverage --watchAll=false"
  }
}
```

---

## 📊 **MÉTRICAS DE COBERTURA**

### **Objetivos de Cobertura**
- **Servicios críticos:** 95%+ (auth, gym, promotion)
- **Componentes UI:** 85%+
- **Utilidades:** 90%+
- **Flujos de integración:** 80%+

### **Áreas Críticas**
1. **Autenticación:** 100% cobertura (crítico para seguridad)
2. **Manejo de errores:** 95% cobertura
3. **Estados de la aplicación:** 90% cobertura
4. **Navegación:** 85% cobertura

---

## 🚀 **PLAN DE IMPLEMENTACIÓN**

### **Fase 1: Fundación (Semana 1)**
- ✅ Configurar Jest y testing environment
- ✅ Crear mocks básicos y setup
- ✅ Implementar tests de servicios críticos

### **Fase 2: Autenticación (Semana 2)**
- 🔄 Tests completos de authService
- 🔄 Tests de pantallas Login/Register
- 🔄 Tests de flujo de autenticación

### **Fase 3: Funcionalidades Gym (Semana 3)**
- 📋 Expandir tests existentes de gym
- 📋 Tests de nuevos endpoints
- 📋 Tests de estados y edge cases

### **Fase 4: Promociones (Semana 4)**
- 📋 Tests de promotionService
- 📋 Tests de pantalla de promociones
- 📋 Tests de flujo completo

### **Fase 5: Integración (Semana 5)**
- 📋 Tests de flujos completos
- 📋 Tests de user journey
- 📋 Optimización y refinamiento

---

## 🎯 **CRITERIOS DE ÉXITO**

### **Funcional**
- ✅ Todos los endpoints críticos testeados
- ✅ Todos los flujos de usuario cubiertos
- ✅ Manejo de errores validado
- ✅ Estados de la aplicación verificados

### **Técnico**
- ✅ Cobertura de código >85%
- ✅ Tests ejecutándose en <30 segundos
- ✅ Cero tests flaky o intermitentes
- ✅ Integración con CI/CD

### **Calidad**
- ✅ Tests legibles y mantenibles
- ✅ Mocks realistas y útiles
- ✅ Documentación completa
- ✅ Casos edge cubiertos

---

## 📞 **PRÓXIMOS PASOS**

1. **Revisar y aprobar** esta estrategia
2. **Implementar** la configuración base
3. **Crear** los primeros tests críticos
4. **Iterar** y mejorar basándose en resultados
5. **Documentar** hallazgos y mejores prácticas

---

*Documento creado: 2025-09-24*  
*Enfoque: Usuarios y Estudiantes únicamente*  
*Estado: Estrategia completa definida*
