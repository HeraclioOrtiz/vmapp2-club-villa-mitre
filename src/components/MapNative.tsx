import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type Local = {
  id: string;
  nombre: string;
  latitude: number;
  longitude: number;
};

interface MapProps {
  locales: Local[];
}

export default function MapNative({ locales }: MapProps) {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: -38.7196,
        longitude: -62.2658,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {locales.map((l) => (
        <Marker
          key={l.id}
          coordinate={{ latitude: l.latitude, longitude: l.longitude }}
          title={l.nombre}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', height: 200, borderRadius: 10, marginBottom: 20 },
});
