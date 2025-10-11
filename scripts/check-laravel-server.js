#!/usr/bin/env node

/**
 * Script para verificar que el servidor Laravel esté corriendo
 */

const http = require('http');

console.log('🔍 VERIFICANDO SERVIDOR LARAVEL...\n');

const checkServer = (host, port, path = '') => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
};

async function checkLaravelServer() {
  const servers = [
    { name: 'Laravel (localhost)', host: 'localhost', port: 8000, path: '/' },
    { name: 'Laravel API (localhost)', host: 'localhost', port: 8000, path: '/api/health' },
  ];

  for (const server of servers) {
    try {
      console.log(`Verificando ${server.name}...`);
      const response = await checkServer(server.host, server.port, server.path);
      
      if (response.status === 200) {
        console.log(`✅ ${server.name} - FUNCIONANDO (${response.status})`);
        if (server.path === '/api/health') {
          try {
            const healthData = JSON.parse(response.data);
            console.log(`   📊 Status: ${healthData.status || 'OK'}`);
            if (healthData.timestamp) {
              console.log(`   🕐 Timestamp: ${healthData.timestamp}`);
            }
          } catch (e) {
            console.log(`   📄 Respuesta: ${response.data.substring(0, 100)}...`);
          }
        }
      } else {
        console.log(`⚠️  ${server.name} - Respuesta: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${server.name} - NO DISPONIBLE`);
      console.log(`   Error: ${error.message}`);
      
      if (error.code === 'ECONNREFUSED') {
        console.log(`   💡 Solución: Ejecutar "php artisan serve --host=0.0.0.0 --port=8000"`);
      }
    }
    console.log('');
  }
}

console.log('🚀 Iniciando verificación...\n');
checkLaravelServer().then(() => {
  console.log('✅ Verificación completada');
  console.log('\n🔧 Si el servidor no está corriendo:');
  console.log('1. cd /ruta/al/proyecto/laravel');
  console.log('2. php artisan serve --host=0.0.0.0 --port=8000');
  console.log('3. Verificar que responda en http://localhost:8000');
}).catch((error) => {
  console.error('❌ Error durante la verificación:', error);
});
