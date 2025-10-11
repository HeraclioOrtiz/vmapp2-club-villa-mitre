import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../constants/colors';

export default function GimnasioScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  // Verificar acceso al cargar la pantalla
  useEffect(() => {
    if (__DEV__) {
      console.log('🏋️ GimnasioScreen - Usuario:', user?.user_type);
    }

    if (user?.user_type === 'local') {
      Alert.alert(
        'Acceso Restringido',
        'Para acceder al gimnasio necesitas ser socio del club. Contacta con administración para más información.',
        [
          { 
            text: 'Entendido', 
            onPress: () => navigation.goBack(),
            style: 'default' 
          }
        ]
      );
    }
  }, [user, navigation]);

  const handleMiRutinaPress = () => {
    // Navegar a la pantalla de rutina diaria del gym service
    // @ts-ignore - Navegación a DailyWorkout
    navigation.navigate('DailyWorkout');
  };

  const handleRutinaHoyPress = () => {
    // Navegar a la rutina de hoy específicamente
    // @ts-ignore - Navegación a DailyWorkout
    navigation.navigate('DailyWorkout');
  };

  const handlePlanSemanalPress = () => {
    // TODO: Implementar navegación a WeeklyPlanScreen cuando esté disponible
    Alert.alert(
      'Próximamente',
      'La vista del plan semanal estará disponible pronto.',
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header con imagen del gimnasio */}
        <View style={styles.headerSection}>
          <Image
            source={{ uri: 'https://picsum.photos/id/1841/800/400' }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={styles.headerOverlay}>
            <Text style={styles.headerTitle}>GIMNASIO</Text>
            <Text style={styles.headerSubtitle}>
              Centro de entrenamiento completo con equipamiento moderno
            </Text>
          </View>
        </View>

        {/* Información del gimnasio */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="fitness-outline" size={28} color={COLORS.PRIMARY_GREEN} />
              <Text style={styles.infoTitle}>Nuestro Gimnasio</Text>
            </View>
            <Text style={styles.infoDescription}>
              Contamos con equipamiento de última generación para todos los niveles de entrenamiento. 
              Desde máquinas cardiovasculares hasta pesas libres y equipos funcionales.
            </Text>
          </View>

          {/* Horarios */}
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <Ionicons name="time-outline" size={24} color={COLORS.PRIMARY_GREEN} />
              <Text style={styles.scheduleTitle}>Horarios de Atención</Text>
            </View>
            <View style={styles.scheduleContent}>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleDay}>Lunes a Viernes</Text>
                <Text style={styles.scheduleTime}>06:00 - 23:00</Text>
              </View>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleDay}>Sábados</Text>
                <Text style={styles.scheduleTime}>08:00 - 20:00</Text>
              </View>
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleDay}>Domingos</Text>
                <Text style={styles.scheduleTime}>09:00 - 18:00</Text>
              </View>
            </View>
          </View>

          {/* Botón Mi Rutina Principal */}
          <TouchableOpacity style={styles.rutinaButton} onPress={handleMiRutinaPress}>
            <View style={styles.rutinaButtonContent}>
              <Ionicons name="barbell-outline" size={32} color={COLORS.WHITE} />
              <View style={styles.rutinaButtonText}>
                <Text style={styles.rutinaButtonTitle}>MI RUTINA</Text>
                <Text style={styles.rutinaButtonSubtitle}>
                  Accede a tu plan de entrenamiento personalizado
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.WHITE} />
            </View>
          </TouchableOpacity>

          {/* Acciones Rápidas */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.quickActionsTitle}>Acciones Rápidas</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionCard} onPress={handleRutinaHoyPress}>
                <View style={styles.quickActionIcon}>
                  <Ionicons name="today-outline" size={24} color={COLORS.PRIMARY_GREEN} />
                </View>
                <Text style={styles.quickActionTitle}>Rutina de Hoy</Text>
                <Text style={styles.quickActionSubtitle}>Ver ejercicios del día</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionCard} onPress={handlePlanSemanalPress}>
                <View style={styles.quickActionIcon}>
                  <Ionicons name="calendar-outline" size={24} color={COLORS.PRIMARY_GREEN} />
                </View>
                <Text style={styles.quickActionTitle}>Plan Semanal</Text>
                <Text style={styles.quickActionSubtitle}>Vista de la semana</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Servicios adicionales */}
          <View style={styles.servicesSection}>
            <Text style={styles.servicesTitle}>Servicios Disponibles</Text>
            <View style={styles.servicesList}>
              <View style={styles.serviceItem}>
                <Ionicons name="water-outline" size={20} color={COLORS.PRIMARY_GREEN} />
                <Text style={styles.serviceText}>Vestuarios con duchas</Text>
              </View>
              <View style={styles.serviceItem}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.PRIMARY_GREEN} />
                <Text style={styles.serviceText}>Casilleros seguros</Text>
              </View>
              <View style={styles.serviceItem}>
                <Ionicons name="thermometer-outline" size={20} color={COLORS.PRIMARY_GREEN} />
                <Text style={styles.serviceText}>Aire acondicionado</Text>
              </View>
              <View style={styles.serviceItem}>
                <Ionicons name="wifi-outline" size={20} color={COLORS.PRIMARY_GREEN} />
                <Text style={styles.serviceText}>WiFi gratuito</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_PRIMARY,
  },
  scrollContainer: {
    flex: 1,
  },
  headerSection: {
    position: 'relative',
    height: 250,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    fontFamily: 'BarlowCondensed-Bold',
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.WHITE,
    marginTop: 4,
    opacity: 0.9,
  },
  infoSection: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.SHADOW_LIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 12,
    fontFamily: 'BarlowCondensed-Bold',
  },
  infoDescription: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 24,
  },
  scheduleCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.SHADOW_LIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 10,
    fontFamily: 'BarlowCondensed-Bold',
  },
  scheduleContent: {
    gap: 8,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  scheduleDay: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  scheduleTime: {
    fontSize: 16,
    color: COLORS.PRIMARY_GREEN,
    fontWeight: 'bold',
  },
  rutinaButton: {
    backgroundColor: COLORS.PRIMARY_GREEN,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: COLORS.SHADOW_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  rutinaButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  rutinaButtonText: {
    flex: 1,
    marginLeft: 16,
    marginRight: 12,
  },
  rutinaButtonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    fontFamily: 'BarlowCondensed-Bold',
    letterSpacing: 1,
  },
  rutinaButtonSubtitle: {
    fontSize: 14,
    color: COLORS.WHITE,
    opacity: 0.9,
    marginTop: 2,
  },
  servicesSection: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.SHADOW_LIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
    fontFamily: 'BarlowCondensed-Bold',
  },
  servicesList: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 12,
  },
  quickActionsSection: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.SHADOW_LIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
    fontFamily: 'BarlowCondensed-Bold',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 16,
  },
});
