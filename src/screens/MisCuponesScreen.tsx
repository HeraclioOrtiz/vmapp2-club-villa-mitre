import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Dimensions, Image,
  ActivityIndicator, TouchableOpacity, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COLORS } from '../constants/colors';
import { FloatingChatBot } from '../components/FloatingChatBot';
import DetalleCuponScreen from './DetalleCuponScreen';

// ====== CONFIG API ======
const API_BASE = 'https://surtekbb.com';
const ENDPOINT = `${API_BASE}/api/v1/promotions`;
const PER_PAGE = 15;
const TOKEN: string | null = null;

// ====== Tipos ======
type ApiPromotion = any;

type Beneficio = {
  id: string;
  titulo: string;         // (1) Título de la promo
  comercio: string;       // (2) Nombre del comercio
  descripcion: string;    // Texto descriptivo (se muestra más abajo)
  direccion?: string;
  telefono?: string;
  imagenUrl: string;
  raw?: any;              // guardamos el crudo para fechas
};

// ====== Helpers ======
const SURTEK_HTTP = /^http:\/\/([a-z0-9.-]*\.)?surtekbb\.com/i;
const toHttpsIfSurtek = (u: string) => (SURTEK_HTTP.test(u) ? u.replace(/^http:\/\//i, 'https://') : u);

function buildImageUrl(p: ApiPromotion): string {
  const link: string | undefined = p.image_link || p.imageLink;
  if (link && /^https?:\/\//i.test(link)) return toHttpsIfSurtek(link);
  const path: string | undefined = p.image_path || p.imagePath;
  if (path && typeof path === 'string') {
    const normalized = path.replace(/^\/+/, '');
    const urlPath = normalized.startsWith('promotions/') ? `storage/${normalized}` : normalized;
    return `${API_BASE}/${urlPath}`;
  }
  const fallback = p.image_url ?? p.image ?? p.imagenUrl ?? null;
  if (fallback && typeof fallback === 'string') {
    return /^https?:\/\//i.test(fallback)
      ? toHttpsIfSurtek(fallback)
      : `${API_BASE}/${fallback.replace(/^\/+/, '')}`;
  }
  return 'https://picsum.photos/seed/promo/600/360';
}

function pickCommerceName(p: ApiPromotion): string {
  return (
    p?.commerce?.name ||
    p?.comercio?.nombre ||
    p?.comercio ||
    p?.establecimiento ||
    p?.business_name ||
    p?.merchantName ||
    'Comercio'
  );
}
function pickAddress(p: ApiPromotion): string | undefined {
  return p?.commerce?.address || p?.comercio?.direccion || p?.direccion || p?.address || undefined;
}
function pickPhone(p: ApiPromotion): string | undefined {
  return p?.commerce?.phone || p?.comercio?.telefono || p?.telefono || p?.phone || undefined;
}

function mapApiToBeneficio(p: ApiPromotion): Beneficio {
  const titulo = p.title ?? p.titulo ?? 'Promoción';
  const descripcion = p.description ?? p.descripcion ?? '';
  return {
    id: String(p.id ?? p.uid ?? p.code ?? Math.random()),
    titulo: String(titulo),
    comercio: pickCommerceName(p),
    descripcion: String(descripcion),
    direccion: pickAddress(p),
    telefono: pickPhone(p),
    imagenUrl: buildImageUrl(p),
    raw: p,
  };
}

// Fecha → "dd/mm/yyyy HH:MM"
const formatISOToAR = (iso?: string | null) => {
  if (!iso || typeof iso !== 'string') return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  const pad = (n: number) => String(n).padStart(2, '0');
  const dd = pad(d.getDate());
  const mm = pad(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  const HH = pad(d.getHours());
  const MM = pad(d.getMinutes());
  return `${dd}/${mm}/${yyyy} ${HH}:${MM}`;
};

const getValidoHasta = (raw?: any): string => {
  // Prioridad: ends_at_human (si lo trae el backend), luego ends_at_iso, luego ends_at
  if (raw?.ends_at_human) return String(raw.ends_at_human);
  if (raw?.ends_at_iso) return formatISOToAR(raw.ends_at_iso);
  if (raw?.ends_at) return formatISOToAR(raw.ends_at);
  return '-';
};

const ImageWithLoader: React.FC<{ uri: string; style: any }> = ({ uri, style }) => {
  const [loading, setLoading] = useState(true);
  return (
    <View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
      {loading && <ActivityIndicator size="large" color={COLORS.PRIMARY_GREEN} style={styles.loaderAbs} />}
      <Image
        source={{ uri }}
        style={style}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
};

// ====== Data hook ======
function usePromotions() {
  const [items, setItems] = useState<Beneficio[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = async (p: number, replace = false) => {
    try {
      setLoading(true);
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const url = `${ENDPOINT}?per_page=${PER_PAGE}&page=${p}&current=15a&order_by=starts_at&direction=desc`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
        signal: abortRef.current.signal,
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);

      const json = text ? JSON.parse(text) : {};
      const arr: ApiPromotion[] = Array.isArray(json) ? json : (json.data ?? []);
      const mapped = arr.map(mapApiToBeneficio);

      setItems(replace ? mapped : (prev) => [...prev, ...mapped]);

      const cp = json.current_page ?? p;
      const lp = json.last_page ?? null;
      const nextUrl: string | null | undefined = json.next_page_url ?? null;
      setPage(cp);
      setLastPage(lp);
      setHasMore(Boolean(nextUrl) || (typeof lp === 'number' ? cp < lp : false));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    setLastPage(null);
    setHasMore(false);
    await fetchPage(1, true);
  };

  const loadMore = async () => {
    if (!hasMore) return;
    const next = (page ?? 1) + 1;
    if (lastPage && next > lastPage) return;
    await fetchPage(next);
  };

  useEffect(() => {
    fetchPage(1, true);
    return () => abortRef.current?.abort();
  }, []);

  return { items, loading, refreshing, refresh, loadMore, hasMore };
}

// ====== Lista estilo Beneficios ======
const ListaBeneficios: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation<any>();
  const { items, loading, refreshing, refresh, loadMore, hasMore } = usePromotions();

  const handleObtenerCupon = (b: Beneficio) => {
    const cupon = {
      id: b.id,
      titulo: b.titulo,
      descripcion: b.descripcion,
      validoHasta: getValidoHasta(b.raw),
      imagenUrl: b.imagenUrl,
      comercio: b.comercio,
      direccion: b.direccion,
      telefono: b.telefono,
      raw: b.raw,
    };
    navigation.navigate('DetalleCupon', { cupon });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        onMomentumScrollEnd={() => { if (hasMore && !loading) loadMore(); }}
      >
        <Text style={styles.headerText}>Red de Beneficios</Text>
        <Text style={styles.subHeaderText}>
          Descuentos exclusivos para socios del Club Villa Mitre
        </Text>

        {items.map((b) => (
          <View key={b.id} style={[styles.card, { width: screenWidth * 0.9 }]}>
            <ImageWithLoader uri={b.imagenUrl} style={styles.image} />

            <View style={styles.info}>
              {/* (1) Título de la promoción */}
              <Text style={styles.tituloPromo} numberOfLines={2}>{b.titulo}</Text>

              {/* (2) Nombre del comercio */}
              <Text style={styles.comercio} numberOfLines={1}>{b.comercio}</Text>

              {/* (3) Válido hasta: fecha formateada */}
              <Text style={styles.validText}>
                Válido hasta: <Text style={styles.validStrong}>{getValidoHasta(b.raw)}</Text>
              </Text>

              {/* Dirección / Teléfono */}
              {b.direccion ? (
                <View style={styles.contactRow}>
                  <Ionicons name="location-outline" size={16} color={COLORS.GRAY_MEDIUM} />
                  <Text style={styles.direccion} numberOfLines={1}>{b.direccion}</Text>
                </View>
              ) : null}

              {b.telefono ? (
                <View style={styles.contactRow}>
                  <Ionicons name="call-outline" size={16} color={COLORS.GRAY_MEDIUM} />
                  <Text style={styles.telefono} numberOfLines={1}>{b.telefono}</Text>
                </View>
              ) : null}

              {/* Descripción (más abajo) */}
              {b.descripcion ? (
                <Text style={styles.descripcion} numberOfLines={4}>{b.descripcion}</Text>
              ) : null}

              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => handleObtenerCupon(b)}
                activeOpacity={0.8}
              >
                <View style={styles.ctaButtonContent}>
                  <Ionicons name="pricetags-outline" size={24} color={COLORS.WHITE} />
                  <Text style={styles.ctaButtonText}>Obtener cupón</Text>
                </View>
                <View style={styles.ctaButtonGlow} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {loading && items.length === 0 ? (
          <ActivityIndicator size="large" color={COLORS.PRIMARY_GREEN} style={{ marginTop: 20 }} />
        ) : null}

        {hasMore && !loading && (
          <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore}>
            <Text style={styles.loadMoreText}>Cargar más</Text>
          </TouchableOpacity>
        )}

        {!loading && items.length === 0 ? (
          <Text style={{ color: COLORS.TEXT_SECONDARY, marginTop: 10 }}>
            No hay promociones disponibles.
          </Text>
        ) : null}
      </ScrollView>

      <FloatingChatBot />
    </View>
  );
};

// ====== Stack (asegura que exista DetalleCupon) ======
const Stack = createNativeStackNavigator();

export default function MisBeneficiosScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListaBeneficios" component={ListaBeneficios} options={{ headerShown: false }} />
      <Stack.Screen name="DetalleCupon" component={DetalleCuponScreen} options={{ title: 'Detalle del cupón' }} />
    </Stack.Navigator>
  );
}

// ====== Estilos ======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 100,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'BarlowCondensed-Bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    marginVertical: 12,
    overflow: 'hidden',
    shadowColor: COLORS.PRIMARY_BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  image: { width: '100%', height: 200 },
  loaderAbs: { position: 'absolute', top: '40%' },
  info: { padding: 20 },

  // Orden nuevo
  tituloPromo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
    fontFamily: 'BarlowCondensed-Bold',
  },
  comercio: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
  },
  validText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
  },
  validStrong: { color: COLORS.TEXT_PRIMARY, fontWeight: '600' },

  // Contacto
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  direccion: { fontSize: 14, color: COLORS.TEXT_SECONDARY, marginLeft: 8, flex: 1 },
  telefono: { fontSize: 14, color: COLORS.TEXT_SECONDARY, marginLeft: 8, flex: 1 },

  // Descripción (más abajo)
  descripcion: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 8,
    marginBottom: 16,
    fontWeight: '600',
    lineHeight: 22,
  },

  // CTA
  ctaButton: {
    backgroundColor: COLORS.PRIMARY_GREEN,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  ctaButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  ctaButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'BarlowCondensed-Bold',
  },
  ctaButtonGlow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0,
  },

  // Load more
  loadMoreBtn: {
    alignSelf: 'center',
    backgroundColor: COLORS.PRIMARY_GREEN,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 8,
  },
  loadMoreText: { color: '#fff', fontWeight: 'bold' },
});
