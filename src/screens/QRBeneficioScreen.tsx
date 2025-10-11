import React, { useState, useEffect } from 'react';
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

type RouteParams = {
  beneficio: Beneficio;
};

export default function QRBeneficioScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { beneficio } = route.params as RouteParams;
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hora en segundos
  const [qrValue, setQrValue] = useState('');
  const [isQrReady, setIsQrReady] = useState(false);

  useEffect(() => {
    // Generar valor único del QR con timestamp
    const timestamp = Date.now();
    const qrData = {
      beneficioId: beneficio.id,
      comercio: beneficio.comercio,
      descuento: beneficio.descuento,
      timestamp: timestamp,
      validUntil: timestamp + (60 * 60 * 1000), // Válido por 1 hora
      userId: 'USER_ID_PLACEHOLDER' // En producción sería el ID real del usuario
    };
    setQrValue(JSON.stringify(qrData));
    setIsQrReady(true);

    // Timer para countdown
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          Alert.alert(
            'QR Expirado',
            'Este código QR ha expirado. Genera uno nuevo para usar el beneficio.',
            [
              {
                text: 'Generar Nuevo',
                onPress: () => {
                  // Regenerar QR
                  const newTimestamp = Date.now();
                  const newQrData = {
                    beneficioId: beneficio.id,
                    comercio: beneficio.comercio,
                    descuento: beneficio.descuento,
                    timestamp: newTimestamp,
                    validUntil: newTimestamp + (60 * 60 * 1000),
                    userId: 'USER_ID_PLACEHOLDER'
                  };
                  setQrValue(JSON.stringify(newQrData));
                  setTimeRemaining(3600);
                  setIsQrReady(true);
                }
              },
              {
                text: 'Volver',
                onPress: () => navigation.goBack()
              }
            ]
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [beneficio, navigation]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

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

      {/* Content with ScrollView */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Beneficio Info */}
        <View style={styles.beneficioInfo}>
          <View style={styles.categoriaTag}>
            <Text style={styles.categoriaText}>{beneficio.categoria}</Text>
          </View>
          <Text style={styles.comercioName}>{beneficio.comercio}</Text>
          <Text style={styles.descuentoText}>{beneficio.descuento}</Text>
        </View>

        {/* QR Code Container */}
        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            {isQrReady && qrValue ? (
              <View style={styles.qrWithLogo}>
                <QRCode
                  value={qrValue}
                  size={qrSize}
                  color={COLORS.PRIMARY_BLACK}
                  backgroundColor={COLORS.WHITE}
                />
                <View style={[styles.logoOverlay, { 
                  width: qrSize * 0.12, 
                  height: qrSize * 0.12,
                  top: (qrSize - qrSize * 0.12) / 2,
                  left: (qrSize - qrSize * 0.12) / 2,
                }]}>
                  <Image
                    source={require('../../assets/cvm-escudo-para-fondo-blanco.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            ) : (
              <View style={[styles.qrPlaceholder, { width: qrSize, height: qrSize }]}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY_GREEN} />
                <Text style={styles.loadingText}>Generando QR...</Text>
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
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Muestra este código QR al personal del comercio
            </Text>
          </View>
          
          <View style={styles.instructionRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              El descuento se aplicará automáticamente
            </Text>
          </View>
          
          <View style={styles.instructionRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Recuerda que este QR expira en 1 hora
            </Text>
          </View>
        </View>

        {/* Warning */}
        <View style={styles.warningContainer}>
          <Ionicons name="warning-outline" size={20} color={COLORS.WARNING} />
          <Text style={styles.warningText}>
            Este código QR es de uso único y expira automáticamente después de 1 hora
          </Text>
        </View>
      </ScrollView>

      <FloatingChatBot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  header: {
    backgroundColor: COLORS.PRIMARY_GREEN,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    fontFamily: 'BarlowCondensed-Bold',
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100, // Extra padding to avoid overlap with mobile buttons
  },
  beneficioInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  categoriaTag: {
    backgroundColor: COLORS.PRIMARY_GREEN,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  categoriaText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  comercioName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'BarlowCondensed-Bold',
  },
  descuentoText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
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
  timerIcon: {
    marginRight: 8,
  },
  timerText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  timerValue: {
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GREEN,
    fontFamily: 'BarlowCondensed-Bold',
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.PRIMARY_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 20,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.WARNING,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#856404',
    marginLeft: 12,
    lineHeight: 18,
  },
  qrPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 12,
    textAlign: 'center',
  },
  qrWithLogo: {
    position: 'relative',
  },
  logoOverlay: {
    position: 'absolute',
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});
