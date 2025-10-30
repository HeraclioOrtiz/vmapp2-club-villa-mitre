import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  Pressable,
} from 'react-native';
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

type SubSeccion = {
  titulo: string;
  descripcion?: string;
  items?: Item[];
  contactos?: Contacto[];
};

type AreaInstitucional = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  hasDoubleLogo?: boolean;
  secciones?: SubSeccion[];
};

const toIntl = (raw?: string) => {
  if (!raw) return '';
  let n = raw.replace(/[^\d]/g, '');
  if (!n.startsWith('54')) n = '54' + n;
  return `+${n}`;
};
const ensureHttp = (url?: string) => (!url ? '' : /^https?:\/\//i.test(url) ? url : `https://${url}`);
const openWhatsApp = (raw?: string) => {
  const intl = toIntl(raw);
  if (!intl) return;
  Linking.openURL(`https://wa.me/${intl.replace(/[^\d]/g, '')}`).catch(() => {});
};
const openPhone = (raw?: string) => {
  if (!raw) return;
  Linking.openURL(`tel:${raw.replace(/[^\d+]/g, '')}`).catch(() => {});
};
const openMaps = (address?: string) => {
  if (!address) return;
  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`).catch(() => {});
};
const openWeb = (url?: string) => url && Linking.openURL(ensureHttp(url)).catch(() => {});

const areasInstitucionales: AreaInstitucional[] = [
  {
    id: '1',
    title: 'Educación y Cultura',
    description: 'Jardín “La Ciudad” y propuestas artísticas y formativas',
    icon: 'library-outline',
    hasDoubleLogo: true,
    secciones: [
      {
        titulo: 'Jardín de Infantes y Maternal “La Ciudad”',
        descripcion: 'Propuesta educativa para niños y niñas de 18 meses a 5 años.',
        items: [
          { text: 'Talleres deportivos' },
          { text: 'Jornada extendida' },
          { text: 'Natación' },
          { text: 'Inglés' },
          { text: 'Música' },
          { text: 'Articulación con nivel primario' },
        ],
        contactos: [
          { label: 'WhatsApp', whatsapp: '291-5081186' },
          { label: 'Dirección', address: 'Maipú 2361' },
          { label: 'Horario de atención', hours: 'Lunes a viernes, de 8.00 a 17.00 hs.' },
        ],
      },
      {
        titulo: 'Área Cultural',
        descripcion:
          'Desarrolla propuestas artísticas, formativas y recreativas que fortalecen la identidad, la participación y la vida comunitaria.',
        items: [
          { text: 'Canto' },
          { text: 'Tango' },
          { text: 'Danzas Árabes' },
          { text: 'Ritmos y Danzas' },
          { text: 'Teatro Antiestrés' },
          { text: 'Lengua de Señas' },
        ],
        contactos: [{ label: 'Subcomisión de Cultura', phone: '291-5348520' }],
      },
    ],
  },
  {
    id: '2',
    title: 'Área Social',
    description: 'Programas de inclusión, acompañamiento y contención',
    icon: 'people-outline',
    secciones: [
      {
        titulo: 'Área Social',
        descripcion:
          'Promueve programas y acciones de inclusión, acompañamiento y contención para personas y familias de nuestra comunidad.',
        items: [
          { text: 'Programa de becas deportivas' },
          { text: 'Articulación con instituciones intermedias' },
          { text: 'Acciones solidarias' },
        ],
        contactos: [{ label: 'WhatsApp', whatsapp: '291-4416377' }],
      },
    ],
  },
  {
    id: '3',
    title: 'Género y Diversidad',
    description: 'Igualdad de derechos y erradicación de violencias',
    icon: 'heart-outline',
    secciones: [
      {
        titulo: 'Área de Género y Diversidad',
        descripcion:
          'Fomenta la igualdad de derechos, la sensibilización y la erradicación de todo tipo de violencia o discriminación por motivos de género.',
        items: [
          { text: 'Capacitaciones internas' },
          { text: 'Jornadas de concientización' },
          { text: 'Articulación con otras instituciones' },
        ],
        contactos: [{ label: 'WhatsApp', whatsapp: '291-4416377' }],
      },
    ],
  },
];

export default function AreasInstitucionalesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaInstitucional | null>(null);

  const openAreaModal = (area: AreaInstitucional) => {
    setSelectedArea(area);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.headerText}>Áreas Institucionales</Text>
        <Text style={styles.subHeaderText}>
          Conocé las diferentes áreas que trabajan por la comunidad del club
        </Text>

        <View style={styles.areasContainer}>
          {areasInstitucionales.map(area => (
            <TouchableOpacity
              key={area.id}
              activeOpacity={0.9}
              style={styles.areaCard}
              onPress={() => openAreaModal(area)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={area.icon} size={28} color={COLORS.PRIMARY_GREEN} />
                {area.hasDoubleLogo && (
                  <View style={styles.doubleLogo}>
                    <Text style={styles.doubleLogoText}>••</Text>
                  </View>
                )}
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.areaTitle}>{area.title}</Text>
                <Text style={styles.areaDescription}>{area.description}</Text>
              </View>

              <Ionicons name="information-circle-outline" size={22} color={COLORS.GRAY_MEDIUM} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* MODAL DETALLE */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <Ionicons
                  name={(selectedArea?.icon ?? 'information-circle-outline') as any}
                  size={22}
                  color={COLORS.PRIMARY_GREEN}
                />
              </View>
              <Text style={styles.modalTitle}>{selectedArea?.title}</Text>
              <Pressable onPress={() => setModalVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={22} color={COLORS.GRAY_DARK} />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>{selectedArea?.description}</Text>

            <ScrollView style={styles.modalScroll} contentContainerStyle={{ paddingBottom: 16 }}>
              {selectedArea?.secciones?.map((sec, idx) => (
                <View key={`sec-${idx}`} style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>{sec.titulo}</Text>
                  {sec.descripcion ? <Text style={styles.sectionDesc}>{sec.descripcion}</Text> : null}

                  {sec.items?.length ? (
                    <View style={styles.itemsList}>
                      {sec.items.map((it, i) => (
                        <View key={`item-${i}`} style={styles.itemRow}>
                          <Text style={styles.bullet}>•</Text>
                          <Text style={styles.itemText}>{it.text}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}

                  {sec.contactos?.length ? (
                    <View style={styles.contactsBox}>
                      {sec.contactos.map((c, i) => (
                        <View key={`ct-${i}`} style={styles.contactRow}>
                          {c.whatsapp ? (
                            <TouchableOpacity
                              style={[styles.contactPill, { backgroundColor: '#22c55e' }]}
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
            </ScrollView>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setModalVisible(false)}>
              <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.WHITE} />
              <Text style={styles.primaryBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ====== STYLES ====== */
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
  areasContainer: { paddingBottom: 30, gap: 12 },
  areaCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    padding: 16,
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
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  doubleLogo: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.PRIMARY_GREEN,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doubleLogoText: { color: COLORS.WHITE, fontSize: 8, fontWeight: 'bold' },
  textContainer: { flex: 1 },
  areaTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.PRIMARY_BLACK, marginBottom: 2 },
  areaDescription: { fontSize: 14, color: COLORS.GRAY_MEDIUM, lineHeight: 18 },

  /* MODAL */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  modalIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: COLORS.PRIMARY_BLACK },
  modalSubtitle: { fontSize: 14, color: COLORS.GRAY_DARK, marginBottom: 8, lineHeight: 20 },
  modalScroll: { marginTop: 4 },

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

  primaryBtn: {
    marginTop: 8,
    backgroundColor: COLORS.PRIMARY_GREEN,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: { color: COLORS.WHITE, fontWeight: '700', fontSize: 16 },
});
