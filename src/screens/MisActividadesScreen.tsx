import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, ActivityIndicator, Alert } from 'react-native';
import { useActividades } from '../hooks/useActividades';
import { COLORS } from '../utils/constants';

export default function MisActividadesScreen() {
  const screenWidth = Dimensions.get('window').width;
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});
  const { actividades, loading, error, clearActividadesError } = useActividades();

  // Show error if exists
  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearActividadesError }
      ]);
    }
  }, [error, clearActividadesError]);

  const handleImageLoadStart = (id: string) => {
    setImageLoading(prev => ({ ...prev, [id]: true }));
  };

  const handleImageLoadEnd = (id: string) => {
    setImageLoading(prev => ({ ...prev, [id]: false }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Cargando actividades...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {actividades.map(act => (
        <View key={act.id} style={[styles.card, { width: screenWidth * 0.9 }]}>
          <Image
            source={{ uri: act.imagenUrl }}
            style={styles.image}
            onLoadStart={() => handleImageLoadStart(act.id)}
            onLoadEnd={() => handleImageLoadEnd(act.id)}
          />
          {imageLoading[act.id] && (
            <ActivityIndicator size="large" color={COLORS.PRIMARY} style={styles.loader} />
          )}
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
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND, paddingVertical: 10 },
  contentContainer: { alignItems: 'center' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.GRAY,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    marginVertical: 10,
    overflow: 'hidden',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: { width: '100%', height: 180 },
  loader: { position: 'absolute', top: '40%', left: '45%' },
  info: { padding: 15 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: COLORS.BLACK },
  detail: { fontSize: 15, color: '#444' },
  contact: { fontSize: 14, color: COLORS.GRAY, marginTop: 4 },
});
