# 🎨 Assets Necesarios para Google Play Store

## ✅ Assets que YA TIENES

### 1. Ícono de la App
- **Archivo actual:** `assets/cvm-escudo-para-fondo-blanco.png`
- **Requerimiento Play Store:** 512x512 px, PNG 32-bit
- **Estado:** ✅ Listo (si tiene 512x512)

---

## 📸 Assets que NECESITAS CREAR

### 2. Capturas de Pantalla (OBLIGATORIO)

#### Teléfono (Mínimo 2, Recomendado 8)

**Capturas sugeridas:**

1. **Pantalla de Login**
   - Muestra el acceso limpio y profesional
   - Incluye logo del club

2. **Pantalla Principal (Home)**
   - Muestra las noticias y eventos
   - Destaca la interfaz intuitiva

3. **Módulo Gimnasio**
   - Pantalla de ejercicios
   - Lista de rutinas

4. **Seguimiento de Ejercicio**
   - Pantalla donde se registran sets y reps
   - Muestra funcionalidad de tracking

5. **Perfil de Usuario**
   - Información personal
   - Estadísticas de entrenamiento

6. **Promociones**
   - Pantalla con ofertas exclusivas

7. **Eventos del Club**
   - Calendario o lista de eventos

8. **Navegación/Menú**
   - Drawer con opciones del club

**Especificaciones técnicas:**
```
Formato: JPEG o PNG 24-bit
Proporción: 16:9 (1920x1080) o 9:16 (1080x1920)
Tamaño mínimo: 320px en el lado corto
Tamaño máximo: 3840px en el lado largo
Cantidad: Mínimo 2, máximo 8
```

**Cómo capturar:**
```bash
# 1. Ejecutar app en emulador Android
npm run android

# 2. En Android Studio, click en cámara en la barra lateral
# 3. O usa ADB:
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png
```

**Tips para buenas capturas:**
- ✅ Usa dispositivos modernos (Pixel 5, Samsung Galaxy S21, etc.)
- ✅ Sin notificaciones ni hora en status bar
- ✅ Con datos reales (no "test@test.com")
- ✅ Pantalla clara y legible
- ✅ Muestra funcionalidades clave
- ❌ Evita texto pequeño
- ❌ No incluyas información sensible

### 3. Gráfico de Funciones (OPCIONAL pero muy recomendado)

**Banner promocional en Play Store**

```
Tamaño: 1024 x 500 px
Formato: PNG o JPEG
Peso máximo: 1MB
```

**Contenido sugerido:**
```
┌─────────────────────────────────────────────┐
│  Logo Villa Mitre    VILLA MITRE APP       │
│                                              │
│  ✓ Gimnasio  ✓ Eventos  ✓ Noticias         │
│  ✓ Promociones  ✓ Perfil                   │
│                                              │
│     Tu club, en tu mano                     │
└─────────────────────────────────────────────┘
```

Puedes crear esto con:
- Canva (gratuito): https://canva.com
- Photoshop / Illustrator
- Figma (gratuito)

### 4. Ícono de Alta Resolución

**Si el actual no es 512x512:**

```
Tamaño: 512 x 512 px
Formato: PNG 32-bit con transparencia
Peso máximo: 1MB
```

Puedes redimensionar con:
- https://www.photopea.com/ (Photoshop online gratis)
- ImageMagick: `convert original.png -resize 512x512 icon-512.png`

---

## 📋 Checklist de Assets

```
[ ] Ícono 512x512 px
[ ] Capturas de pantalla (mínimo 2)
    [ ] Login
    [ ] Home
    [ ] Gimnasio
    [ ] Otra funcionalidad clave
[ ] Gráfico de funciones 1024x500 (opcional)
[ ] Video promocional (opcional)
```

---

## 🎬 Video Promocional (OPCIONAL)

**Si quieres destacar más en Play Store:**

```
Duración: 30 segundos - 2 minutos
Formato: MPEG-4 o WebM
Resolución: 1080p (1920x1080)
Peso máximo: 100MB
```

**Contenido sugerido:**
1. Logo animado (2s)
2. Pantallas principales de la app (10s)
3. Funcionalidades destacadas (15s)
4. Call to action: "Descarga Villa Mitre App" (3s)

Puedes usar:
- CapCut (app móvil gratuita)
- DaVinci Resolve (software gratuito)
- Canva Video (online)

---

## 🛠️ Herramientas Recomendadas

### Captura de Pantallas
```bash
# Android Studio: Botón de cámara en el emulador
# O con ADB:
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png
```

### Edición de Imágenes (Gratis)
- **Photopea:** https://photopea.com (Photoshop online)
- **Canva:** https://canva.com (Templates listos)
- **GIMP:** https://gimp.org (Software gratuito)

### Mockups de Dispositivos
- **Mockuphone:** https://mockuphone.com
- **Device Frames:** https://deviceframes.com
- **Screenshots.pro:** https://screenshots.pro

---

## 📐 Template de Captura (Sugerencia)

```
Dispositivo recomendado: Pixel 5
Resolución: 1080 x 2340 px (9:19.5)

Captura con marco del dispositivo:
→ Más profesional
→ Muestra contexto móvil
→ Mejor impacto visual
```

---

## 🚀 Próximos Pasos

1. **Ejecuta la app y captura screenshots:**
   ```bash
   npm run android
   ```

2. **Edita las capturas** (opcional pero recomendado):
   - Agrega marcos de dispositivo
   - Añade descripciones cortas
   - Unifica el estilo

3. **Sube a Play Console:**
   - Google Play Console → Tu App → Ficha de Play Store → Recursos gráficos

4. **Revisa la vista previa:**
   - Play Console te muestra cómo se verá en la tienda

---

## ✨ Tips Profesionales

### Para Capturas Destacadas:
```
✅ Modo claro consistente
✅ Mismo dispositivo para todas
✅ Status bar limpio
✅ Datos reales pero genéricos
✅ Funcionalidades más importantes primero
```

### Errores Comunes a Evitar:
```
❌ Capturas borrosas o pixeladas
❌ Diferentes dispositivos mezclados
❌ Información personal visible
❌ Errores o bugs visibles
❌ Texto en inglés si tu app es español
```

---

## 📞 ¿Necesitas ayuda?

Si necesitas crear assets profesionales:
- Fiverr: Diseñadores desde $5
- Upwork: Freelancers profesionales
- 99designs: Concursos de diseño

O puedes hacerlo tú mismo con las herramientas gratuitas mencionadas. ¡Es más fácil de lo que parece!
