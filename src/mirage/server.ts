import { createServer } from 'miragejs';
import { Usuario, Actividad, Beneficio, Cupon, Local, PuntosData } from '../types';

// Mock data - JSON directo sin DB
const mockData = {
  usuario: {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    dni: '12345678',
    email: 'juan.perez@email.com',
    fotoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    validoHasta: '31/12/2025',
    codigoBarras: '123456789012',
  } as Usuario,

  actividades: [
    { id: '1', icono: '🥋', titulo: 'Karate', detalle: '+7 años (mixto)', contacto: 'Néstor 2915272778', imagenUrl: 'https://picsum.photos/id/1011/600/300' },
    { id: '2', icono: '🤸', titulo: 'Gimnasia Artística', detalle: '+3 años (mixto)', contacto: 'IG: @gimnasiaartisticacvmbb', imagenUrl: 'https://picsum.photos/id/1012/600/300' },
    { id: '3', icono: '⛸️', titulo: 'Patín', detalle: '+3 años (mixto)', contacto: 'Lorena Carinelli 2914370612', imagenUrl: 'https://picsum.photos/id/1013/600/300' },
    { id: '4', icono: '🏐', titulo: 'Vóley', detalle: '+12 años (mixto)', contacto: 'Coordinación 2915348520', imagenUrl: 'https://picsum.photos/id/1014/600/300' },
    { id: '5', icono: '⚽', titulo: 'Fútbol', detalle: '+6 años (mixto)', contacto: 'Entrenadores 2915348520', imagenUrl: 'https://picsum.photos/id/1015/600/300' },
  ] as Actividad[],

  beneficios: [
    { id: '1', titulo: 'Área de Cultura', detalle: 'Talleres, festivales, espectáculos, reseñas y convocatorias culturales.', contacto: 'Cultura 2915348520', imagenUrl: 'https://picsum.photos/id/1031/600/300' },
    { id: '2', titulo: 'Área Social', detalle: 'Campañas de salud, colectas, capacitaciones y cursos con salida laboral.', imagenUrl: 'https://picsum.photos/id/1032/600/300' },
  ] as Beneficio[],

  cupones: [
    { id: '1', titulo: '10% Off Restaurante', descripcion: 'Descuento en comidas', validoHasta: '2025-12-31', categoria: 'Alimentos', imagenUrl: 'https://picsum.photos/id/1011/200/120' },
  ] as Cupon[],

  locales: [
    { id: '1', nombre: 'Club Villa Mitre', latitude: -38.7196, longitude: -62.2658 },
  ] as Local[],
};

export function makeServer({ environment = 'development' } = {}) {
  console.log('🔧 Mirage: makeServer called - JSON directo sin DB');
  
  const server = createServer({
    environment,

    routes() {
      this.namespace = 'api';
      
      // Log intercepted requests only in development
      if (__DEV__) {
        this.pretender.handledRequest = function(verb, path, request) {
          console.log(`✅ Mirage intercepted: ${verb} ${path}`);
        };
        
        this.pretender.unhandledRequest = function(verb, path) {
          // Ignorar requests de simbolización de React Native
          if (path.includes('/symbolicate') || path.includes('/inspector')) {
            return;
          }
          console.error(`❌ Mirage unhandled: ${verb} ${path}`);
        };
      }

      // Auth routes - JSON directo
      this.post('/auth/login', (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);
        
        if (email && password) {
          return {
            user: mockData.usuario,
            token: 'fake-jwt-token-' + Date.now(),
          };
        }
        
        return { error: 'Credenciales inválidas' };
      });

      this.post('/auth/logout', () => {
        return { success: true };
      });

      this.get('/auth/me', () => {
        return mockData.usuario;
      });

      // Actividades routes - JSON directo
      this.get('/actividades', () => {
        if (__DEV__) {
          console.log('🎯 Mirage: /actividades route called - returning JSON directo');
          console.log('📊 Mirage: actividades count:', mockData.actividades.length);
        }
        return mockData.actividades;
      });

      this.get('/actividades/:id', (schema, request) => {
        const id = request.params.id;
        const actividad = mockData.actividades.find(a => a.id === id);
        return actividad || null;
      });

      // Beneficios routes - JSON directo
      this.get('/beneficios', () => {
        if (__DEV__) {
          console.log('🎯 Mirage: /beneficios route called - returning JSON directo');
        }
        return mockData.beneficios;
      });

      // Cupones routes - JSON directo
      this.get('/cupones', () => {
        return mockData.cupones;
      });

      this.get('/cupones/categorias', () => {
        return ['Alimentos', 'Entretenimiento', 'Moda'];
      });

      this.get('/cupones/:id', (schema, request) => {
        const id = request.params.id;
        const cupon = mockData.cupones.find(c => c.id === id);
        return cupon || null;
      });

      // Puntos routes - JSON directo
      this.get('/puntos', () => {
        const puntosData: PuntosData = {
          puntosTotales: 1200,
          puntosObtenidos: 1800,
          puntosGastados: 600,
          historialMensual: [200, 300, 250, 400, 350, 300],
        };
        return puntosData;
      });

      this.post('/puntos/canjear', (schema, request) => {
        const { puntosACanjear } = JSON.parse(request.requestBody);
        
        return {
          success: true,
          nuevoPuntaje: 1200 - puntosACanjear,
        };
      });

      // Locales routes - JSON directo
      this.get('/locales', () => {
        return mockData.locales;
      });

      // Timing simulation - reduced for mobile
      this.timing = 200; // 200ms delay to simulate network
    },
  });

  if (__DEV__) {
    console.log('✅ Mirage: Server initialized successfully');
  }
  
  return server;
}
