
// ===== INTERFACES PRINCIPALES =====

// Usuario/Socio del club
export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  fotoUrl: string;
  validoHasta: string;
  codigoBarras?: string;
}

// Actividades deportivas del club
export interface Actividad {
  id: string;
  icono: string;
  titulo: string;
  detalle: string;
  contacto: string;
  imagenUrl: string;
}

// Beneficios/Áreas del club
export interface Beneficio {
  id: string;
  titulo: string;
  detalle: string;
  contacto?: string;
  imagenUrl: string;
}

// Cupones de descuento
export type CategoriasCupon = 'Alimentos' | 'Entretenimiento' | 'Moda';

export interface Cupon {
  id: string;
  titulo: string;
  descripcion: string;
  validoHasta: string;
  categoria: CategoriasCupon;
  imagenUrl: string;
}

// Sistema de puntos
export interface PuntosData {
  puntosTotales: number;
  puntosObtenidos: number;
  puntosGastados: number;
  historialMensual: number[];
}

// Locales/Ubicaciones para mapas
export interface Local {
  id: string;
  nombre: string;
  latitude: number;
  longitude: number;
}

// ===== TIPOS DE ESTADO =====

// Estado de autenticación
export interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Estado genérico para listas con loading
export interface BaseListState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

// Estado específico para cupones (con filtro de categoría)
export interface CuponesState extends BaseListState<Cupon> {
  categoriaSeleccionada: string | null;
}

// Estado para puntos
export interface PuntosState {
  data: PuntosData | null;
  loading: boolean;
  error: string | null;
}

// ===== ROOT STATE =====
export interface RootState {
  auth: AuthState;
  actividades: BaseListState<Actividad>;
  beneficios: BaseListState<Beneficio>;
  cupones: CuponesState;
  puntos: PuntosState;
  locales: BaseListState<Local>;
}

// ===== TIPOS DE API RESPONSES =====
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Usuario;
  token: string;
}

// ===== NAVIGATION TYPES =====
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

export type DrawerParamList = {
  MisActividades: undefined;
  MisBeneficios: undefined;
  MisCupones: undefined;
  MisPuntos: undefined;
  MiCarnet: undefined;
};

export type CuponesStackParamList = {
  ListaCupones: undefined;
  DetalleCupon: { cupon: Cupon };
};
