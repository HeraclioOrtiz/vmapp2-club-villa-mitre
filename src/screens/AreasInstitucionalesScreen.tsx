import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

type AreaInstitucional = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen?: string;
  hasDoubleLogo?: boolean;
};

const areasInstitucionales: AreaInstitucional[] = [
  {
    id: '1',
    title: 'Cultura y Educación',
    description: 'Talleres, festivales, espectáculos y actividades culturales',
    icon: 'library-outline',
    screen: 'CulturaEducacion',
    hasDoubleLogo: true
  },
  {
    id: '2',
    title: 'Área Social',
    description: 'Campañas de salud, colectas y capacitaciones',
    icon: 'people-outline',
    screen: 'AreaSocial'
  },
  {
    id: '3',
    title: 'Área de Género y Diversidad',
    description: 'Capacitaciones sobre derechos y diversidad',
    icon: 'heart-outline',
    screen: 'AreaGenero'
  },
];

export default function AreasInstitucionalesScreen() {
  const navigation = useNavigation();

  const handleAreaPress = (area: AreaInstitucional) => {
    if (area.screen) {
      // @ts-ignore - Navegación a pantallas específicas
      navigation.navigate(area.screen);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Áreas Institucionales</Text>
      <Text style={styles.subHeaderText}>
        Conoce las diferentes áreas que trabajan por la comunidad del club
      </Text>
      
      <View style={styles.areasContainer}>
        {areasInstitucionales.map((area) => (
          <TouchableOpacity
            key={area.id}
            style={styles.areaCard}
            onPress={() => handleAreaPress(area)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={area.icon} size={32} color={COLORS.PRIMARY_GREEN} />
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
            <Ionicons name="chevron-forward-outline" size={24} color={COLORS.GRAY_MEDIUM} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
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
  areasContainer: {
    paddingBottom: 30,
  },
  areaCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    position: 'relative',
  },
  doubleLogo: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.PRIMARY_GREEN,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doubleLogoText: {
    color: COLORS.WHITE,
    fontSize: 8,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  areaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_BLACK,
    marginBottom: 4,
  },
  areaDescription: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    lineHeight: 18,
  },
});
