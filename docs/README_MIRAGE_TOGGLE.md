# Configuración de Mirage Server

Esta aplicación permite alternar entre usar datos simulados (Mirage.js) y una API real mediante variables de entorno.

## Configuración

### Método 1: Archivo app.json (Recomendado)

Edita el archivo `app.json` y modifica la sección `extra`:

```json
{
  "expo": {
    "extra": {
      "USE_MIRAGE_SERVER": true,  // true para datos simulados, false para API real
      "API_BASE_URL": "https://your-production-api.com/api"
    }
  }
}
```

### Método 2: Archivo .env

Crea o edita el archivo `.env` en la raíz del proyecto:

```env
# Set to 'true' to use Mirage.js mock server for development
# Set to 'false' to use real API endpoints
USE_MIRAGE_SERVER=true

# API Configuration
API_BASE_URL=https://your-production-api.com/api
```

## Comportamiento

### Cuando USE_MIRAGE_SERVER=true
- Se inicializa el servidor Mirage.js
- Todas las llamadas a la API son interceptadas por Mirage
- Se utilizan datos simulados definidos en `src/mirage/server.ts`
- Ideal para desarrollo y testing

### Cuando USE_MIRAGE_SERVER=false
- No se inicializa Mirage.js
- Las llamadas van directamente a la API real
- Se utiliza la URL definida en `API_BASE_URL`
- Ideal para producción o testing con datos reales

## Prioridad de Configuración

1. **app.json extra config** (mayor prioridad)
2. **Variables de entorno (.env)**
3. **Modo desarrollo (__DEV__)** (menor prioridad)

## Comandos Útiles

```bash
# Reiniciar el servidor después de cambiar configuración
npm start

# Limpiar caché si hay problemas
npx expo start --clear
```

## Logs de Depuración

La aplicación mostrará logs en la consola indicando:
- Si Mirage está habilitado o deshabilitado
- La URL base de la API que se está utilizando
- El estado de las variables de entorno

Busca logs que comiencen con `🔧 Environment Configuration:` para verificar la configuración actual.
