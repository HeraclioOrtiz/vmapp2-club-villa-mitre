import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';

type Actividad = {
  id: string;
  icono: string;
  titulo: string;
  detalle: string;
  contacto: string;
  imagenUrl: string;
};

const actividades: Actividad[] = [
  { id: '1', icono: '🥋', titulo: 'Karate', detalle: '+7 años (mixto)', contacto: 'Néstor 2915272778', imagenUrl: 'https://picsum.photos/id/1011/600/300' },
  { id: '2', icono: '🤸', titulo: 'Gimnasia Artística', detalle: '+3 años (mixto)', contacto: 'IG: @gimnasiaartisticacvmbb', imagenUrl: 'https://picsum.photos/id/1012/600/300' },
  { id: '3', icono: '⛸️', titulo: 'Patín', detalle: '+3 años (mixto)', contacto: 'Lorena Carinelli 2914370612', imagenUrl: 'https://picsum.photos/id/1013/600/300' },
  { id: '4', icono: '🏐', titulo: 'Vóley', detalle: '+6 años (mixto)', contacto: 'IG: @villa_mitre_voley', imagenUrl: 'https://picsum.photos/id/1014/600/300' },
  { id: '5', icono: '🏐', titulo: 'Newcom', detalle: '+40 años (mixto)', contacto: 'Patricia Botte 2915704254', imagenUrl: 'https://picsum.photos/id/1015/600/300' },
  { id: '6', icono: '🤾', titulo: 'Handball', detalle: '6 a 13 años', contacto: 'Joana Jant 2915669907', imagenUrl: 'https://picsum.photos/id/1016/600/300' },
  { id: '7', icono: '🏑', titulo: 'Hockey', detalle: '+6 años (mixto)', contacto: 'Sergio Nasso 2915754040', imagenUrl: 'https://picsum.photos/id/1018/600/300' },
  { id: '8', icono: '🏒', titulo: 'Hockey sobre Patines', detalle: '+5 años (mixto)', contacto: 'Guillermo 2915064363', imagenUrl: 'https://picsum.photos/id/1019/600/300' },
  { id: '9', icono: '🥊', titulo: 'Boxeo', detalle: '+7 años (mixto)', contacto: 'Gonzalo Flores 2914480251', imagenUrl: 'https://picsum.photos/id/1020/600/300' },
  { id: '10', icono: '🏀', titulo: 'Básquet Femenino', detalle: '3 a 12 años', contacto: 'Alejandra 2914133548', imagenUrl: 'https://picsum.photos/id/1021/600/300' },
  { id: '11', icono: '🏀', titulo: 'Básquet Masculino', detalle: '+3 años', contacto: 'Silvio Montero 2915748545', imagenUrl: 'https://picsum.photos/id/1022/600/300' },
  { id: '12', icono: '⚽', titulo: 'Futsal', detalle: '+16 años (masculino)', contacto: 'Sergio Vallejos 2914622376', imagenUrl: 'https://picsum.photos/id/1023/600/300' },
  { id: '13', icono: '⚽', titulo: 'Fútbol Masculino', detalle: '+5 años', contacto: 'Matias Basualdo 2914737900', imagenUrl: 'https://picsum.photos/id/1024/600/300' },
  { id: '14', icono: '⚽', titulo: 'Fútbol Femenino', detalle: '+6 años', contacto: 'Lorena Bidal 2915741716', imagenUrl: 'https://picsum.photos/id/1025/600/300' },
  { id: '15', icono: '🏊', titulo: 'Natación', detalle: '+90 días (mixto)', contacto: 'Centro Deportivo 2914439070', imagenUrl: 'https://picsum.photos/id/1026/600/300' },
  { id: '16', icono: '💃', titulo: 'Zumba', detalle: '+14/15 años (mixto)', contacto: 'Romina Rodríguez 2914220575', imagenUrl: 'https://picsum.photos/id/1027/600/300' },
];

export default function MisActividadesScreen() {
  const screenWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {actividades.map(act => (
        <View key={act.id} style={[styles.card, { width: screenWidth * 0.9 }]}>
          <Image
            source={{ uri: act.imagenUrl }}
            style={styles.image}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
          {loading && <ActivityIndicator size="large" color="#006400" style={styles.loader} />}
          <View style={styles.info}>
            <Text style={styles.title}>{act.icono} {act.titulo}</Text>
            <Text style={styles.detail}>{act.detalle}</Text>
            <Text style={styles.contact}>{act.contacto}</Text>
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
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  detail: { fontSize: 15, color: '#444' },
  contact: { fontSize: 14, color: '#666', marginTop: 4 },
});
