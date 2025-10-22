import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { COLORS } from '../constants/colors';
import { FloatingChatBot } from '../components/FloatingChatBot';

type Beneficio = {
  id: string;
  comercio: string;
  descuento: string;
  categoria: string;
  direccion?: string;
  telefono?: string;
  imagenUrl: string;
};

type RouteParams = { beneficio: Beneficio };

const API_BASE = 'https://surtekbb.com';
const USER_ID = 'USER_ID_REAL_O_TOMAR_DE_AUTH';

export default function QRBeneficioScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { beneficio } = route.params as RouteParams;

  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [qrValue, setQrValue] = useState<string>('');
  const [isQrReady, setIsQrReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ en RN: ReturnType<typeof setInterval> (no NodeJS.Timer)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startCountdown = (expiresAtISO?: string, secondsLeft?: number) => {
    clearTick();
    let target = 0;
    if (expiresAtISO) {
      target = Math.max(0, Math.floor((new Date(expiresAtISO).getTime() - Date.now()) / 1000));
    } else if (typeof secondsLeft === 'number') {
      target = Math.max(0, secondsLeft);
    } else {
      target = 3600;
    }
    setTimeRemaining(target);

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearTick();
          Alert.alert(
            'QR Expirado',
            'Este código QR ha expirado. Podés generar uno nuevo.',
            [
              { text: 'Generar Nuevo', onPress: () => claimQr() },
              { text: 'Volver', onPress: () => navigation.goBack() },
            ]
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const claimQr = async () => {
    try {
      setLoading(true);
      setIsQrReady(false);

      const res = await fetch(`${API_BASE}/api/v1/promotions/${beneficio.id}/claim-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: USER_ID,
          device: 'rn-app-android',
        }),
      });

      const data = await res.json();
      if (!res.ok || data.status !== 'ok') {
        Alert.alert('Error', data?.message || 'No se pudo reclamar el QR');
        setLoading(false);
        return;
      }

      setQrValue(String(data.qr_value)); // URL de canje o code según server
      setIsQrReady(true);
      startCountdown(data.expires_at, data.seconds_left);
    } catch (e: any) {
      Alert.alert('Error de red', e?.message ?? 'No fue posible conectar al servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    claimQr();
    return () => clearTick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beneficio.id]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleGoBack = () => navigation.goBack();

  const screenWidth = Dimensions.get('window').width;
  const qrSize = Math.min(screenWidth * 0.7, 280);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Código QR</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Beneficio Info */}
        <View style={styles.beneficioInfo}>
          <View style={styles.categoriaTag}>
            <Text style={styles.categoriaText}>{beneficio.categoria}</Text>
          </View>
          <Text style={styles.comercioName}>{beneficio.comercio}</Text>
          <Text style={styles.descuentoText}>{beneficio.descuento}</Text>
        </View>

        {/* QR */}
        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            {loading ? (
              <View style={[styles.qrPlaceholder, { width: qrSize, height: qrSize }]}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY_GREEN} />
                <Text style={styles.loadingText}>Contactando al servidor...</Text>
              </View>
            ) : isQrReady && qrValue ? (
              <View style={styles.qrWithLogo}>
                <QRCode value={qrValue} size={qrSize} color={COLORS.PRIMARY_BLACK} backgroundColor={COLORS.WHITE} />
                <View
                  style={[
                    styles.logoOverlay,
                    {
                      width: qrSize * 0.12,
                      height: qrSize * 0.12,
                      top: (qrSize - qrSize * 0.12) / 2,
                      left: (qrSize - qrSize * 0.12) / 2,
                    },
                  ]}
                >
                  <Image source={require('../../assets/cvm-escudo-para-fondo-blanco.png')} style={styles.logoImage} resizeMode="contain" />
                </View>
              </View>
            ) : (
              <View style={[styles.qrPlaceholder, { width: qrSize, height: qrSize }]}>
                <Ionicons name="warning-outline" size={22} color={COLORS.WARNING} />
                <Text style={styles.loadingText}>No se pudo generar el QR</Text>
                <TouchableOpacity style={{ marginTop: 10 }} onPress={claimQr}>
                  <Text style={{ color: COLORS.PRIMARY_GREEN, fontWeight: 'bold' }}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Timer */}
          <View style={styles.timerContainer}>
            <View style={styles.timerIcon}>
              <Ionicons name="time-outline" size={20} color={COLORS.PRIMARY_GREEN} />
            </View>
            <Text style={styles.timerText}>
              Válido por: <Text style={styles.timerValue}>{formatTime(timeRemaining)}</Text>
            </Text>
            <TouchableOpacity onPress={claimQr} style={{ marginLeft: 12 }}>
              <Text style={{ color: COLORS.PRIMARY_GREEN, fontWeight: 'bold' }}>Generar nuevo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>Mostrá este código QR al personal del comercio</Text>
          </View>

          <View style={styles.instructionRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>El descuento se aplicará automáticamente</Text>
          </View>

          <View style={styles.instructionRow}>
            {/* ❌ className -> ✅ style */}
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>Este QR expira en 1 hora</Text>
          </View>
        </View>

        {/* Warning */}
        <View style={styles.warningContainer}>
          <Ionicons name="warning-outline" size={20} color={COLORS.WARNING} />
          <Text style={styles.warningText}>Este código QR es de uso único y expira automáticamente después de 1 hora</Text>
        </View>
      </ScrollView>

      <FloatingChatBot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND_SECONDARY },
  header: {
    backgroundColor: COLORS.PRIMARY_GREEN,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.WHITE, fontFamily: 'BarlowCondensed-Bold' },
  placeholder: { width: 40 },
  scrollContainer: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 100 },
  beneficioInfo: { alignItems: 'center', marginBottom: 30 },
  categoriaTag: { backgroundColor: COLORS.PRIMARY_GREEN, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  categoriaText: { color: COLORS.WHITE, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  comercioName: { fontSize: 24, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY, textAlign: 'center', marginBottom: 8, fontFamily: 'BarlowCondensed-Bold' },
  descuentoText: { fontSize: 16, color: COLORS.TEXT_SECONDARY, textAlign: 'center', lineHeight: 22 },
  qrContainer: { alignItems: 'center', marginBottom: 30 },
  qrWrapper: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
    borderRadius: 20,
    shadowColor: COLORS.PRIMARY_BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: COLORS.PRIMARY_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerIcon: { marginRight: 8 },
  timerText: { fontSize: 14, color: COLORS.TEXT_SECONDARY },
  timerValue: { fontWeight: 'bold', color: COLORS.PRIMARY_GREEN, fontFamily: 'BarlowCondensed-Bold' },
  instructionsContainer: { marginBottom: 20 },
  instructionRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.PRIMARY_GREEN, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stepNumberText: { color: COLORS.WHITE, fontSize: 14, fontWeight: 'bold' },
  instructionText: { flex: 1, fontSize: 14, color: COLORS.TEXT_PRIMARY, lineHeight: 20 },
  warningContainer: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF3CD', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: COLORS.WARNING },
  warningText: { flex: 1, fontSize: 13, color: '#856404', marginLeft: 12, lineHeight: 18 },
  qrPlaceholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.WHITE },
  loadingText: { fontSize: 14, color: COLORS.TEXT_SECONDARY, marginTop: 12, textAlign: 'center' },
  qrWithLogo: { position: 'relative' },
  logoOverlay: { position: 'absolute', backgroundColor: COLORS.WHITE, borderRadius: 8, justifyContent: 'center', alignItems: 'center', padding: 2 },
  logoImage: { width: '100%', height: '100%' },
});
