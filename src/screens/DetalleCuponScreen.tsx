import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, Image,
  ActivityIndicator, Platform, ScrollView, Alert
} from "react-native";

// ========== Error Boundary (tipado correcto) ==========
type EBProps = {
  fallback?: React.ReactNode;
  children?: React.ReactNode;
};
type EBState = {
  hasError: boolean;
  err?: any;
};

class ErrorBoundary extends React.Component<EBProps, EBState> {
  state: EBState = { hasError: false, err: null };

  static getDerivedStateFromError(error: any): EBState {
    return { hasError: true, err: error };
  }

  componentDidCatch(error: any, info: any) {
    console.log("[EB] Caught:", error?.message, info?.componentStack);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#a00", textAlign: "center", marginBottom: 6 }}>
            Ocurrió un error al renderizar este módulo.
          </Text>
        </View>
      );
    }
    return this.props.children ?? null;
  }
}

// ===== CARGA OPCIONAL DEL QR (sin esto no crashea) =====
let QRCodeComp: any = null;
try {
  const qrPkg = require("react-native-qrcode-svg");
  QRCodeComp = qrPkg.default ?? qrPkg;
} catch (e: any) {
  console.log("[QR] Módulo QR no disponible:", e?.message || e);
}

const API_BASE = "https://surtekbb.com";
// TODO: reemplazar por tu userId real (desde tu auth/contexto)
const USER_ID  = 123;

export default function DetalleCuponScreen({ route }: any) {
  const { cupon } = route.params || {};
  const [modalVisible, setModalVisible] = useState(false);

  const [qrLoading, setQrLoading] = useState(false);
  const [qrValue, setQrValue] = useState<string>('');
  const [qrCodeText, setQrCodeText] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [lastRawError, setLastRawError] = useState<string>('');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      console.log('[QR] Countdown detenido');
    }
  };

  useEffect(() => () => clearTimer(), []);

  const startCountdown = (expISO?: string, secondsFromServer?: number) => {
    clearTimer();
    let start = 0;
    if (expISO) start = Math.max(0, Math.floor((new Date(expISO).getTime() - Date.now()) / 1000));
    else if (typeof secondsFromServer === 'number') start = Math.max(0, Math.floor(secondsFromServer));
    else start = 3600;
    setSecondsLeft(start);
    console.log('[QR] Countdown iniciado →', { start });
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) { clearTimer(); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const claimQr = async () => {
    try {
      if (!QRCodeComp) {
        const msg = 'QR no disponible (instalá react-native-svg y react-native-qrcode-svg).';
        console.log('[QR][ERROR]', msg);
        Alert.alert('QR no disponible', msg);
        return;
      }

      setQrLoading(true);
      setQrValue(''); setQrCodeText(''); setExpiresAt(null); setSecondsLeft(0); setLastRawError('');

      const promoId = Number(cupon?.id);
      if (!Number.isInteger(promoId)) {
        console.log('[QR][ERROR] ID de promoción inválido. cupon=', cupon);
        Alert.alert('Cupón inválido', 'ID de promoción inválido.');
        return;
      }
      const userId = Number(USER_ID);
      if (!Number.isInteger(userId)) {
        Alert.alert('Sesión requerida', 'Falta user_id numérico o no estás logueado.');
        return;
      }

      const url = `${API_BASE}/api/v1/promotions/${promoId}/claim-qr`;
      const payload = { user_id: userId, device: `rn-${Platform.OS}` };
      console.log('[QR][REQUEST] POST', url, 'payload:', payload);

      let res: Response;
      try {
        res = await fetch(url, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (netErr: any) {
        console.log('[QR][NETWORK] Error →', netErr?.message || netErr);
        Alert.alert('Sin conexión', `No se pudo conectar a:\n${url}\n\nDetalle: ${netErr?.message || 'Network request failed'}`);
        return;
      }

      const ct = res.headers?.get?.('content-type') || '';
      const isJson = ct.includes('application/json');
      console.log('[QR][RESPONSE] status:', res.status, res.ok, 'CT:', ct);

      const raw = await res.text();
      if (!isJson) setLastRawError(raw.slice(0, 500));
      console.log('[QR][RESPONSE] raw (0..500):', raw.slice(0, 500));

      let data: any = {};
      try { data = raw ? JSON.parse(raw) : {}; }
      catch (e: any) { console.log('[QR][WARN] JSON parse:', e?.message); }

      const hasQrVal = typeof data?.qr_value === 'string' && data.qr_value.length > 0;
      const hasCode  = typeof data?.code === 'string' && data.code.length > 0;

      if (!res.ok || data?.status !== 'ok' || !(hasQrVal || hasCode)) {
        const reason = !isJson ? `Respuesta no-JSON (posible HTML/redirect)` : (data?.message || `HTTP ${res.status}`);
        console.log('[QR][ERROR] Claim falló →', reason, 'data:', data);
        Alert.alert('No se pudo generar el QR', reason);
        return;
      }

      const encodeValueRaw = String((data.qr_value ?? data.code) || '').trim();
      const encodeValue = encodeValueRaw.replace(/^http:\/\//i, 'https://');
      setQrValue(encodeValue);
      if (hasCode) setQrCodeText(String(data.code));
      setExpiresAt(data.expires_at ?? null);
      startCountdown(data.expires_at, data.seconds_left);
    } catch (e: any) {
      console.log('[QR][CATCH] Error en claim:', e?.message, e);
      setQrValue(''); setQrCodeText(''); setExpiresAt(null); setSecondsLeft(0);
      Alert.alert('No se pudo generar el QR', e?.message ?? 'Error inesperado');
    } finally {
      setQrLoading(false);
    }
  };

  const openModal = () => { setModalVisible(true); claimQr(); };
  const closeModal = () => { setModalVisible(false); clearTimer(); };
  const regenerate = () => { claimQr(); };

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return h > 0 ? `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}` : `${m}:${s.toString().padStart(2,'0')}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageWithLoader uri={cupon?.imagenUrl} style={styles.image} />

      <Text style={styles.title}>{cupon?.titulo}</Text>
      <Text style={styles.desc}>{cupon?.descripcion}</Text>
      <Text style={styles.valid}>Válido hasta: {cupon?.validoHasta}</Text>

      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>Obtener Cupón</Text>
      </TouchableOpacity>

      {/* Modal con QR */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tu Cupón</Text>

            {qrLoading ? (
              <View style={{ alignItems:'center' }}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop:10 }}>Generando QR...</Text>
              </View>
            ) : qrValue ? (
              <>
                {QRCodeComp ? (
                  <ErrorBoundary fallback={
                    <Text style={{ color: '#a00', textAlign:'center' }}>
                      No se pudo renderizar el código QR (verificá react-native-svg).
                    </Text>
                  }>
                    <QRCodeComp key={qrValue} value={qrValue} size={220} backgroundColor="white" />
                  </ErrorBoundary>
                ) : (
                  <Text style={{ color:'#a00', textAlign:'center' }}>
                    QR no disponible (falta react-native-qrcode-svg / react-native-svg)
                  </Text>
                )}

                <Text selectable style={{ marginTop: 8, fontSize: 12, textAlign: 'center' }}>
                  {qrCodeText || qrValue}
                </Text>

                <Text style={styles.timer}>
                  Expira en: <Text style={styles.timerStrong}>{formatTime(secondsLeft)}</Text>
                </Text>
                <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={regenerate}>
                  <Text style={styles.buttonText}>Generar nuevo</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Text>No se pudo generar el QR.</Text>
                {lastRawError ? (
                  <Text selectable style={{ marginTop: 8, fontSize: 10, color: '#a00' }}>
                    (Debug) Respuesta no-JSON: {lastRawError}
                  </Text>
                ) : null}
                <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={regenerate}>
                  <Text style={styles.buttonText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// ===== Imagen con loader + placeholder =====
const PLACEHOLDER = "https://picsum.photos/seed/promo/800/450";
const ImageWithLoader: React.FC<{ uri?: string; style: any }> = ({ uri, style }) => {
  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState<string>(typeof uri === "string" && uri.length ? uri : PLACEHOLDER);
  return (
    <View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
      {loading && <ActivityIndicator size="small" style={{ position: 'absolute' }} />}
      <Image
        source={{ uri: src }}
        style={style}
        onLoadEnd={() => setLoading(false)}
        onError={(e) => { console.log('[IMG] error→', src, e?.nativeEvent); setSrc(PLACEHOLDER); setLoading(false); }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  image: { width: "100%", height: 180, borderRadius: 10, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: 'center' },
  desc: { fontSize: 16, textAlign: "center", marginBottom: 10 },
  valid: { fontSize: 14, color: "#888", marginBottom: 20 },
  button: { backgroundColor: "#4CAF50", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, marginBottom: 20 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  modalContent: { width: 320, backgroundColor: "#fff", padding: 20, borderRadius: 15, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  closeButton: { marginTop: 20, backgroundColor: "#f44336", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
  timer: { marginTop: 10, fontSize: 14, color: '#333' },
  timerStrong: { fontWeight: 'bold' },
});
