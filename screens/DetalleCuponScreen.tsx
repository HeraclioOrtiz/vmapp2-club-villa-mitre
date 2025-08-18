import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, ActivityIndicator, Platform } from "react-native";
import QRCode from "react-native-qrcode-svg";

// --- Import multiplataforma de mapas ---
let MapView: any = null;
let Marker: any = null;
let MapWeb: any = null;
let TileLayer: any = null;
let WebMarker: any = null;

if (Platform.OS !== "web") {
  const maps = require("react-native-maps");
  MapView = maps.default;
  Marker = maps.Marker;
} else {
  const leaflet = require("react-leaflet");
  MapWeb = leaflet.MapContainer;
  TileLayer = leaflet.TileLayer;
  WebMarker = leaflet.Marker;
}

// Ejemplo de locales
const locales = [
  { id: '1', nombre: 'Restaurante Villa Mitre', latitude: -38.7196, longitude: -62.2658 },
  { id: '2', nombre: 'Odontología Club', latitude: -38.7200, longitude: -62.2600 },
];

export default function DetalleCuponScreen({ route }: any) {
  const { cupon } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const ImageWithLoader: React.FC<{ uri: string; style: any }> = ({ uri, style }) => {
    const [loading, setLoading] = useState(true);
    return (
      <View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
        {loading && <ActivityIndicator size="small" color="#4CAF50" style={{ position: 'absolute' }} />}
        <Image source={{ uri }} style={style} onLoadEnd={() => setLoading(false)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageWithLoader uri={cupon.imagenUrl} style={styles.image} />

      <Text style={styles.title}>{cupon.titulo}</Text>
      <Text style={styles.desc}>{cupon.descripcion}</Text>
      <Text style={styles.valid}>Válido hasta: {cupon.validoHasta}</Text>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Obtener Cupón</Text>
      </TouchableOpacity>

      <Text style={styles.mapTitle}>Locales donde canjear</Text>

      {Platform.OS === "web" && MapWeb ? (
        <div style={{ width: "100%", height: 200, marginBottom: 20 }}>
          <MapWeb center={[-38.7196, -62.2658]} zoom={15} style={{ width: "100%", height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locales.map(local => (
              <WebMarker key={local.id} position={[local.latitude, local.longitude]} />
            ))}
          </MapWeb>
        </div>
      ) : (
        MapView && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -38.7196,
              longitude: -62.2658,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {locales.map(local => (
              <Marker
                key={local.id}
                coordinate={{ latitude: local.latitude, longitude: local.longitude }}
                title={local.nombre}
              />
            ))}
          </MapView>
        )
      )}

      {/* Modal con QR */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tu Cupón</Text>
            <QRCode value={`CUPON-${cupon.id}`} size={200} />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  image: { width: "100%", height: 180, borderRadius: 10, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  desc: { fontSize: 16, textAlign: "center", marginBottom: 10 },
  valid: { fontSize: 14, color: "#888", marginBottom: 20 },
  button: { backgroundColor: "#4CAF50", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, marginBottom: 20 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  mapTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  map: { width: "100%", height: 200, borderRadius: 10, marginBottom: 20 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  modalContent: { width: 300, backgroundColor: "#fff", padding: 20, borderRadius: 15, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  closeButton: { marginTop: 20, backgroundColor: "#f44336", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
});
