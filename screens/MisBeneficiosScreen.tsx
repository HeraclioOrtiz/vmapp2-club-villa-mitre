import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';

type Area = {
  id: string;
  titulo: string;
  detalle: string;
  contacto?: string;
  imagenUrl: string;
};

const areas: Area[] = [
  { id: '1', titulo: 'Área de Cultura', detalle: 'Talleres, festivales, espectáculos, reseñas y convocatorias culturales.', contacto: 'Cultura 2915348520', imagenUrl: 'https://picsum.photos/id/1031/600/300' },
  { id: '2', titulo: 'Área Social', detalle: 'Campañas de salud, colectas, capacitaciones y cursos con salida laboral.', imagenUrl: 'https://picsum.photos/id/1032/600/300' },
  { id: '3', titulo: 'Área de Género y Diversidad', detalle: 'Capacitaciones y actividades sobre derechos de mujeres y disidencias sexuales.', imagenUrl: 'https://picsum.photos/id/1033/600/300' },
  { id: '4', titulo: 'Jardín de Infantes y Maternal La Ciudad', detalle: 'Desde los 18 meses.', contacto: '2915081186', imagenUrl: 'https://picsum.photos/id/1034/600/300' },
  { id: '5', titulo: 'Mutual 14 de agosto', detalle: 'Prestaciones médicas y profesionales de la salud.', contacto: '2914481924', imagenUrl: 'https://picsum.photos/id/1035/600/300' },
  { id: '6', titulo: 'Villa Mitre Viajes', detalle: 'Agencia de turismo.', contacto: '2914642424', imagenUrl: 'https://picsum.photos/id/1036/600/300' },
  { id: '7', titulo: 'Tienda Oficial', detalle: 'Indumentaria, accesorios, librería y bazar.', contacto: '2915767712', imagenUrl: 'https://picsum.photos/id/1037/600/300' },
];

export default function MisBeneficiosScreen() {
  const screenWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {areas.map(area => (
        <View key={area.id} style={[styles.card, { width: screenWidth * 0.9 }]}>
          <Image
            source={{ uri: area.imagenUrl }}
            style={styles.image}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
          {loading && <ActivityIndicator size="large" color="#006400" style={styles.loader} />}
          <View style={styles.info}>
            <Text style={styles.title}>{area.titulo}</Text>
            <Text style={styles.detail}>{area.detalle}</Text>
            {area.contacto && <Text style={styles.contact}>{area.contacto}</Text>}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingVertical: 10 },
  contentContainer: { alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
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
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  detail: { fontSize: 15, color: '#444' },
  contact: { fontSize: 14, color: '#666', marginTop: 4 },
});
