import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

type Contacto = {
  label?: string;
  whatsapp?: string;
  phone?: string;
  address?: string;
  hours?: string;
  web?: string;
};

type Item = { text: string };

type Servicio = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen?: string;
  sections?: {
    title: string;
    description?: string;
    items?: Item[];
    contacts?: Contacto[];
  }[];
};

const toIntl = (raw?: string) => {
  if (!raw) return '';
  let n = raw.replace(/[^\d]/g, '');
  if (!n.startsWith('54')) n = '54' + n; // Argentina por defecto
  return `+${n}`;
};

const ensureHttp = (url?: string) => {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const openWhatsApp = (raw?: string) => {
  const intl = toIntl(raw);
  if (!intl) return;
  Linking.openURL(`https://wa.me/${intl.replace(/[^\d]/g, '')}`).catch(() => {});
};
const openPhone = (raw?: string) => {
  if (!raw) return;
  const clean = raw.replace(/[^\d+]/g, '');
  Linking.openURL(`tel:${clean}`).catch(() => {});
};
const openMaps = (address?: string) => {
  if (!address) return;
  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`).catch(() => {});
};
const openWeb = (url?: string) => {
  if (!url) return;
  Linking.openURL(ensureHttp(url)).catch(() => {});
};

const servicios: Servicio[] = [
  {
    id: '1',
    title: 'Tienda de Productos Oficiales',
    description: 'Indumentaria y artículos institucionales',
    icon: 'storefront-outline',
    sections: [
      {
        title: 'Descripción',
        description:
          'Espacio destinado a la venta de indumentaria y artículos institucionales, promoviendo el sentido de pertenencia y el apoyo a la entidad.',
      },
      {
        title: 'Contacto',
        contacts: [
          {
            label: 'Horario',
            hours:
              'Lunes a viernes de 9.00 a 13.00 y de 16.00 a 20.30 hs. Sábados de 9.00 a 13.00 y de 17.00 a 20.30 hs.',
          },
          { label: 'Dirección', address: 'Garibaldi 119' },
          { label: 'WhatsApp', whatsapp: '291-5767712' },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Mutual 14 de Agosto',
    description: 'Prestaciones y beneficios para socios',
    icon: 'medical-outline',
    sections: [
      {
        title: 'Descripción',
        description:
          'Entidad mutual del Club Villa Mitre que ofrece múltiples prestaciones y beneficios. Si sos socio del Club, sos socio de la Mutual.',
      },
      {
        title: 'Prestaciones',
        items: [
          { text: 'Profesionales de la salud' },
          { text: 'Farmacias' },
          { text: 'Laboratorios' },
          { text: 'Diagnóstico por imágenes' },
          { text: 'Ópticas' },
          { text: 'Cosmetología' },
        ],
      },
      {
        title: 'Contacto',
        contacts: [
          { label: 'WhatsApp', whatsapp: '291-4481924' },
          { label: 'Dirección', address: 'Garibaldi 149' },
          { label: 'Horario', hours: 'Lunes a viernes, de 8.30 a 12.30 hs.' },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Villa Mitre Viajes',
    description: 'Agencia de turismo del Club',
    icon: 'airplane-outline',
    sections: [
      {
        title: 'Descripción',
        description:
          'Agencia de viajes y turismo del Club Villa Mitre. Ofrece salidas regionales, nacionales e internacionales, viajes de quinceañeras y mucho más.',
      },
      {
        title: 'Contacto',
        contacts: [
          { label: 'WhatsApp', whatsapp: '291-4642424' },
          { label: 'Dirección', address: 'Garibaldi 149' },
          { label: 'Horario', hours: 'Lunes a viernes, de 8.00 a 12.00 hs. y de 16.00 a 20.00 hs.' },
          { label: 'Web', web: 'mutual1408clubvillamitre.tur.ar' },
        ],
      },
    ],
  },
];

export default function ServiciosScreen() {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleServicioPress = (s: Servicio) => {
    if (s.screen) {
      // @ts-ignore
      navigation.navigate(s.screen);
    } else {
      setExpanded(prev => ({ ...prev, [s.id]: !prev[s.id] }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Servicios</Text>
      <Text style={styles.subHeaderText}>Accedé a todos los servicios del club</Text>

      <View style={styles.serviciosContainer}>
        {servicios.map(servicio => {
          const isOpen = !!expanded[servicio.id];
          return (
            <View key={servicio.id} style={styles.cardWrapper}>
              <TouchableOpacity style={styles.servicioCard} activeOpacity={0.9} onPress={() => handleServicioPress(servicio)}>
                <View style={styles.iconContainer}>
                  <Ionicons name={servicio.icon} size={32} color={COLORS.PRIMARY_GREEN} />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.servicioTitle}>{servicio.title}</Text>
                  <Text style={styles.servicioDescription}>{servicio.description}</Text>
                </View>

                <Ionicons
                  name={isOpen ? 'chevron-up-outline' : 'chevron-forward-outline'}
                  size={22}
                  color={COLORS.GRAY_MEDIUM}
                />
              </TouchableOpacity>

              {isOpen && servicio.sections?.length ? (
                <View style={styles.detailBox}>
                  {servicio.sections.map((sec, i) => (
                    <View key={`${servicio.id}-sec-${i}`} style={styles.sectionBlock}>
                      <Text style={styles.sectionTitle}>{sec.title}</Text>
                      {sec.description ? <Text style={styles.sectionDesc}>{sec.description}</Text> : null}

                      {sec.items?.length ? (
                        <View style={styles.itemsList}>
                          {sec.items.map((it, idx) => (
                            <View key={idx} style={styles.itemRow}>
                              <Text style={styles.bullet}>•</Text>
                              <Text style={styles.itemText}>{it.text}</Text>
                            </View>
                          ))}
                        </View>
                      ) : null}

                      {sec.contacts?.length ? (
                        <View style={styles.contactsBox}>
                          {sec.contacts.map((c, idx) => (
                            <View key={`c-${idx}`} style={styles.contactRow}>
                              {c.whatsapp ? (
                                <TouchableOpacity
                                  style={[styles.contactPill, { backgroundColor: '#22c55e' }]}
                                  activeOpacity={0.85}
                                  onPress={() => openWhatsApp(c.whatsapp)}
                                >
                                  <Ionicons name="logo-whatsapp" size={16} color={COLORS.WHITE} />
                                  <Text style={styles.contactPillText}>
                                    {c.label ? `${c.label}: ` : ''}{c.whatsapp}
                                  </Text>
                                </TouchableOpacity>
                              ) : null}

                              {c.phone ? (
                                <TouchableOpacity
                                  style={[styles.contactPill, { backgroundColor: '#64748b' }]}
                                  activeOpacity={0.85}
                                  onPress={() => openPhone(c.phone)}
                                >
                                  <Ionicons name="call-outline" size={16} color={COLORS.WHITE} />
                                  <Text style={styles.contactPillText}>
                                    {c.label ? `${c.label}: ` : ''}{c.phone}
                                  </Text>
                                </TouchableOpacity>
                              ) : null}

                              {c.address ? (
                                <TouchableOpacity
                                  style={[styles.contactPill, { backgroundColor: '#0ea5e9' }]}
                                  activeOpacity={0.85}
                                  onPress={() => openMaps(c.address)}
                                >
                                  <Ionicons name="location-outline" size={16} color={COLORS.WHITE} />
                                  <Text style={styles.contactPillText}>{c.address}</Text>
                                </TouchableOpacity>
                              ) : null}

                              {c.hours ? (
                                <View style={[styles.contactPill, { backgroundColor: '#f59e0b' }]}>
                                  <Ionicons name="time-outline" size={16} color={COLORS.WHITE} />
                                  <Text style={styles.contactPillText}>{c.hours}</Text>
                                </View>
                              ) : null}

                              {c.web ? (
                                <TouchableOpacity
                                  style={[styles.contactPill, { backgroundColor: '#10b981' }]}
                                  activeOpacity={0.85}
                                  onPress={() => openWeb(c.web)}
                                >
                                  <Ionicons name="globe-outline" size={16} color={COLORS.WHITE} />
                                  <Text style={styles.contactPillText}>{c.web}</Text>
                                </TouchableOpacity>
                              ) : null}
                            </View>
                          ))}
                        </View>
                      ) : null}
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 20 },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_GREEN,
    textAlign: 'center',
    marginVertical: 20,
  },
  subHeaderText: {
    fontSize: 16,
    color: COLORS.GRAY_DARK,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  serviciosContainer: { paddingBottom: 30 },
  cardWrapper: { marginBottom: 14 },
  servicioCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: { flex: 1 },
  servicioTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.PRIMARY_BLACK, marginBottom: 4 },
  servicioDescription: { fontSize: 14, color: COLORS.GRAY_MEDIUM, lineHeight: 18 },
  detailBox: {
    backgroundColor: COLORS.WHITE,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginTop: -10,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  sectionBlock: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.PRIMARY_BLACK, marginBottom: 6 },
  sectionDesc: { fontSize: 14, color: COLORS.GRAY_DARK, marginBottom: 6, lineHeight: 20 },
  itemsList: { marginTop: 4, gap: 6 },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bullet: { color: COLORS.PRIMARY_GREEN, fontSize: 16, lineHeight: 20 },
  itemText: { flex: 1, color: COLORS.PRIMARY_BLACK, fontSize: 14, lineHeight: 20 },
  contactsBox: { marginTop: 6, gap: 8 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  contactPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  contactPillText: { color: COLORS.WHITE, fontSize: 12, fontWeight: '600' },
});
