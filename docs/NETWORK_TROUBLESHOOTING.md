# Solución de Problemas de Red - API Connection

## Problema Detectado
❌ **Network request failed** - La app no puede conectarse a la API Laravel

## Posibles Causas y Soluciones

### 1. Servidor Laravel No Está Corriendo
**Verificar**:
```bash
# Verificar si hay algo corriendo en puerto 8000
netstat -an | findstr :8000
```

**Solución**:
```bash
# Iniciar servidor Laravel
cd /path/to/your/laravel/project
php artisan serve --host=0.0.0.0 --port=8000
```

### 2. Problema de IP para Emulador Android
**Cambio realizado**: `localhost` → `10.0.2.2`
- `10.0.2.2` es la IP que usa el emulador Android para acceder al host
- Para iOS Simulator usar: `localhost` o `127.0.0.1`

### 3. Configuraciones Alternativas por Plataforma

#### Para Emulador Android:
```env
API_BASE_URL=http://10.0.2.2:8000/api
```

#### Para iOS Simulator:
```env
API_BASE_URL=http://localhost:8000/api
```

#### Para Dispositivo Físico:
```env
API_BASE_URL=http://192.168.1.XXX:8000/api
# Reemplazar XXX con la IP de tu computadora en la red local
```

### 4. Verificar Configuración de Laravel

#### Archivo `.env` de Laravel debe tener:
```env
APP_URL=http://localhost:8000
CORS_ALLOWED_ORIGINS=*
```

#### Configurar CORS en Laravel:
```bash
# Instalar Laravel Sanctum/CORS si no está instalado
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

#### En `config/cors.php`:
```php
'allowed_origins' => ['*'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

### 5. Comandos de Diagnóstico

```bash
# Verificar conectividad desde la computadora
curl -v http://localhost:8000/api/auth/login

# Verificar IP de la computadora
ipconfig

# Verificar puertos abiertos
netstat -an | findstr :8000
```

## Pasos para Resolver

1. **Iniciar Laravel**:
   ```bash
   cd /path/to/laravel/project
   php artisan serve --host=0.0.0.0 --port=8000
   ```

2. **Verificar que funciona**:
   ```bash
   curl http://localhost:8000/api/auth/login -X POST -H "Content-Type: application/json" -d '{"dni":"12345678","password":"test"}'
   ```

3. **Reiniciar Metro bundler**:
   ```bash
   # En el proyecto React Native
   npx expo start --clear
   ```

4. **Probar la app nuevamente**

## Estado Actual
- ✅ Configuración cambiada a `10.0.2.2:8000/api`
- ⏳ Pendiente: Verificar que Laravel esté corriendo
- ⏳ Pendiente: Probar conexión nuevamente
