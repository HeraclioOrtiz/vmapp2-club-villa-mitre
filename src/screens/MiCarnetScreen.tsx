// screens/MiCarnetScreen.tsx
import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import CarnetFit from '../components/Carnet';
import { useAuth } from '../hooks/useAuth';

export default function MiCarnetScreen() {
  const { width, height } = useWindowDimensions();
  const { user } = useAuth();

  // ========================================
  // 📸 IMPLEMENTACIÓN DE FOTO DE SOCIO
  // ========================================
  // La foto del socio se obtiene desde el servidor del club
  // URL: https://clubvillamitre.com/images/socios/{SOCIO_N}.jpg
  // 
  // IMPORTANTE: Usa el campo socio_n (número de socio real del club)
  // NO usar user.id (es el ID de la base de datos, no el número de socio)
  // Si el servidor no tiene la imagen, se mostrará una imagen de placeholder.
  // 
  // TODO FUTURO: 
  // - Implementar validación de existencia de imagen
  // - Agregar formato de imagen alternativo (.png, .jpeg)
  // - Implementar cache local de imágenes
  // ========================================
  
  const getUserPhotoUrl = () => {
    // Usar socio_n para construir la URL de la foto
    const socioNumero = user?.socio_n || user?.nroSocio;
    
    if (!socioNumero) {
      // Si no hay socio_n, usar placeholder
      console.warn('⚠️ CarnetScreen: No socio_n found for user');
      return "https://randomuser.me/api/portraits/men/1.jpg";
    }
    
    // Construir URL de foto desde servidor del club usando socio_n
    const photoUrl = `https://clubvillamitre.com/images/socios/${socioNumero}.jpg`;
    
    return photoUrl;
  };

  const fotoUrl = getUserPhotoUrl();

  // Debug: Log user data and photo URL
  if (__DEV__) {
    console.log('🎫 CarnetScreen: User data:', JSON.stringify(user, null, 2));
    console.log('📸 CarnetScreen: Socio N (socio_n):', user?.socio_n);
    console.log('📸 CarnetScreen: Fallback (nroSocio):', user?.nroSocio);
    console.log('🌐 CarnetScreen: Photo URL constructed:', fotoUrl);
  }
  
  // Usamos safe-area, pero sin márgenes extra para que ocupe TODO
  return (
    <SafeAreaView style={styles.safe} edges={['top','bottom','left','right']}>
      <View style={styles.fill}>
        <CarnetFit
          nombre={user?.name?.split(' ')[0] || "SOCIO"}
          apellido={user?.name?.split(' ').slice(1).join(' ') || "CLUB"}
          dni={user?.dni || "00.000.000"}
          nroSocio={user?.socio_n || user?.nroSocio || "0000"}
          validoHasta="31/12/2025"
          fotoUrl={fotoUrl}
          codigoBarras={user?.codigoBarras}
          maxWidth={width}
          maxHeight={height}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.PRIMARY_GREEN },
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
