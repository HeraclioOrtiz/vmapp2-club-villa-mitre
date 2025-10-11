import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FloatingChatBot } from '../components/FloatingChatBot';
import { COLORS } from '../constants/colors';

type Actividad = {
  id: string;
  icono: string;
  titulo: string;
  detalle: string;
  contacto: string;
  imagenUrl: string | number; // string para URLs, number para require() local
};

// ========================================
// 🏃 ACTIVIDADES DEPORTIVAS DEL CLUB
// ========================================
// Actividades reales del Club Villa Mitre
// Fotos ubicadas en: assets/actividades/
// Actualizado: Octubre 2025
// ========================================

const actividadesDeportivas: Actividad[] = [
  { 
    id: '1', 
    icono: '🥋', 
    titulo: 'Karate', 
    detalle: '+7 años (mixto)', 
    contacto: 'Néstor 2915272778', 
    imagenUrl: require('../../assets/actividades/karate.jpg')
  },
  { 
    id: '2', 
    icono: '🤸', 
    titulo: 'Gimnasia Artística', 
    detalle: '+3 años (mixto)', 
    contacto: 'IG: @gimnasiaartisticacvmbb', 
    imagenUrl: require('../../assets/actividades/gimnasia_artistica.jpg')
  },
  { 
    id: '3', 
    icono: '⛸️', 
    titulo: 'Patín', 
    detalle: '+3 años (mixto)', 
    contacto: 'Lorena Carinelli 2914370612', 
    imagenUrl: require('../../assets/actividades/patin.jpg')
  },
  { 
    id: '4', 
    icono: '🏐', 
    titulo: 'Vóley', 
    detalle: '+6 años (mixto)', 
    contacto: 'IG: @villa_mitre_voley', 
    imagenUrl: require('../../assets/actividades/voley.jpg')
  },
  { 
    id: '5', 
    icono: '🏐', 
    titulo: 'Newcom', 
    detalle: '+40 años (mixto)', 
    contacto: 'Patricia Botte 2915704254', 
    imagenUrl: require('../../assets/actividades/voley.jpg') // Usando imagen de vóley
  },
  { 
    id: '6', 
    icono: '🤾', 
    titulo: 'Handball', 
    detalle: '6 a 13 años', 
    contacto: 'Joana Jant 2915669907', 
    imagenUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=300&fit=crop' // Placeholder
  },
  { 
    id: '7', 
    icono: '🏑', 
    titulo: 'Hockey', 
    detalle: '+6 años (mixto)', 
    contacto: 'Sergio Nasso 2915754040', 
    imagenUrl: require('../../assets/actividades/hockey_(1).jpg')
  },
  { 
    id: '8', 
    icono: '🏒', 
    titulo: 'Hockey sobre Patines', 
    detalle: '+5 años (mixto)', 
    contacto: 'Guillermo 2915064363', 
    imagenUrl: require('../../assets/actividades/hockey_sobre_patines.png')
  },
  { 
    id: '9', 
    icono: '🥊', 
    titulo: 'Boxeo', 
    detalle: '+7 años (mixto)', 
    contacto: 'Gonzalo Flores 2914480251', 
    imagenUrl: require('../../assets/actividades/boxeo.jpg')
  },
  { 
    id: '10', 
    icono: '🏀', 
    titulo: 'Básquet Femenino', 
    detalle: '3 a 12 años', 
    contacto: 'Alejandra 2914133548', 
    imagenUrl: require('../../assets/actividades/basket.jpeg')
  },
  { 
    id: '11', 
    icono: '🏀', 
    titulo: 'Básquet Masculino', 
    detalle: '+3 años', 
    contacto: 'Silvio Montero 2915748545', 
    imagenUrl: require('../../assets/actividades/basket.jpeg')
  },
  { 
    id: '12', 
    icono: '⚽', 
    titulo: 'Futsal', 
    detalle: '+16 años (masculino)', 
    contacto: 'Sergio Vallejos 2914622376', 
    imagenUrl: require('../../assets/actividades/futsal.jpg')
  },
  { 
    id: '13', 
    icono: '⚽', 
    titulo: 'Fútbol Masculino', 
    detalle: '+5 años', 
    contacto: 'Matias Basualdo 2914737900', 
    imagenUrl: require('../../assets/actividades/futbol.jpg')
  },
  { 
    id: '14', 
    icono: '⚽', 
    titulo: 'Fútbol Femenino', 
    detalle: '+6 años', 
    contacto: 'Lorena Bidal 2915741716', 
    imagenUrl: require('../../assets/actividades/futbol_femenino.jpg')
  },
  { 
    id: '15', 
    icono: '🏊', 
    titulo: 'Natación', 
    detalle: '+90 días (mixto)', 
    contacto: 'Centro Deportivo 2914439070', 
    imagenUrl: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=300&fit=crop' // Placeholder
  },
  { 
    id: '16', 
    icono: '💃', 
    titulo: 'Zumba', 
    detalle: '+14/15 años (mixto)', 
    contacto: 'Romina Rodriguez 2914220575', 
    imagenUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=300&fit=crop' // Placeholder
  },
];

export default function ActividadesScreen() {
  const screenWidth = Dimensions.get('window').width;
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});

  const handleImageLoadStart = (id: string) => {
    setImageLoading(prev => ({ ...prev, [id]: true }));
  };

  const handleImageLoadEnd = (id: string) => {
    setImageLoading(prev => ({ ...prev, [id]: false }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Actividades Deportivas</Text>
      <Text style={styles.subHeaderText}>
        Descubre todas las actividades deportivas disponibles en el club
      </Text>
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {actividadesDeportivas.map(actividad => (
          <View key={actividad.id} style={[styles.card, { width: screenWidth * 0.9 }]}>
            <Image
              source={typeof actividad.imagenUrl === 'string' 
                ? { uri: actividad.imagenUrl } 
                : actividad.imagenUrl}
              style={styles.image}
              onLoadStart={() => handleImageLoadStart(actividad.id)}
              onLoadEnd={() => handleImageLoadEnd(actividad.id)}
            />
            {imageLoading[actividad.id] && (
              <ActivityIndicator size="large" color={COLORS.PRIMARY_GREEN} style={styles.loader} />
            )}
            <View style={styles.info}>
              <Text style={styles.title}>{actividad.icono} {actividad.titulo}</Text>
              <Text style={styles.detail}>{actividad.detalle}</Text>
              <Text style={styles.contact}>📞 {actividad.contacto}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      {/* ChatBot flotante */}
      <FloatingChatBot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5'
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GREEN,
    textAlign: 'center',
    marginVertical: 20,
  },
  subHeaderText: {
    fontSize: 16,
    color: COLORS.GRAY_DARK,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  scrollContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  contentContainer: { 
    alignItems: 'center',
    paddingBottom: 30
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    marginVertical: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: { width: '100%', height: 180 },
  loader: { position: 'absolute', top: '40%', left: '45%' },
  info: { padding: 15 },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 4, 
    color: COLORS.PRIMARY_BLACK 
  },
  detail: { 
    fontSize: 15, 
    color: '#444',
    marginBottom: 6
  },
  contact: { 
    fontSize: 14, 
    color: COLORS.GRAY_MEDIUM,
    fontWeight: '500'
  },
});
