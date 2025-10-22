import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, Image,
  ActivityIndicator, Platform, ScrollView, Alert
} from "react-native";
import { useAppSelector } from "../hooks/redux";

// ErrorBoundary igual que antes…
type EBProps = { fallback?: React.ReactNode; children?: React.ReactNode };
type EBState = { hasError: boolean; err?: any };
class ErrorBoundary extends React.Component<EBProps, EBState> {
  state: EBState = { hasError: false, err: null };
  static getDerivedStateFromError(error: any): EBState { return { hasError: true, err: error }; }
  componentDidCatch(error: any, info: any) { console.log("[EB] Caught:", error?.message, info?.componentStack); }
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

// QR opcional
let QRCodeComp: any = null;
try {
  const qrPkg = require("react-native-qrcode-svg");
  QRCodeComp = qrPkg.default ?? qrPkg;
} catch (e: any) {
  console.log("[QR] Módulo QR no disponible:", e?.message || e);
}

const API_BASE = "https://surtekbb.com";
const USER_ID_FALLBACK = 123;

type Cupon = {
  id: string | number;
  titulo?: string;
  descripcion?: string;
  validoHasta?: string;
  categoria?: string;
  imagenUrl?: string;
  comercio?: string;
};
type DetalleParams = { cupon?: Cupon; action?: "generateQR" | string };

export default function DetalleCuponScreen({ route }: any) {
  const { cupon, action } = (route?.params ?? {}) as DetalleParams;

  // ✅ sin useAuth: leo auth del slice directamente
  const auth: any = useAppSelector((s) => s.auth);
  const token: string | null =
    auth?.token ?? auth?.accessToken ?? auth?.user?.token ?? auth?.user?.access_token ?? null;
  const userIdNum = Number(auth?.user?.id ?? auth?.user?.uid ?? auth?.userId ?? USER_ID_FALLBACK);

  const [modalVisible, setModalVisible] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrValue, setQrValue] = useState<string>("");
  const [qrCodeText, setQrCodeText] = useState<string>("");
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [lastRawError, setLastRawError] = useState<string>("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const openedRef = useRef(false);

  const clearTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  useEffect(() => () => clearTimer(), []);

  useEffect(() => {
    if (action === "generateQR" && !openedRef.current) {
      openedRef.current = true;
      openModal();
    }
  }, [action]);

  const startCountdown = (expISO?: string, secondsFromServer?: number) => {
    clearTimer();
    let start = 0;
    if (expISO) start = Math.max(0, Math.floor((new Date(expISO).getTime() - Date.now()) / 1000));
    else if (typeof secondsFromServer === "number") start = Math.max(0, Math.floor(secondsFromServer));
    else start = 3600;
    setSecondsLeft(start);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? (clearTimer(), 0) : prev - 1));
    }, 1000);
  };

  const claimQr = async () => {
    try {
      if (!QRCodeComp) {
        Alert.alert("QR no disponible", "Instalá react-native-svg y react-native-qrcode-svg.");
        return;
      }
      setQrLoading(true);
      setQrValue(""); setQrCodeText(""); setSecondsLeft(0); setLastRawError("");

      const promoId = Number(cupon?.id);
      if (!Number.isInteger(promoId)) { Alert.alert("Cupón inválido", "ID de promoción inválido."); return; }
      if (!Number.isInteger(userIdNum)) { Alert.alert("Sesión requerida", "Falta user_id numérico."); return; }

      const url = `${API_BASE}/api/v1/promotions/${promoId}/claim-qr`;
      const payload = { user_id: userIdNum, device: `rn-${Platform.OS}` };

      let res: Response;
      try {
        res = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      } catch (netErr: any) {
        Alert.alert("Sin conexión", `${netErr?.message || "Network request failed"}`);
        return;
      }

      const ct = res.headers?.get?.("content-type") || "";
      const isJson = ct.includes("application/json");
      const raw = await res.text();
      if (!isJson) setLastRawError(raw.slice(0, 500));

      let data: any = {};
      try { data = raw ? JSON.parse(raw) : {}; } catch {}

      const hasQrVal = typeof data?.qr_value === "string" && data.qr_value.length > 0;
      const hasCode = typeof data?.code === "string" && data.code.length > 0;

      if (!res.ok || data?.status !== "ok" || !(hasQrVal || hasCode)) {
        Alert.alert("No se pudo generar el QR", isJson ? (data?.message || `HTTP ${res.status}`) : "Respuesta no-JSON");
        return;
      }

      const encodeValueRaw = String((data.qr_value ?? data.code) || "").trim();
      const encodeValue = encodeValueRaw.replace(/^http:\/\//i, "https://");
      setQrValue(encodeValue);
      if (hasCode) setQrCodeText(String(data.code));
      startCountdown(data.expires_at, data.seconds_left);
    } catch (e: any) {
      Alert.alert("No se pudo generar el QR", e?.message ?? "Error inesperado");
      setQrValue(""); setQrCodeText(""); setSecondsLeft(0);
    } finally {
      setQrLoading(false);
    }
  };

  const openModal = () => { setModalVisible(true); claimQr(); };
  const closeModal = () => { setModalVisible(false); clearTimer(); };
  const regenerate = () => { claimQr(); };

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return h > 0 ? `${h}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}` : `${m}:${s.toString().padStart(2,"0")}`;
  };
  const formatFechaCorta = (input?: string): string => {
    if (!input || input.trim() === "-") return "-";
    let d: Date | null = null;
    if (/^\d{13}$/.test(input)) d = new Date(Number(input));
    else if (/^\d{10}$/.test(input)) d = new Date(Number(input) * 1000);
    else {
      const s = input.includes("T") ? input : input.replace(" ", "T");
      const tmp = new Date(s);
      d = isNaN(tmp.getTime()) ? null : tmp;
    }
    if (!d) return input;
    const fmt = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
    return fmt.replace(/\./g, "");
  };

  if (!cupon) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 16, marginBottom: 12 }}>No recibí la promoción a mostrar.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageWithLoader uri={cupon?.imagenUrl} style={styles.image} />
      <Text style={styles.title}>{cupon?.titulo ?? "Promoción"}</Text>
      {!!cupon?.comercio && <Text style={styles.comercio}>{cupon.comercio}</Text>}
      {!!cupon?.descripcion && <Text style={styles.desc}>{cupon.descripcion}</Text>}
      <Text style={styles.valid}>Válido hasta: {formatFechaCorta(cupon?.validoHasta)}</Text>

      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>Obtener Cupón</Text>
      </TouchableOpacity>

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
                  <ErrorBoundary>
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

// ===== Imagen con loader =====
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
        onError={() => { setSrc(PLACEHOLDER); setLoading(false); }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  image: { width: "100%", height: 180, borderRadius: 10, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 4, textAlign: "center" },
  comercio: { fontSize: 15, color: "#666", marginBottom: 10, textAlign: "center" },
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
