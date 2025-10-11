# Guía para Subir VMApp2 a la App Store

## Requisitos Previos

### 1. Cuenta de Desarrollador de Apple
- Necesitas una cuenta de Apple Developer ($99/año)
- Registrarte en: https://developer.apple.com/

### 2. Instalación de Herramientas
```bash
# Instalar EAS CLI globalmente
npm install -g @expo/eas-cli

# Iniciar sesión en Expo
eas login
```

## Configuración Completada

✅ **app.json** - Configurado con:
- Bundle identifier: `com.villamitre.vmapp2`
- Permisos de ubicación, cámara y galería
- Configuraciones de privacidad
- Soporte para tablets

✅ **eas.json** - Configurado para builds de producción

✅ **package.json** - Scripts de build añadidos

## Pasos para Subir a la App Store

### Paso 1: Configurar Credenciales
```bash
# Configurar credenciales de iOS
eas credentials
```

### Paso 2: Actualizar eas.json con tu información
Edita el archivo `eas.json` y reemplaza:
- `tu-apple-id@email.com` con tu Apple ID
- `1234567890` con tu App Store Connect App ID
- `TU_TEAM_ID` con tu Team ID de Apple Developer

### Paso 3: Crear Build de Producción
```bash
# Build para iOS
npm run build:ios

# O usar el comando directo
eas build --platform ios --profile production
```

### Paso 4: Subir a App Store Connect
```bash
# Subir automáticamente
npm run submit:ios

# O manualmente a través de App Store Connect
```

## Configuración Manual en App Store Connect

1. **Crear nueva aplicación** en App Store Connect
2. **Información de la app**:
   - Nombre: Villa Mitre App
   - Bundle ID: com.villamitre.vmapp2
   - Categoría: Utilidades o la que corresponda

3. **Información requerida**:
   - Descripción de la app
   - Palabras clave
   - Screenshots (requeridos para diferentes tamaños de pantalla)
   - Icono de la app (1024x1024px)

4. **Privacidad**:
   - Política de privacidad (URL requerida)
   - Declaración de uso de datos

## Screenshots Requeridos para iOS

Necesitarás screenshots en estos tamaños:
- **iPhone 6.7"**: 1290 x 2796 px
- **iPhone 6.5"**: 1242 x 2688 px  
- **iPhone 5.5"**: 1242 x 2208 px
- **iPad Pro (6th gen)**: 2048 x 2732 px
- **iPad Pro (2nd gen)**: 2048 x 2732 px

## Comandos Útiles

```bash
# Ver estado del build
eas build:list

# Ver logs del build
eas build:view [BUILD_ID]

# Cancelar build
eas build:cancel [BUILD_ID]

# Ver submissions
eas submit:list
```

## Notas Importantes

1. **Primera vez**: El proceso puede tomar 1-2 horas para el build
2. **Revisión de Apple**: Puede tomar 24-48 horas
3. **Actualizaciones**: Incrementa automáticamente el buildNumber
4. **Testing**: Usa TestFlight para testing antes de producción

## Solución de Problemas Comunes

### Error de Certificados
```bash
eas credentials --platform ios
```

### Error de Bundle Identifier
- Verifica que el bundle ID sea único en App Store Connect
- Debe coincidir exactamente con el configurado en app.json

### Error de Permisos
- Asegúrate de que todos los permisos estén justificados en la descripción
- Los permisos de ubicación y cámara están configurados correctamente

## Contacto y Soporte

- Documentación oficial: https://docs.expo.dev/submit/ios/
- Soporte EAS: https://expo.dev/support
