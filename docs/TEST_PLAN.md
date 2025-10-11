# Plan de Testing - Club Villa Mitre App

## Configuración Previa
- ✅ API_BASE_URL configurada: `http://localhost:8000/api`
- ✅ USE_MIRAGE_SERVER=false (usando API real)
- ✅ Datos simulados eliminados del servidor Mirage
- ✅ Console logs agregados al flujo de registro

## Tests a Realizar

### 1. Test de Registro (Flujo Completo)
**Objetivo**: Verificar que el registro funciona con la API real y redirige correctamente

**Pasos**:
1. Abrir la app en el simulador/dispositivo
2. Navegar a la pantalla de Registro
3. Completar el formulario con datos válidos:
   - DNI: 12345678
   - Nombre: Juan Test
   - Email: juan.test@email.com
   - Teléfono: +54911123456
   - Contraseña: password123
   - Confirmar contraseña: password123
4. Presionar "Crear Cuenta"
5. **Verificar en console logs**:
   - 🚀 Datos enviados al servidor
   - 📡 Respuesta completa del servidor
   - 📊 Estado de la petición
   - 👤 Datos del usuario recibidos
   - 🏠 Navegación a Home

**Resultado esperado**:
- Registro exitoso
- Token recibido del servidor
- Usuario logueado automáticamente
- Navegación a pantalla Home
- Console logs muestran toda la información

### 2. Test de Login con DNI
**Objetivo**: Verificar que el login funciona con DNI en lugar de email

**Pasos**:
1. Si estás logueado, hacer logout
2. En la pantalla de Login, ingresar:
   - DNI: 12345678 (el mismo usado en el registro)
   - Contraseña: password123
3. Presionar "INGRESAR"
4. Verificar navegación a Home

**Resultado esperado**:
- Login exitoso con DNI
- Token recibido
- Navegación a Home

### 3. Test de Validaciones
**Objetivo**: Verificar que las validaciones funcionan correctamente

**Pasos**:
1. **Registro con DNI inválido**:
   - DNI: 123 (menos de 8 dígitos)
   - Verificar mensaje de error
2. **Registro con contraseñas no coincidentes**:
   - Contraseña: password123
   - Confirmar: password456
   - Verificar mensaje de error
3. **Login con DNI inválido**:
   - DNI: 123
   - Verificar mensaje de error

### 4. Test de Conexión con API
**Objetivo**: Verificar que la app se conecta correctamente a la API Laravel

**Prerequisitos**:
- Servidor Laravel corriendo en `http://localhost:8000`
- Endpoints `/api/auth/register` y `/api/auth/login` funcionando

**Verificaciones**:
- No hay errores de conexión
- Respuestas del servidor son las esperadas
- Tokens JWT válidos

## Checklist de Verificación

### Antes de Iniciar Tests
- [ ] Servidor Laravel corriendo en puerto 8000
- [ ] Base de datos configurada y migrada
- [ ] App compilada sin errores
- [ ] Metro bundler iniciado
- [ ] Console del navegador/terminal abierta para ver logs

### Durante los Tests
- [ ] Console logs aparecen correctamente
- [ ] No hay errores de red
- [ ] Respuestas del servidor son válidas
- [ ] Navegación funciona correctamente
- [ ] Estados de loading se muestran

### Después de los Tests
- [ ] Usuario puede acceder a todas las pantallas
- [ ] Datos del usuario se muestran correctamente en MiCarnet
- [ ] Logout funciona correctamente
- [ ] Re-login funciona con las mismas credenciales

## Comandos para Ejecutar

```bash
# Iniciar Metro bundler
npx expo start

# En otra terminal, verificar que Laravel esté corriendo
curl http://localhost:8000/api/auth/login -X POST -H "Content-Type: application/json" -d '{"dni":"12345678","password":"test"}'
```

## Notas Importantes
- Los console logs tienen emojis para fácil identificación
- Todos los datos simulados han sido eliminados
- La app está configurada para usar únicamente la API real
- Social login está temporalmente deshabilitado
