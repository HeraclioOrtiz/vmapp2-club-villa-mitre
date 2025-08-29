// components/CarnetFit.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type Props = {
  nombre: string;
  apellido: string;
  dni: string;
  fotoUrl: string;
  validoHasta: string;
  codigoBarras?: string;
  maxWidth: number;
  maxHeight: number;
};

const qrUrl = (value: string, size: number) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;

const barcodeUrl = (value: string, scale = 3, height = 12) =>
  `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(
    value
  )}&scale=${scale}&height=${height}&includetext&textxalign=center&backgroundcolor=ffffff`;

const DESIGN_W = 540;
const DESIGN_H = 860;
const QR_SIZE = 220;
const GAP = 12;

export default function CarnetFit({
  nombre,
  apellido,
  dni,
  fotoUrl,
  validoHasta,
  codigoBarras,
  maxWidth,
  maxHeight,
}: Props) {
  if (!(maxWidth > 0 && maxHeight > 0)) return null;

  const isLandscape = maxWidth > maxHeight;
  const barcodeVal = (codigoBarras || dni).trim();

  // --- MODO PORTRAIT (vertical sin rotar): "fit" completo ---
  if (!isLandscape) {
    const scale = Math.min(maxWidth / DESIGN_W, maxHeight / DESIGN_H);
    return (
      <View style={[styles.outer, { width: DESIGN_W * scale, height: DESIGN_H * scale }]}>
        <View style={[styles.cardShadow, { width: DESIGN_W, height: DESIGN_H, transform: [{ scale }] }]}>
          <CardInner
            nombre={nombre}
            apellido={apellido}
            dni={dni}
            fotoUrl={fotoUrl}
            validoHasta={validoHasta}
            barcodeVal={barcodeVal}
          />
        </View>
      </View>
    );
  }

  // --- MODO LANDSCAPE: rota SOLO el carnet 90° para USAR TODA LA PANTALLA ---
  // Escala para encajar (tras rotar, el bounding del carnet es DESIGN_H x DESIGN_W)
  const scale = Math.min(maxWidth / DESIGN_H, maxHeight / DESIGN_W);

  return (
    <View style={[styles.outer, { width: DESIGN_H * scale, height: DESIGN_W * scale }]}>
      {/* Lienzo que coincide con el tamaño del carnet una vez rotado */}
      <View style={[styles.rotator, { width: DESIGN_H, height: DESIGN_W, transform: [{ scale }] }]}>
        {/* La tarjeta real (vertical) rota 90° */}
        <View style={{ width: DESIGN_W, height: DESIGN_H, transform: [{ rotate: '90deg' }] }}>
          <View style={[styles.cardShadow, { width: DESIGN_W, height: DESIGN_H }]}>
            <CardInner
              nombre={nombre}
              apellido={apellido}
              dni={dni}
              fotoUrl={fotoUrl}
              validoHasta={validoHasta}
              barcodeVal={barcodeVal}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

/* ----- UI interna de la tarjeta (vertical de diseño) ----- */
function CardInner({
  nombre, apellido, dni, fotoUrl, validoHasta, barcodeVal,
}: { nombre: string; apellido: string; dni: string; fotoUrl: string; validoHasta: string; barcodeVal: string; }) {
  return (
    <View style={styles.card}>
      {/* Barra de marca con logo local */}
      <View style={styles.brandBar}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.brandLogo}
          resizeMode="contain"
        />
        <Text style={styles.brandText}>CLUB VILLA MITRE</Text>
      </View>

      {/* Foto + datos */}
      <View style={styles.row}>
        <Image source={{ uri: fotoUrl }} style={styles.photo} resizeMode="cover" />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{nombre} {apellido}</Text>
          <Text style={styles.dni}>DNI: {dni}</Text>
          <Text style={styles.valid}>Válido hasta: {validoHasta}</Text>
        </View>
      </View>

      {/* Fila inferior: QR izquierda + Código de barras derecha, misma altura */}
      <View style={styles.bottomRow}>
        <View style={[styles.qrBox, { width: QR_SIZE, height: QR_SIZE }]}>
          <Image
            source={{ uri: qrUrl(`DNI:${dni} | ${nombre} ${apellido}`, QR_SIZE) }}
            style={styles.qrImg}
            resizeMode="contain"
            accessibilityLabel="QR del socio"
          />
          <View style={styles.qrCaptionWrap}>
            <Text style={styles.qrCaption}>Escanear</Text>
          </View>
        </View>

        <View style={styles.barcodeSide}>
          <View style={[styles.barcodeBox, { height: QR_SIZE }]}>
            <Image
              source={{ uri: barcodeUrl(barcodeVal, 3, 12) }}
              style={styles.barcodeImg}
              resizeMode="contain"
              accessibilityLabel="Código de barras"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

/* ----- Estilos ----- */
const GREEN = '#136F29';
const BORDER = '#E6EBE8';

const styles = StyleSheet.create({
  outer: { alignItems: 'center', justifyContent: 'center' },

  rotator: { alignItems: 'center', justifyContent: 'center' },

  cardShadow: {
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 14,
    borderRadius: 22,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },

  brandBar: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  brandLogo: { width: 44, height: 44, marginRight: 10 },
  brandText: { color: '#E9F6EC', fontWeight: '900', letterSpacing: 1, fontSize: 16 },

  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  photo: {
    width: 180, height: 220, borderRadius: 14,
    borderColor: '#FFFFFF', borderWidth: 3, backgroundColor: '#123',
  },
  info: { flex: 1, marginLeft: 14 },
  name: { color: '#101418', fontSize: 26, fontWeight: '900' },
  dni: { marginTop: 6, color: '#2A2F35', fontSize: 16 },
  valid: { marginTop: 2, color: '#55606B', fontSize: 14 },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: GAP,
  },
  qrBox: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F8FAF8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  qrImg: { width: '100%', height: '100%' },
  qrCaptionWrap: {
    position: 'absolute',
    bottom: 6, left: 0, right: 0,
    alignItems: 'center',
  },
  qrCaption: {
    color: '#1E2A20', fontSize: 12, opacity: 0.85,
    backgroundColor: 'rgba(255,255,255,0.75)', paddingHorizontal: 6, borderRadius: 6,
  },

  barcodeSide: { flex: 1, justifyContent: 'center' },
  barcodeBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  barcodeImg: { width: '100%', height: '100%' },
});
