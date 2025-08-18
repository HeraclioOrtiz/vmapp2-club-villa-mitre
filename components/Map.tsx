import React from "react";
import { Platform, View, StyleSheet } from "react-native";

let MapNative: any = null;
let Marker: any = null;

if (Platform.OS !== "web") {
  const maps = require("react-native-maps");
  MapNative = maps.default as typeof maps.default;
  Marker = maps.Marker as typeof maps.Marker;
}

let MapWeb: any = null;
let TileLayer: any = null;
let WebMarker: any = null;
if (Platform.OS === "web") {
  const leaflet = require("react-leaflet");
  MapWeb = leaflet.MapContainer;
  TileLayer = leaflet.TileLayer;
  WebMarker = leaflet.Marker;
}

type Local = {
  id: string;
  nombre: string;
  latitude: number;
  longitude: number;
};

export default function Mapa({ locales }: { locales: Local[] }) {
  if (Platform.OS === "web") {
    return (
      <div style={{ width: "100%", height: 200 }}>
        <MapWeb center={[-38.7196, -62.2658]} zoom={15} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locales.map((l) => (
            <WebMarker key={l.id} position={[l.latitude, l.longitude]} />
          ))}
        </MapWeb>
      </div>
    );
  }

  return (
    <MapNative
      style={styles.map}
      initialRegion={{
        latitude: -38.7196,
        longitude: -62.2658,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {locales.map((l) => (
        <Marker key={l.id} coordinate={{ latitude: l.latitude, longitude: l.longitude }} title={l.nombre} />
      ))}
    </MapNative>
  );
}

const styles = StyleSheet.create({
  map: { width: "100%", height: 200, borderRadius: 10, marginBottom: 20 },
});
