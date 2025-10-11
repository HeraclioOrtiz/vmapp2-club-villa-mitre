# ⚡ Comandos Rápidos - Build y Publicación

## 🔐 Login en EAS
```bash
eas login
```

## 📦 Builds

### APK para Testing
```bash
npm run build:apk
```
- ✅ Genera APK instalable
- ✅ Perfecto para probar en dispositivos
- ✅ Se puede compartir por WhatsApp/Email
- ⏱️ Tiempo: ~15 minutos

### AAB para Play Store  
```bash
npm run build:production
```
- ✅ Genera Android App Bundle (.aab)
- ✅ Optimizado para Play Store
- ✅ Tamaño de descarga reducido
- ⏱️ Tiempo: ~15 minutos

### Preview Rápido
```bash
npm run build:preview
```
- ✅ Build rápido para testing interno
- ⏱️ Tiempo: ~10 minutos

## 📤 Ver Builds
```bash
eas build:list
```

## 🚀 Publicar en Play Store
```bash
npm run submit:playstore
```

## 🔄 Proceso Completo (Primera Vez)

```bash
# 1. Login
eas login

# 2. Build para Play Store
npm run build:production

# 3. Esperar (~15 min)
# El link de descarga aparecerá en la terminal

# 4. Subir manualmente a Play Console
# O usar:
npm run submit:playstore
```

## 📱 Testing Local

```bash
# Iniciar en Android
npm run android

# Iniciar servidor
npm start
```

## 🧹 Limpiar

```bash
# Limpiar node_modules
rm -rf node_modules
npm install

# Limpiar caché de Expo
npx expo start --clear
```

## 📊 Estado del Build

Durante el build verás:
```
✔ Build started
✔ Uploading to EAS Build
✔ Building...
✔ Build finished
✔ Link: https://expo.dev/...
```

## ⚠️ Si algo falla

```bash
# Limpiar todo y reintentar
rm -rf node_modules
npm install
eas build --clear-cache --profile production --platform android
```

## 📝 Notas

- **Primer build:** ~20 minutos
- **Builds siguientes:** ~10-15 minutos
- **Límite gratuito:** 30 builds/mes en plan free
- **Plan pagado:** Builds ilimitados + builds más rápidos
