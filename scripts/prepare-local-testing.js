#!/usr/bin/env node

/**
 * Script para preparar y verificar el entorno de testing local
 * Villa Mitre App - Local Server Testing Setup
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 PREPARANDO TESTING CON SERVIDORES LOCALES');
console.log('='.repeat(60));

// Verificar configuración actual
console.log('📋 VERIFICANDO CONFIGURACIÓN...\n');

// 1. Verificar .env
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Archivo .env encontrado');
  
  if (envContent.includes('API_BASE_URL=http://10.0.2.2:8000/api')) {
    console.log('✅ API_BASE_URL configurada para Android Emulator');
  } else if (envContent.includes('localhost:8000')) {
    console.log('✅ API_BASE_URL configurada para localhost');
  } else {
    console.log('⚠️  Verificar configuración de API_BASE_URL en .env');
  }
  
  if (envContent.includes('USE_MIRAGE_SERVER=false')) {
    console.log('✅ Mirage Server deshabilitado (usando API real)');
  } else {
    console.log('⚠️  Mirage Server habilitado - cambiar a false para API real');
  }
} else {
  console.log('❌ Archivo .env no encontrado');
}

// 2. Verificar app.json
const appJsonPath = path.join(process.cwd(), 'app.json');
if (fs.existsSync(appJsonPath)) {
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  console.log('✅ Archivo app.json encontrado');
  
  if (appJson.expo?.extra?.API_BASE_URL) {
    console.log(`✅ API_BASE_URL en app.json: ${appJson.expo.extra.API_BASE_URL}`);
  }
  
  if (appJson.expo?.packagerOpts?.config === 'metro.config.js') {
    console.log('✅ Metro config configurado');
  }
} else {
  console.log('❌ Archivo app.json no encontrado');
}

// 3. Verificar estructura de componentes de gimnasio
console.log('\n🏋️ VERIFICANDO COMPONENTES DE GIMNASIO...');

const gymComponents = [
  'src/components/gym/TodayWorkoutCard.tsx',
  'src/components/gym/ExerciseCard.tsx',
  'src/components/gym/index.ts',
  'src/screens/gym/DailyWorkoutScreen.tsx',
  'src/services/gymService.ts',
  'src/types/gym.ts'
];

gymComponents.forEach(component => {
  const componentPath = path.join(process.cwd(), component);
  if (fs.existsSync(componentPath)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component} - FALTANTE`);
  }
});

// 4. Verificar tests
console.log('\n🧪 VERIFICANDO TESTS...');

const testFiles = [
  'src/__tests__/basic.test.ts',
  'src/__tests__/services/authService.simple.test.ts',
  'src/__tests__/services/promotionService.simple.test.ts',
  'src/__tests__/services/gymService.simple.test.ts',
  'src/__tests__/integration/authFlow.simple.test.ts'
];

testFiles.forEach(testFile => {
  const testPath = path.join(process.cwd(), testFile);
  if (fs.existsSync(testPath)) {
    console.log(`✅ ${testFile}`);
  } else {
    console.log(`❌ ${testFile} - FALTANTE`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('🎯 CHECKLIST PARA TESTING LOCAL:');
console.log('');

console.log('📋 BACKEND (Laravel):');
console.log('  1. cd /ruta/al/backend/laravel');
console.log('  2. php artisan serve --host=0.0.0.0 --port=8000');
console.log('  3. Verificar que responda en http://localhost:8000');
console.log('');

console.log('📱 FRONTEND (React Native):');
console.log('  1. npm start (en esta carpeta)');
console.log('  2. Presionar "a" para Android o "i" para iOS');
console.log('  3. Verificar conectividad con npm run test:api');
console.log('');

console.log('🔧 COMANDOS ÚTILES:');
console.log('  - npm run test:api          → Probar conectividad');
console.log('  - npm run validate:working  → Validar tests');
console.log('  - npm start                 → Iniciar app móvil');
console.log('  - npm test                  → Ejecutar tests');
console.log('');

console.log('🌐 CONFIGURACIÓN DE RED:');
console.log('  - Android Emulator: 10.0.2.2:8000 (ya configurado)');
console.log('  - iOS Simulator: localhost:8000');
console.log('  - Dispositivo físico: IP de tu máquina:8000');
console.log('');

console.log('🎉 ¡LISTO PARA TESTING LOCAL!');
console.log('Asegúrate de tener el servidor Laravel corriendo antes de iniciar la app.');
