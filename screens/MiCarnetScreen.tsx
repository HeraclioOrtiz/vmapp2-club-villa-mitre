import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Carnet from '../components/Carnet';

export default function MiCarnetScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Carnet</Text>
            <Carnet
        nombre="Juan"
        apellido="Pérez"
        dni="12345678"
        validoHasta="31/12/2025"
        fotoUrl="https://randomuser.me/api/portraits/men/1.jpg"
        codigoBarras="1234567890123456"
        escudoUrl="https://upload.wikimedia.org/wikipedia/commons/7/7d/Escudo_Villa_Mitre.png"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22 },
});
