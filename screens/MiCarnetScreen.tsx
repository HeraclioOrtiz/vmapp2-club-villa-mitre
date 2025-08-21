// screens/MiCarnetScreen.tsx
import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CarnetFit from '../components/Carnet';

export default function MiCarnetScreen() {
  const { width, height } = useWindowDimensions();
  // Usamos safe-area, pero sin márgenes extra para que ocupe TODO
  return (
    <SafeAreaView style={styles.safe} edges={['top','bottom','left','right']}>
      <View style={styles.fill}>
        <CarnetFit
          nombre="Juan"
          apellido="Pérez"
          dni="12345678"
          validoHasta="31/12/2025"
          fotoUrl="https://randomuser.me/api/portraits/men/1.jpg"
          maxWidth={width}
          maxHeight={height}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0E4D1B' },
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
