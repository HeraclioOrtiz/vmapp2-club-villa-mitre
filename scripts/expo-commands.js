#!/usr/bin/env node

/**
 * Script con comandos útiles de Expo para testing local
 */

console.log('📱 COMANDOS DE EXPO - VILLA MITRE APP');
console.log('='.repeat(50));

console.log('🚀 COMANDOS PRINCIPALES:');
console.log('');
console.log('📱 INICIAR DESARROLLO:');
console.log('   npm start              → Iniciar Expo Dev Server');
console.log('   npx expo start         → Iniciar Expo Dev Server (directo)');
console.log('   npx expo start --clear → Iniciar con cache limpio');
console.log('');

console.log('🎯 PLATAFORMAS ESPECÍFICAS:');
console.log('   npm run android        → Abrir en Android Emulator');
console.log('   npm run ios            → Abrir en iOS Simulator');
console.log('   npm run web            → Abrir en navegador web');
console.log('');

console.log('🔧 COMANDOS ÚTILES:');
console.log('   npx expo install       → Instalar dependencias compatibles');
console.log('   npx expo doctor        → Diagnosticar problemas');
console.log('   npx expo r -c          → Restart con cache limpio');
console.log('');

console.log('📊 INFORMACIÓN:');
console.log('   npx expo --version     → Ver versión de Expo CLI');
console.log('   npx expo whoami        → Ver usuario logueado');
console.log('');

console.log('🌐 OPCIONES DE CONEXIÓN:');
console.log('   --tunnel               → Usar túnel (dispositivos físicos)');
console.log('   --lan                  → Usar red local');
console.log('   --localhost            → Solo localhost');
console.log('');

console.log('💡 EJEMPLOS PARA TESTING LOCAL:');
console.log('');
console.log('1️⃣  DESARROLLO NORMAL:');
console.log('   npx expo start');
console.log('   → Presionar "a" para Android');
console.log('');

console.log('2️⃣  CON CACHE LIMPIO:');
console.log('   npx expo start --clear');
console.log('   → Útil si hay problemas de cache');
console.log('');

console.log('3️⃣  DIRECTO A ANDROID:');
console.log('   npm run android');
console.log('   → Abre automáticamente en emulador');
console.log('');

console.log('4️⃣  PARA DISPOSITIVO FÍSICO:');
console.log('   npx expo start --tunnel');
console.log('   → Escanear QR con Expo Go app');
console.log('');

console.log('🔍 TROUBLESHOOTING:');
console.log('');
console.log('❌ "Metro bundler not found":');
console.log('   → npx expo install');
console.log('   → npx expo start --clear');
console.log('');

console.log('❌ "Network request failed":');
console.log('   → Verificar servidor Laravel corriendo');
console.log('   → npm run check:server');
console.log('');

console.log('❌ "Unable to resolve module":');
console.log('   → npm install');
console.log('   → npx expo start --clear');
console.log('');

console.log('🎯 CONFIGURACIÓN ACTUAL:');
console.log('   📱 Android: http://10.0.2.2:8000/api');
console.log('   🍎 iOS: http://localhost:8000/api');
console.log('   🌐 Web: http://localhost:8000/api');
console.log('');

console.log('✅ LISTO PARA EXPO DEVELOPMENT!');
console.log('Ejecutar: npx expo start');
