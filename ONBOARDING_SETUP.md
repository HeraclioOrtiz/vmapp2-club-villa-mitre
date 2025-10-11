# 🎯 Pantalla de Onboarding - Villa Mitre App

## 📱 Descripción

La pantalla de onboarding muestra 4 slides de bienvenida que se presentan **cada vez** que el usuario abre la aplicación (si no está autenticado).

**Diseño simplificado:** Las imágenes contienen todo el diseño (texto, logos, colores). Solo se agregan los controles de navegación (dots, botón, omitir) sobre la imagen.

---

## 🎨 Slides Implementados

### **Slide 1: Hinchada con Banderas** 🏴
- **Imagen:** `assets/Slides/1.jpeg` (diseño completo incluido en la imagen)
- **Botón:** "SIGUIENTE" (Negro) → Pasa al siguiente slide
- **Link:** "Omitir" → Redirige a Login

### **Slide 2: Carnet Virtual** 🎫
- **Imagen:** `assets/Slides/2.jpeg` (diseño completo incluido en la imagen)
- **Botón:** "SIGUIENTE" (Negro) → Pasa al siguiente slide
- **Link:** "Omitir" → Redirige a Login

### **Slide 3: Estado de Cuenta** 📊
- **Imagen:** `assets/Slides/3.jpeg` (diseño completo incluido en la imagen)
- **Botón:** "SIGUIENTE" (Negro) → Pasa al siguiente slide
- **Link:** "Omitir" → Redirige a Login

### **Slide 4: Red de Beneficios** 🛍️
- **Imagen:** `assets/Slides/4.jpeg` (diseño completo incluido en la imagen)
- **Botón:** "REGISTRARME" (Verde #00D449) → Redirige a Registro
- **Link:** "Omitir" → Redirige a Login

---

## 🔧 Características Técnicas

### **Diseño Simplificado:**
- ✅ Imágenes a pantalla completa (contienen todo el diseño gráfico)
- ✅ Sin overlays ni elementos superpuestos sobre el diseño
- ✅ Controles de navegación en la parte inferior:
  - Indicadores de página (dots) blancos
  - Botón principal (negro/verde según slide)
  - Link "Omitir" con underline
- ✅ Transiciones suaves entre slides (scroll horizontal)
- ✅ Animaciones fade in/out al entrar/salir

### **Navegación:**
- ✅ Deslizar horizontalmente para cambiar de slide
- ✅ Botón "SIGUIENTE" para avanzar
- ✅ Botón "Omitir" para saltar al login
- ✅ Se muestra cada vez que abres la app (si no estás autenticado)
- ✅ No guarda estado en AsyncStorage

---

## 🚀 Cómo Funciona

### **Usuario NO Autenticado:**
1. Usuario abre la app
2. Se muestra OnboardingScreen con las 4 slides
3. Usuario navega por los slides o presiona "Omitir"
4. Redirige a Login o Register según elección

### **Usuario Autenticado:**
1. Usuario abre la app
2. Se salta el onboarding directamente
3. Redirige a Home (pantalla principal)

---

## 📂 Archivos Relacionados

```
src/screens/OnboardingScreen.tsx   ← Pantalla principal con las 4 slides
src/types/index.ts                  ← Tipos de navegación (RootStackParamList)
App.tsx                             ← Lógica de navegación inicial
assets/Slides/1.jpeg                ← Imagen slide 1 (Hinchada)
assets/Slides/2.jpeg                ← Imagen slide 2 (Carnet)
assets/Slides/3.jpeg                ← Imagen slide 3 (Estado Cuenta)
assets/Slides/4.jpeg                ← Imagen slide 4 (Beneficios)
```

---

## 🎨 Personalización

### **Cambiar textos:**
Edita el array `slides` en `OnboardingScreen.tsx` (línea 28):
```typescript
const slides: Slide[] = [
  {
    id: 1,
    title: 'TU NUEVO TÍTULO',
    subtitle: 'Tu nuevo subtítulo',
    buttonText: 'BOTÓN PERSONALIZADO',
    // ...
  },
];
```

### **Cambiar colores:**
Edita `styles` en `OnboardingScreen.tsx`:
```typescript
textContainer: {
  backgroundColor: COLORS.PRIMARY_GREEN, // Cambia el fondo verde
},
button: {
  backgroundColor: '#1a1a1a', // Cambia el color del botón
},
```

### **Cambiar imágenes:**
Reemplaza los archivos en `assets/`:
- Mantén los nombres de archivo
- O actualiza las referencias en el código

---

## ✅ Estado Actual

```yaml
✅ 4 slides implementados
✅ Navegación funcional
✅ Transiciones suaves con animaciones
✅ Diseño simplificado (solo imagen + controles)
✅ Indicadores de página (dots)
✅ Botones funcionales
✅ Se muestra cada vez que se abre la app (si no está autenticado)
✅ Responsive (se adapta a diferentes tamaños)
✅ Sin dependencias de AsyncStorage
```

---

## 📝 Notas

- **Producción:** El onboarding se muestra siempre que abres la app (si no estás autenticado)
- **Desarrollo:** Para probarlo, cierra sesión o desinstala/reinstala la app
- **Testing:** Los slides aparecen automáticamente cuando no hay sesión activa
- **Accesibilidad:** Los slides son navegables con gestos de swipe

---

## 🎯 Próximas Mejoras Posibles (Opcional)

- [ ] Animaciones más elaboradas (fade in/out)
- [ ] Videos en lugar de imágenes
- [ ] Skip automático después de X segundos
- [ ] Botón de retroceso
- [ ] Vibración/feedback táctil
- [ ] Análisis de qué slides ven más los usuarios
