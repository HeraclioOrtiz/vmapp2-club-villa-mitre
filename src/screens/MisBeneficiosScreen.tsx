import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
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

const beneficios: Beneficio[] = [
  { 
    id: '1', 
    comercio: 'Farmacia Central', 
    descuento: '15% en medicamentos', 
    categoria: 'Salud',
    direccion: 'Av. San Martín 123',
    telefono: '291-456-7890',
    imagenUrl: 'https://picsum.photos/id/1041/600/300' 
  },
  { 
    id: '2', 
    comercio: 'Supermercado Norte', 
    descuento: '10% en compras superiores a $5000', 
    categoria: 'Alimentación',
    direccion: 'Calle Mitre 456',
    telefono: '291-123-4567',
    imagenUrl: 'https://picsum.photos/id/1042/600/300' 
  },
  { 
    id: '3', 
    comercio: 'Óptica Visión', 
    descuento: '20% en anteojos y lentes de contacto', 
    categoria: 'Salud',
    direccion: 'Av. Alem 789',
    telefono: '291-987-6543',
    imagenUrl: 'https://picsum.photos/id/1043/600/300' 
  },
  { 
    id: '4', 
    comercio: 'Restaurante El Asador', 
    descuento: '15% en cenas (no válido fines de semana)', 
    categoria: 'Gastronomía',
    direccion: 'Calle Belgrano 321',
    telefono: '291-555-0123',
    imagenUrl: 'https://picsum.photos/id/1044/600/300' 
  },
  { 
    id: '5', 
    comercio: 'Librería Cultura', 
    descuento: '12% en libros y material escolar', 
    categoria: 'Educación',
    direccion: 'Av. Rivadavia 654',
    telefono: '291-444-5678',
    imagenUrl: 'https://picsum.photos/id/1045/600/300' 
  },
  { 
    id: '6', 
    comercio: 'Gimnasio Fitness Plus', 
    descuento: '25% en cuotas mensuales', 
    categoria: 'Deportes',
    direccion: 'Calle Sarmiento 987',
    telefono: '291-333-9876',
    imagenUrl: 'https://picsum.photos/id/1046/600/300' 
  },
  { 
    id: '7', 
    comercio: 'Peluquería Estilo', 
    descuento: '20% en cortes y tratamientos', 
    categoria: 'Belleza',
    direccion: 'Av. Independencia 147',
    telefono: '291-222-3456',
    imagenUrl: 'https://picsum.photos/id/1047/600/300' 
  },
];

export default function MisBeneficiosScreen() {
  const screenWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();

  const handleGenerarQR = (beneficio: Beneficio) => {
    // @ts-ignore - Navegación a pantalla QR
    navigation.navigate('QRBeneficio', { beneficio });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.headerText}>Red de Beneficios</Text>
        <Text style={styles.subHeaderText}>
          Descuentos exclusivos para socios del Club Villa Mitre
        </Text>
        
        {beneficios.map(beneficio => (
          <View key={beneficio.id} style={[styles.card, { width: screenWidth * 0.9 }]}>
            <Image
              source={{ uri: beneficio.imagenUrl }}
              style={styles.image}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
            {loading && <ActivityIndicator size="large" color={COLORS.PRIMARY_GREEN} style={styles.loader} />}
            
            <View style={styles.info}>
              <View style={styles.headerInfo}>
                <Text style={styles.comercio}>{beneficio.comercio}</Text>
                <View style={styles.categoriaContainer}>
                  <Text style={styles.categoria}>{beneficio.categoria}</Text>
                </View>
              </View>
              
              <Text style={styles.descuento}>{beneficio.descuento}</Text>
              
              {beneficio.direccion && (
                <View style={styles.contactRow}>
                  <Ionicons name="location-outline" size={16} color={COLORS.GRAY_MEDIUM} />
                  <Text style={styles.direccion}>{beneficio.direccion}</Text>
                </View>
              )}
              
              {beneficio.telefono && (
                <View style={styles.contactRow}>
                  <Ionicons name="call-outline" size={16} color={COLORS.GRAY_MEDIUM} />
                  <Text style={styles.telefono}>{beneficio.telefono}</Text>
                </View>
              )}
              
              {/* Solo mostrar botón QR para usuarios API (socios) */}
              {user?.user_type === 'api' && (
                <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => handleGenerarQR(beneficio)}
                  activeOpacity={0.8}
                >
                  <View style={styles.qrButtonContent}>
                    <Ionicons name="qr-code-outline" size={24} color={COLORS.WHITE} />
                    <Text style={styles.qrButtonText}>Generar QR</Text>
                  </View>
                  <View style={styles.qrButtonGlow} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
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
  image: { 
    width: '100%', 
    height: 200,
  },
  loader: { 
    position: 'absolute', 
    top: '40%', 
    left: '45%',
  },
  info: { 
    padding: 20,
  },
  headerInfo: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  comercio: { 
    fontSize: 20, 
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    marginRight: 12,
    fontFamily: 'BarlowCondensed-Bold',
  },
  categoriaContainer: {
    backgroundColor: COLORS.PRIMARY_GREEN,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoria: { 
    fontSize: 12, 
    color: COLORS.WHITE,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  descuento: { 
    fontSize: 16, 
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  direccion: { 
    fontSize: 14, 
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 8,
    flex: 1,
  },
  telefono: { 
    fontSize: 14, 
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 8,
    flex: 1,
  },
  qrButton: {
    backgroundColor: COLORS.PRIMARY_GREEN,
    borderRadius: 16,
    marginTop: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  qrButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  qrButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'BarlowCondensed-Bold',
  },
  qrButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0,
  },
});
