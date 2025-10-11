# 🚀 Guía Completa: Publicación en Google Play Store

## 📋 Información de la App

- **Nombre:** Villa Mitre App
- **Package:** com.villamitre.vmapp2
- **Versión:** 1.0.0
- **Version Code:** 4

---

## 🔧 Pre-requisitos

### 1. Instalar EAS CLI (si no lo tienes)
```bash
npm install -g eas-cli
```

### 2. Iniciar sesión en Expo
```bash
eas login
```

### 3. Verificar configuración
```bash
eas whoami
```

---

## 📦 Construir la App

### Opción A: Build para Testing (APK)
**Recomendado para probar antes de publicar**

```bash
npm run build:apk
```

Este comando genera un APK que puedes instalar directamente en dispositivos Android para probar.

### Opción B: Build para Play Store (AAB)
**Recomendado para publicación oficial**

```bash
npm run build:production
```

Este comando genera un Android App Bundle (.aab) optimizado para Play Store.

### Opción C: Build Preview
**Para pruebas internas rápidas**

```bash
npm run build:preview
```

---

## 📥 Descargar el Build

Una vez que el build termine (puede tomar 10-20 minutos), EAS te dará un link para descargar:

```bash
# El link aparecerá en la terminal, algo como:
# https://expo.dev/accounts/[tu-cuenta]/projects/villa-mitre-app/builds/[build-id]
```

También puedes ver todos tus builds en:
```bash
eas build:list
```

---

## 🎯 Publicar en Google Play Store

### Paso 1: Crear cuenta de desarrollador en Google Play Console

1. Ve a https://play.google.com/console
2. Inicia sesión con tu cuenta de Google
3. Paga la tarifa única de $25 USD (si no lo has hecho)

### Paso 2: Crear la aplicación en Play Console

1. **Crear nueva app:**
   - Nombre: `Villa Mitre`
   - Idioma predeterminado: `Español (España)`
   - Tipo: `App`
   - Gratis o de pago: `Gratis`

2. **Información básica:**
   - Categoría: `Deportes` o `Estilo de vida`
   - Dirección de correo: `[tu-email]`

### Paso 3: Configurar la ficha de Play Store

#### A. Detalles de la aplicación
```
Título de la app: Villa Mitre
Descripción corta (80 caracteres):
App oficial del Club Villa Mitre - Noticias, gimnasio, eventos y más

Descripción completa (4000 caracteres):
Villa Mitre App es la aplicación oficial del Club Villa Mitre de Bahía Blanca.

Funcionalidades:
✅ Noticias y novedades del club
✅ Acceso al gimnasio con seguimiento de entrenamientos
✅ Gestión de rutinas personalizadas
✅ Calendario de eventos
✅ Promociones exclusivas para socios
✅ Información de contacto y ubicación
✅ Perfil de usuario personalizado

Diseñada para mejorar la experiencia de nuestros socios, la app permite:
- Consultar el horario del gimnasio
- Registrar y seguir tus entrenamientos
- Ver promociones exclusivas
- Mantenerte informado sobre eventos del club
- Acceso rápido a información del club

¡Descarga la app y forma parte de la familia Villa Mitre!
```

#### B. Assets gráficos (ya tienes los archivos en assets/)

**Ícono de la aplicación:**
- Archivo: `assets/cvm-escudo-para-fondo-blanco.png`
- Tamaño: 512x512 px
- Formato: PNG de 32 bits

**Capturas de pantalla (necesitas crear estas):**
- **Teléfono:** Mínimo 2, máximo 8 capturas
  - Tamaño: 16:9 o 9:16
  - Resolución mínima: 320px
  - Resolución máxima: 3840px

**Gráfico de funciones (opcional pero recomendado):**
- Tamaño: 1024 x 500 px

#### C. Categorización
- Categoría: `Deportes`
- Etiquetas: `gimnasio`, `club`, `deportes`, `bahía blanca`

#### D. Información de contacto
```
Sitio web: https://www.villamitre.com.ar
Correo: [tu-email-de-contacto]
Teléfono: [opcional]
```

#### E. Política de privacidad
**Importante:** Necesitas crear una URL pública con tu política de privacidad.

Ejemplo de contenido mínimo:
```
# Política de Privacidad - Villa Mitre App

Última actualización: [fecha]

## Información que recopilamos
- Datos de cuenta (nombre, email, DNI)
- Información de entrenamientos
- Datos de uso de la aplicación

## Cómo usamos la información
- Para proporcionar funcionalidades de la app
- Para mejorar la experiencia del usuario
- Para comunicar novedades del club

## Seguridad
Los datos se almacenan de forma segura en nuestros servidores.

Contacto: [email]
```

### Paso 4: Configurar contenido de la app

1. **Clasificación de contenido:**
   - Completar el cuestionario
   - Para una app de gimnasio/club: probablemente "PEGI 3" o "Para todos"

2. **Público objetivo:**
   - Edad: 13+ (o según corresponda)

3. **Declaración de anuncios:**
   - ¿Contiene anuncios? NO (a menos que los agregues)

### Paso 5: Subir el build

#### Opción A: Usando EAS Submit (Automático - Recomendado)

```bash
npm run submit:playstore
```

Sigue las instrucciones en pantalla. Te pedirá:
- Credenciales de Google Play Console
- Track de publicación (internal/alpha/beta/production)

#### Opción B: Manual

1. Ve a Play Console → Tu app → Producción → Crear nueva versión
2. Sube el archivo `.aab` que descargaste
3. Completa las notas de la versión:
   ```
   Primera versión de Villa Mitre App
   
   Funcionalidades incluidas:
   - Acceso y gestión de cuenta
   - Módulo de gimnasio y entrenamientos
   - Noticias y eventos del club
   - Promociones para socios
   - Perfil de usuario
   ```

### Paso 6: Pruebas internas

**Recomendado antes de publicar:**

1. En Play Console → Pruebas → Pruebas internas
2. Crear lista de evaluadores (emails)
3. Los evaluadores recibirán un link para descargar
4. Probar durante 1-2 semanas

### Paso 7: Publicación

1. **Revisión de Play Store:**
   - Google revisará tu app (puede tomar 1-7 días)
   - Revisarán código, permisos, contenido

2. **Lanzamiento:**
   - Una vez aprobada, elige "Publicar"
   - Track recomendado para primera vez: `Internal Testing` → `Closed Testing` → `Production`

---

## 🔄 Actualizaciones Futuras

### Para actualizar la app:

1. **Incrementar versión en app.json:**
   ```json
   {
     "version": "1.1.0",  // Nueva versión
     "android": {
       "versionCode": 5   // Debe ser mayor que la anterior
     }
   }
   ```

2. **Build nueva versión:**
   ```bash
   npm run build:production
   ```

3. **Subir a Play Console:**
   ```bash
   npm run submit:playstore
   ```

---

## ⚠️ Checklist Pre-Publicación

- [ ] App funciona correctamente en dispositivos reales
- [ ] Todos los permisos están justificados
- [ ] Política de privacidad está publicada
- [ ] Íconos y capturas están preparados
- [ ] Descripción de la app está completa
- [ ] Versión de producción (DEBUG_API_CONNECTIVITY: false)
- [ ] Probado en múltiples dispositivos Android
- [ ] Links externos funcionan correctamente
- [ ] No hay credenciales hardcodeadas en el código

---

## 🐛 Solución de Problemas Comunes

### Error: "Build failed"
```bash
# Limpiar caché y reinstalar
rm -rf node_modules
npm install
eas build --clear-cache --profile production --platform android
```

### Error: "Invalid keystore"
```bash
# EAS generará automáticamente un keystore nuevo
# No necesitas configurar nada manualmente
```

### Error: "Version code must be greater"
```bash
# Incrementa versionCode en app.json
# EAS lo hace automáticamente con "autoIncrement": true
```

---

## 📞 Contacto y Soporte

- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **Play Console Help:** https://support.google.com/googleplay/android-developer/
- **Expo Forums:** https://forums.expo.dev/

---

## 🎉 ¡Listo para publicar!

Ejecuta:
```bash
npm run build:production
```

Y sigue esta guía paso a paso. ¡Éxito con tu app!
