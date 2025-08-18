import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';

type CarnetProps = {
  nombre: string;
  apellido: string;
  dni: string;
  fotoUrl: string;
  validoHasta: string;
  codigoBarras?: string;
  escudoUrl?: string; // Aquí va el logo del club Villa Mitre
};

type QRCodeComponentProps = {
  value: string;
  size: number;
};

// QR universal: API para web, placeholder para móvil
const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ value, size }) => {
  if (Platform.OS === 'web') {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
    return <Image source={{ uri: qrUrl }} style={{ width: size, height: size }} />;
  } else {
    return (
      <View style={{
        width: size,
        height: size,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
      }}>
        <Text style={{ color: 'white', fontSize: 14 }}>QR</Text>
      </View>
    );
  }
};

const Carnet: React.FC<CarnetProps> = ({
  nombre,
  apellido,
  dni,
  fotoUrl,
  validoHasta,
  codigoBarras,
  escudoUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Escudo_Villa_Mitre.png', // Logo Villa Mitre por defecto
}) => {
  return (
    <View style={styles.carnet}>
      {/* Cabecera: Escudo + Foto + Datos */}
      <View style={styles.header}>
        <Image source={{ uri: escudoUrl }} style={styles.escudo} />
        <View style={styles.info}>
          <Text style={styles.nombre}>{`${nombre} ${apellido}`}</Text>
          <Text style={styles.dni}>DNI: {dni}</Text>
          <Text style={styles.valido}>Válido hasta: {validoHasta}</Text>
        </View>
        <Image source={{ uri: fotoUrl }} style={styles.foto} />
      </View>

      {/* Pie: QR + Código de barras */}
      <View style={styles.footer}>
        <QRCodeComponent value={`DNI: ${dni}`} size={90} />
        {codigoBarras && (
          <View style={styles.codigoBarras}>
            <Text style={styles.barraText}>{codigoBarras}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carnet: {
    width: 380,
    height: 220,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
    backgroundColor: '#006400', // Fondo verde Villa Mitre
    borderWidth: 2,
    borderColor: '#004400',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  escudo: { width: 60, height: 60 },
  foto: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#fff' },
  info: { flex: 1, marginHorizontal: 15 },
  nombre: { fontSize: 22, color: '#fff', fontWeight: 'bold' },
  dni: { fontSize: 18, color: '#fff', marginTop: 4 },
  valido: { fontSize: 16, color: '#fff', marginTop: 2 },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 10
  },
  codigoBarras: {
    width: 180,
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  barraText: { fontSize: 20, letterSpacing: 2, fontWeight: 'bold' },
});

export default Carnet;
